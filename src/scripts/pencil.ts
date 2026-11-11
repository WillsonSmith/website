// The hand-drawn layer for the Sheet.
//
// Every [data-rough] element already has a plain CSS version of its line
// (`.css-line`, or a CSS border). The layout sets `html.hand` before first
// paint when this layer is expected; we confirm with `html.hand-ready` once
// Rough.js has loaded. If we never confirm, the CSS lines come back.
//
// Timing follows modfox.ca (site/src/sheet/pen.ts, rough.ts, shade.ts):
//
// - One pencil, a whole group at a time. A group is the cover or one sheet:
//   everything in it (rule, figure box, plate edge, notes) starts at once,
//   as one gesture. The next group starts when this one is two-thirds done,
//   and nothing waits more than 5s.
// - A group starts the first time it's well into view (above 88% of the
//   viewport). One already scrolled past is put down finished.
// - Strokes reveal in held drawings at 12 a second, one drawing per ~120px,
//   2–12 drawings; with a backlog they hurry (1 + 0.5 per group waiting).
//   A stroke whose drawings would each jump more than ~120px goes on ones
//   (twice the steps, same duration), so long sides don't leap.
// - A box goes round one side at a time (modfox-kit's rough.ts). Rough.js
//   draws a box as one path of separate strokes, one per side (two with
//   "gone over twice"), and a dash animation restarts at each stroke, so
//   drawn on as one path every side grew at once. splitStrokes splits it;
//   each side starts on the last drawing of the one before, and a second
//   pass follows its side two drawings behind.
// - A figure's inside is shaded in (8 drawings) starting halfway round its
//   box; its note is written and its arrow drawn alongside the shading
//   (`data-after` names the figure a note belongs to).
// - The sheet's edge is sketched like a plate's ("gone over twice"), but
//   it isn't drawn on: it's the paper the drawing is made on, so it's there
//   as soon as Rough.js loads. Its bowing is scaled down by its length, since
//   Rough.js bows a side in proportion to how long it is (modfox-kit 0.3.0).

type Rough = typeof import("roughjs").default;
type RoughSVG = ReturnType<Rough["svg"]>;
type Options = Record<string, unknown>;

const FRAME_MS = 1000 / 12;
const root = document.documentElement;
const SVG_NS = "http://www.w3.org/2000/svg";

/** Pencil travel per drawing, in px. */
const PX_PER_DRAWING = 120;
const MIN_DRAWINGS = 2;
const MAX_DRAWINGS = 12;
/** How many drawings a box's second pass over a side starts after its first. */
const FOLLOW_DRAWINGS = 2;
/** How much quicker each group waiting behind this one makes it draw. */
const HURRY_PER_WAITING = 0.5;
/** How far through a group the pencil moves on to the next one. */
const HANDOFF = 2 / 3;
/** Longest a group waits for the pencil before starting anyway, in ms. */
const MAX_WAIT_MS = 5000;
/** A group starts once its top is above this fraction of the viewport. */
const IN_VIEW = 0.88;
/** Held drawings to shade in a figure, and the avatar. */
const FIGURE_DRAWINGS = 8;
const AVATAR_DRAWINGS = 5;
/** The side length, in px, whose bowing the sheet's longest side keeps (about a plate's). */
const SHEET_BOW_REF_PX = 600;

const LEVELS: Record<string, Options> = {
  straightedge: { roughness: 0.55, bowing: 0.6, disableMultiStroke: true, preserveVertices: true },
  twice: { roughness: 1.2, bowing: 1.2, disableMultiStroke: false, preserveVertices: true },
  sketch: { roughness: 0.9, bowing: 0.8, preserveVertices: true },
};

/** A stable seed per element, so a redraw keeps the same wobble. */
function seedOf(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (Math.abs(h) % 2147483646) + 1;
}

/** One hand-drawn thing: a rule, a box, an arrow and its note. */
type Item = {
  el: HTMLElement | SVGElement;
  /** handwriting written in before the strokes (a note's words) */
  text: SVGTextElement | null;
  /** what's shaded in once the strokes are underway (a figure's inside) */
  inside: { target: Element; hatch: HTMLElement } | null;
  /** id of the item whose shading this one draws alongside */
  after: string | null;
  drawn: boolean;
  /** (re)builds the rough paths; returns them */
  build: () => SVGPathElement[];
  paths: SVGPathElement[];
};

/** Everything that draws together: the cover, or one sheet. */
type Group = { el: Element; items: Item[]; queued: boolean; since: number };

/** An absolutely positioned SVG over an HTML element, in pixel units. */
function overlay(el: HTMLElement): SVGSVGElement {
  let svg = el.querySelector<SVGSVGElement>(":scope > svg.rough-layer");
  if (!svg) {
    svg = document.createElementNS(SVG_NS, "svg");
    svg.classList.add("rough-layer");
    svg.setAttribute("aria-hidden", "true");
    el.appendChild(svg);
  }
  svg.replaceChildren();
  return svg;
}

/**
 * Split each path in `g` into one path per stroke (each starts with its own
 * `M`), tagged with its side (`data-side`) and pass (`data-pass`), so a box
 * can be drawn round one side at a time instead of every side at once.
 *
 * @param passes - Strokes per side: 2 for Rough.js multi-stroke, else 1.
 */
function splitStrokes(g: Element, passes: 1 | 2): void {
  for (const path of [...g.querySelectorAll("path")]) {
    const strokes = (path.getAttribute("d") ?? "").split(/(?=M)/).filter((d) => d.trim());
    if (strokes.length < 2) continue;
    strokes.forEach((d, i) => {
      const stroke = path.cloneNode() as SVGPathElement; // keeps its stroke settings
      stroke.setAttribute("d", d);
      stroke.dataset.side = String(Math.floor(i / passes));
      stroke.dataset.pass = String((i % passes) + 1);
      path.before(stroke);
    });
    path.remove();
  }
}

function makeItem(el: HTMLElement | SVGElement, rough: Rough): Item | null {
  const kind = el.dataset.rough;
  const seed = seedOf(el.dataset.seed ?? kind ?? "x");
  const opts = (level: string, extra: Options = {}) => ({
    ...LEVELS[level],
    seed,
    stroke: "currentColor",
    ...extra,
  });

  let build: () => SVGPathElement[];
  let text: SVGTextElement | null = null;
  let inside: Item["inside"] = null;

  if (kind === "rule" && el instanceof HTMLElement) {
    build = () => {
      const svg = overlay(el);
      const rc: RoughSVG = rough.svg(svg);
      const w = el.clientWidth;
      const y = el.clientHeight / 2;
      svg.appendChild(rc.line(0, y, w, y, opts("straightedge", { strokeWidth: 1.2 })));
      return [...svg.querySelectorAll("path")];
    };
  } else if (kind === "rect" && el instanceof HTMLElement) {
    // A box edge, drawn over the element's (now transparent) 1px border.
    const level = el.dataset.level ?? "twice";
    const target = el.querySelector(".chart");
    const hatch = el.querySelector<HTMLElement>(".hatch");
    if (target && hatch) inside = { target, hatch };
    build = () => {
      const svg = overlay(el);
      const rc: RoughSVG = rough.svg(svg);
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      svg.style.inset = "-1px";
      svg.style.width = `${w}px`;
      svg.style.height = `${h}px`;
      const box = rc.rectangle(0.5, 0.5, w - 1, h - 1, opts(level, { strokeWidth: 1.1 }));
      // Round one side at a time; "straightedge" boxes have one pass, the others two.
      splitStrokes(box, LEVELS[level]?.disableMultiStroke ? 1 : 2);
      svg.appendChild(box);
      return [...svg.querySelectorAll("path")];
    };
  } else if (kind === "sheet" && el instanceof HTMLElement) {
    // The sheet's edge, over its (soon transparent) border box.
    build = () => {
      const svg = overlay(el);
      const rc: RoughSVG = rough.svg(svg);
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const border = el.clientLeft;
      svg.style.inset = `${-border}px`;
      svg.style.width = `${w}px`;
      svg.style.height = `${h}px`;
      const bowing = (LEVELS.twice.bowing as number) * Math.min(1, SHEET_BOW_REF_PX / Math.max(w, h));
      svg.appendChild(rc.rectangle(0.5, 0.5, w - 1, h - 1, opts("twice", { bowing, strokeWidth: 1.1 })));
      return [...svg.querySelectorAll("path")];
    };
  } else if (kind === "arrow" && el instanceof SVGGraphicsElement) {
    // An <svg> of its own, or a <g> inside a chart (drawn in its units).
    const host = el instanceof SVGSVGElement ? el : el.ownerSVGElement!;
    text = el.closest(".chart__pencil")?.querySelector("text") ?? null;
    build = () => {
      el.querySelectorAll(":scope > g.rough-arrow").forEach((g) => g.remove());
      const g = document.createElementNS(SVG_NS, "g");
      g.classList.add("rough-arrow");
      const rc: RoughSVG = rough.svg(host);
      el.querySelectorAll<SVGPathElement>(".css-line").forEach((p, i) => {
        g.appendChild(rc.path(p.getAttribute("d")!, opts("sketch", { seed: seed + i, strokeWidth: 1.4 })));
      });
      el.appendChild(g);
      return [...g.querySelectorAll("path")];
    };
  } else {
    return null;
  }

  return { el, text, inside, after: el.dataset.after ?? null, drawn: false, build, paths: [] };
}

/** Hide a stroke fully, ready to be drawn on. */
function blank(path: SVGPathElement) {
  const len = path.getTotalLength();
  path.style.strokeDasharray = `${len} ${len}`;
  path.style.strokeDashoffset = `${len}`;
}

/** Held keyframes for `drawings` drawings. */
function held(drawings: number, at: (t: number) => Keyframe): Keyframe[] {
  const frames: Keyframe[] = [];
  for (let i = 0; i <= drawings; i++) frames.push({ ...at(i / drawings), easing: "steps(1, end)" });
  return frames;
}

/**
 * Shade something in: a diagonal edge crosses it in held drawings, with a
 * band of pencil hatching riding the edge. The hatching only reveals; it's
 * gone once the picture is in. Returns when it ends, delay included, in ms.
 *
 * `hidden` targets start clipped away by CSS (a figure under `.hand`), so
 * they're unclipped explicitly at the end; the avatar is simply visible
 * once its animation ends.
 */
function shade(
  target: Element,
  hatch: HTMLElement,
  { delay = 0, drawings = FIGURE_DRAWINGS, hidden = false, band: BAND = 0.22 } = {},
): number {
  const span = 1 + BAND / 2;
  const tri = (s: number) => `polygon(0% 0%, ${s * 200}% 0%, 0% ${s * 200}%)`;
  const band = (s: number) => {
    const a = Math.max(0, s - BAND) * 200;
    return `polygon(${a}% 0%, ${s * 200}% 0%, 0% ${s * 200}%, 0% ${a}%)`;
  };
  const duration = drawings * FRAME_MS;
  const timing = { duration, delay, fill: hidden ? ("both" as const) : ("backwards" as const) };

  hatch.style.display = "block";
  const reveal = target.animate(
    held(drawings, (t) => ({ clipPath: tri(Math.max(0, t * span - BAND / 2)) })),
    timing,
  );
  hatch
    .animate(held(drawings, (t) => ({ clipPath: band(t * span) })), { ...timing, fill: "both" })
    .finished.then((a) => {
      hatch.style.display = "";
      a.cancel();
    });
  if (hidden) {
    reveal.finished.then(() => {
      (target as HTMLElement).style.clipPath = "none";
      reveal.cancel();
    });
  }
  return delay + duration;
}

/**
 * Draw one item on, starting after `delay`: its words written in (left to
 * right), then its strokes, each starting halfway through the one before
 * so the item reads as one gesture. A figure's inside starts shading
 * halfway round its box.
 *
 * Returns when it ends and, for a figure, when its shading starts (for the
 * note that draws alongside), both in ms from now.
 */
function drawOn(item: Item, delay: number, hurry: number): { end: number; shadeAt: number } {
  item.drawn = true;
  let start = delay;
  let end = delay;

  if (item.text) {
    const words = item.text;
    const chars = words.textContent?.length ?? 8;
    const drawings = Math.max(MIN_DRAWINGS, Math.min(8, Math.round(chars / 3 / hurry)));
    const duration = drawings * FRAME_MS;
    words
      .animate(
        held(drawings, (t) => ({ clipPath: `inset(-20% ${(1 - t) * 100}% -20% -5%)` })),
        { duration, delay: start, fill: "forwards" },
      )
      .finished.then((a) => {
        words.style.clipPath = "none";
        a.cancel();
      });
    // the arrow follows the words halfway through
    start += duration / 2;
    end = start + duration / 2;
  }

  let firstHalf = start;
  /** When the side being drawn started: its second pass follows from there. */
  let sideStart = start;
  item.paths.forEach((path, i) => {
    const len = path.getTotalLength();
    const drawings = Math.min(MAX_DRAWINGS, Math.max(MIN_DRAWINGS, Math.round(len / PX_PER_DRAWING / hurry)));
    const duration = drawings * FRAME_MS;
    // Big moves go on ones: twice the held steps over the same duration.
    const steps = len / drawings > PX_PER_DRAWING ? drawings * 2 : drawings;
    const side = path.dataset.side;
    const second = path.dataset.pass === "2";
    const at = second ? sideStart + FOLLOW_DRAWINGS * FRAME_MS : start;
    path
      .animate(
        held(steps, (t) => ({ strokeDashoffset: `${len * (1 - t)}` })),
        { duration, delay: at, fill: "forwards" },
      )
      .finished.then(() => {
        // settle: drop the dash so a later resize/redraw isn't clipped
        path.style.strokeDasharray = "";
        path.style.strokeDashoffset = "";
      });
    end = Math.max(end, at + duration);
    if (second) return; // follows its side; doesn't move the pencil on
    sideStart = at;
    if (side === undefined) {
      if (i === 0) firstHalf = at + duration / 2;
      start += Math.max(FRAME_MS, duration / 2); // the next stroke halfway through this one
    } else {
      if (side === "2") firstHalf = at; // halfway round the box: its third side starts
      start += Math.max(1, drawings - 1) * FRAME_MS; // round the box: on the last drawing
    }
  });

  let shadeAt = end;
  if (item.inside) {
    shadeAt = firstHalf;
    const drawings = Math.max(4, Math.round(FIGURE_DRAWINGS / hurry));
    // a narrower band than the avatar's: a figure is wide, and the band scales with it
    end = Math.max(end, shade(item.inside.target, item.inside.hatch, { delay: shadeAt, drawings, hidden: true, band: 0.12 }));
  }
  return { end, shadeAt };
}

/** Put an item down at once, finished. */
function settleItem(item: Item) {
  item.drawn = true;
  item.paths.forEach((p) => {
    p.style.strokeDasharray = "";
    p.style.strokeDashoffset = "";
  });
  if (item.text) item.text.style.clipPath = "none";
  if (item.inside) (item.inside.target as HTMLElement).style.clipPath = "none";
}

/**
 * Draw a whole group now: every item starts at once, except notes, which
 * start with their figure's shading. Returns how long it takes, in ms.
 */
function drawGroup(group: Group, hurry: number): number {
  const shadeAt = new Map<string, number>();
  let end = 0;
  for (const item of group.items.filter((i) => !i.after)) {
    const r = drawOn(item, 0, hurry);
    if (item.el.id) shadeAt.set(item.el.id, r.shadeAt);
    end = Math.max(end, r.end);
  }
  for (const item of group.items.filter((i) => i.after)) {
    end = Math.max(end, drawOn(item, shadeAt.get(item.after!) ?? 0, hurry).end);
  }
  return end;
}

async function start() {
  if (!root.classList.contains("hand")) return;

  let rough: Rough;
  try {
    rough = (await import("roughjs")).default;
  } catch {
    root.classList.remove("hand");
    return;
  }

  const items = [...document.querySelectorAll<HTMLElement | SVGElement>("[data-rough]")]
    .map((el) => makeItem(el, rough))
    .filter((i): i is Item => i !== null);

  // Group by sheet (or the cover); anything outside one stands alone. The
  // sheet's edge is no group's: it's put down at once, finished.
  const groups = new Map<Element, Group>();
  for (const item of items) {
    if (item.el.dataset.rough === "sheet") continue;
    const el = item.el.closest(".sec, .title") ?? item.el;
    const group: Group = groups.get(el) ?? { el, items: [], queued: false, since: 0 };
    group.items.push(item);
    groups.set(el, group);
  }

  for (const item of items) {
    item.paths = item.build();
    if (item.el.dataset.rough === "sheet") settleItem(item);
    else item.paths.forEach(blank);
  }
  root.classList.add("hand-ready");

  // ---- one pencil ----
  const queue: Group[] = [];
  let freeAt = 0;
  let timer = 0;

  const next = () => {
    clearTimeout(timer);
    const now = performance.now();
    const go = (g: Group) => {
      queue.splice(queue.indexOf(g), 1);
      const hurry = 1 + queue.length * HURRY_PER_WAITING;
      freeAt = Math.max(freeAt, now + drawGroup(g, hurry) * HANDOFF);
    };
    queue.filter((g) => now - g.since >= MAX_WAIT_MS).forEach(go);
    if (queue.length && now >= freeAt) go(queue[0]);
    if (!queue.length) return;
    const due = Math.min(freeAt, ...queue.map((g) => g.since + MAX_WAIT_MS));
    timer = window.setTimeout(next, Math.max(0, due - now));
  };

  // Checked on scroll rather than with an IntersectionObserver: a jump
  // (an anchor link, a restored scroll position) can carry a sheet from
  // below the viewport to above it without it ever intersecting, and it
  // must never be left undrawn.
  const all = [...groups.values()];
  let ticking = false;
  const check = () => {
    ticking = false;
    const line = innerHeight * IN_VIEW;
    const arriving: [number, Group][] = [];
    for (const group of all) {
      if (group.queued) continue;
      const r = group.el.getBoundingClientRect();
      if (r.bottom < 0) {
        group.queued = true; // already passed: just be there
        group.items.forEach(settleItem);
      } else if (r.top < line) {
        arriving.push([r.top, group]);
      }
    }
    const now = performance.now();
    arriving
      .sort((a, b) => a[0] - b[0])
      .forEach(([, g]) => {
        g.queued = true;
        g.since = now;
        queue.push(g);
      });
    if (all.every((g) => g.queued)) {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    }
    next();
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(check);
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  check();

  // Pixel-sized overlays redraw on resize with the same seed. Items already
  // drawn redraw finished (never traced over again); others stay blank.
  const byEl = new Map<Element, Item>(items.map((i) => [i.el, i]));
  const ro = new ResizeObserver((entries) => {
    for (const e of entries) {
      const item = byEl.get(e.target);
      if (!item) continue;
      item.paths = item.build();
      if (!item.drawn) item.paths.forEach(blank);
    }
  });
  items
    .filter((i) => ["rule", "rect", "sheet"].includes(i.el.dataset.rough ?? ""))
    .forEach((i) => ro.observe(i.el));
}

/** Shade the avatar in on load (it isn't hidden first: it's real content). */
function shadeAvatar() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const img = document.querySelector(".avatar__img--a");
  const hatch = document.querySelector<HTMLElement>(".avatar__hatch");
  if (img && hatch) shade(img, hatch, { delay: 2 * FRAME_MS, drawings: AVATAR_DRAWINGS });
}

/** Theme toggle: light ⇄ dark. Defaults to the system. */
function themeToggle() {
  const btn = document.querySelector<HTMLButtonElement>(".theme-toggle");
  const value = btn?.querySelector(".theme-toggle__value");
  if (!btn || !value) return;
  const sys = matchMedia("(prefers-color-scheme: dark)");
  const current = () => root.dataset.theme ?? (sys.matches ? "dark" : "light");
  const paint = () => {
    const dark = current() === "dark";
    value.textContent = dark ? "Dark" : "Light";
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", `Theme: ${dark ? "dark" : "light"}. Switch to ${dark ? "light" : "dark"}`);
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
      m.content = getComputedStyle(root).getPropertyValue("--paper").trim();
    });
  };
  btn.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("sheet-theme", next);
    } catch {}
    paint();
  });
  sys.addEventListener("change", paint);
  paint();
}

themeToggle();
shadeAvatar();
// After first paint, so the drawing layer never blocks content.
setTimeout(start, 0);

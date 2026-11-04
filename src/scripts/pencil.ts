// The hand-drawn layer for the Sheet.
//
// Every [data-rough] element already has a plain CSS version of its line
// (`.css-line`, or a CSS border). The layout sets `html.hand` before first
// paint when this layer is expected; we confirm with `html.hand-ready` once
// Rough.js has loaded. If we never confirm, the CSS lines come back.
//
// Lines are drawn on the first time they're well into view, one item at a
// time ("one pencil"), in held drawings on the 12fps beat. Never tweened.
// An item can name another it follows (`data-after`): a figure's note is
// written in only once the pencil has finished the figure's box.

type Rough = typeof import("roughjs").default;
type RoughSVG = ReturnType<Rough["svg"]>;
type Options = Record<string, unknown>;

const FRAME_MS = 1000 / 12;
const root = document.documentElement;
const SVG_NS = "http://www.w3.org/2000/svg";

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

type Item = {
  el: HTMLElement | SVGElement;
  /** real content (figures) draws before decoration (rules, notes) */
  content: boolean;
  /** handwriting written in before the strokes (a note's words) */
  text: SVGTextElement | null;
  /** items that wait for this one to finish */
  followers: Item[];
  /** waits for another item rather than for the viewport */
  follows: boolean;
  drawn: boolean;
  queued: boolean;
  /** (re)builds the rough paths; returns them */
  build: () => SVGPathElement[];
  paths: SVGPathElement[];
};

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
    build = () => {
      const svg = overlay(el);
      const rc: RoughSVG = rough.svg(svg);
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      svg.style.inset = "-1px";
      svg.style.width = `${w}px`;
      svg.style.height = `${h}px`;
      svg.appendChild(rc.rectangle(0.5, 0.5, w - 1, h - 1, opts(level, { strokeWidth: 1.1 })));
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

  return {
    el,
    content: el.closest(".fig") !== null && kind === "rect",
    text,
    followers: [],
    follows: false,
    drawn: false,
    queued: false,
    build,
    paths: [],
  };
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
 * Draw one item on: write its words in (left to right, a few letters a
 * drawing), then its strokes. Strokes overlap: each starts halfway through
 * the one before, so the item reads as one gesture.
 *
 * `handoff` resolves when the pencil may start the next item (about
 * two-thirds through); `done` when every mark is down.
 */
function drawOn(item: Item, hurry: number): { handoff: Promise<void>; done: Promise<void> } {
  item.drawn = true;
  let start = 0;
  let end = 0;

  if (item.text) {
    const words = item.text;
    const chars = words.textContent?.length ?? 8;
    const drawings = Math.max(2, Math.min(8, Math.round(chars / 3 / hurry)));
    const duration = drawings * FRAME_MS;
    words
      .animate(
        held(drawings, (t) => ({ clipPath: `inset(-20% ${(1 - t) * 100}% -20% -5%)` })),
        { duration, fill: "forwards" },
      )
      .finished.then((a) => {
        words.style.clipPath = "none";
        a.cancel();
      });
    start = duration;
    end = duration;
  }

  for (const path of item.paths) {
    const len = path.getTotalLength();
    const drawings = Math.max(2, Math.min(12, Math.round(len / 120 / hurry)));
    const duration = drawings * FRAME_MS;
    path
      .animate(
        held(drawings, (t) => ({ strokeDashoffset: `${len * (1 - t)}` })),
        { duration, delay: start, fill: "forwards" },
      )
      .finished.then(() => {
        // settle: drop the dash so a later resize/redraw isn't clipped
        path.style.strokeDasharray = "";
        path.style.strokeDashoffset = "";
      });
    end = Math.max(end, start + duration);
    start += duration / 2;
  }

  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  return { handoff: wait((end * 2) / 3), done: wait(end) };
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

  const els = [...document.querySelectorAll<HTMLElement | SVGElement>("[data-rough]")];
  const byEl = new Map<Element, Item>();
  for (const el of els) {
    const item = makeItem(el, rough);
    if (item) byEl.set(el, item);
  }
  const items = [...byEl.values()];

  // Wire up "draw this after that".
  for (const item of items) {
    const after = item.el.dataset.after;
    const lead = after ? byEl.get(document.getElementById(after)!) : undefined;
    if (lead) {
      lead.followers.push(item);
      item.follows = true;
    }
  }

  for (const item of items) {
    item.paths = item.build();
    item.paths.forEach(blank);
  }
  root.classList.add("hand-ready");

  // ---- one pencil ----
  const queue: Item[] = [];
  let busy = false;

  const enqueue = (item: Item, first = false) => {
    if (item.queued) return;
    item.queued = true;
    if (first) queue.unshift(item);
    else queue.push(item);
  };

  const pump = async () => {
    if (busy) return;
    busy = true;
    while (queue.length) {
      // content first, then document order (the queue is filled top-down);
      // followers were put at the front on purpose and stay there.
      const next = queue[0].follows
        ? queue.shift()!
        : (queue.sort((a, b) => Number(b.content) - Number(a.content)), queue.shift()!);
      const hurry = 1 + queue.length * 0.6;
      const { handoff, done } = drawOn(next, hurry);
      if (next.followers.length) {
        // The follower picks up where this one leaves off, not at handoff.
        await done;
        next.followers.forEach((f) => enqueue(f, true));
      } else {
        await handoff;
      }
    }
    busy = false;
  };

  /** Put an item (and whatever follows it) down at once, finished. */
  const settle = (item: Item) => {
    item.drawn = item.queued = true;
    item.paths.forEach((p) => {
      p.style.strokeDasharray = "";
      p.style.strokeDashoffset = "";
    });
    if (item.text) item.text.style.clipPath = "none";
    item.followers.forEach(settle);
  };

  // Checked on scroll rather than with an IntersectionObserver: a jump
  // (an anchor link, a restored scroll position) can carry an item from
  // below the viewport to above it without it ever intersecting, and it
  // must never be left undrawn.
  const leads = items.filter((i) => !i.follows);
  let ticking = false;
  const check = () => {
    ticking = false;
    // "well into view": the bottom fifth of the viewport doesn't count
    const line = innerHeight * 0.8;
    const arriving: [number, Item][] = [];
    for (const item of leads) {
      if (item.queued) continue;
      const r = item.el.getBoundingClientRect();
      if (r.bottom < 0) settle(item); // already passed: just be there
      else if (r.top < line) arriving.push([r.top, item]);
    }
    arriving.sort((a, b) => a[0] - b[0]).forEach(([, item]) => enqueue(item));
    if (leads.every((i) => i.queued)) removeEventListener("scroll", onScroll);
    pump();
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
  const ro = new ResizeObserver((entries) => {
    for (const e of entries) {
      const item = byEl.get(e.target);
      if (!item) continue;
      item.paths = item.build();
      if (!item.drawn) item.paths.forEach(blank);
    }
  });
  items
    .filter((i) => i.el.dataset.rough === "rule" || i.el.dataset.rough === "rect")
    .forEach((i) => ro.observe(i.el));
}

/**
 * Shade the avatar in: a diagonal edge crosses it in 8 held drawings on
 * twos, with a band of pencil hatching riding the edge. The hatching only
 * reveals; it's gone once the picture is in.
 */
function shadeIn() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const img = document.querySelector<HTMLElement>(".avatar__img--a");
  const hatch = document.querySelector<HTMLElement>(".avatar__hatch");
  if (!img || !hatch) return;

  const DRAWINGS = 8;
  const BAND = 0.22;
  const tri = (s: number) => `polygon(0% 0%, ${s * 200}% 0%, 0% ${s * 200}%)`;
  const band = (s: number) => {
    const a = Math.max(0, s - BAND) * 200;
    return `polygon(${a}% 0%, ${s * 200}% 0%, 0% ${s * 200}%, 0% ${a}%)`;
  };
  const span = 1 + BAND / 2;
  const imgFrames = held(DRAWINGS, (t) => ({ clipPath: tri(Math.max(0, t * span - BAND / 2)) }));
  const hatchFrames = held(DRAWINGS, (t) => ({ clipPath: band(t * span) }));
  const timing = { duration: DRAWINGS * 2 * FRAME_MS, delay: 2 * FRAME_MS, fill: "backwards" as const };
  hatch.style.display = "block";
  img.animate(imgFrames, timing);
  hatch.animate(hatchFrames, timing).finished.then(() => (hatch.style.display = ""));
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
shadeIn();
// After first paint, so the drawing layer never blocks content.
setTimeout(start, 0);

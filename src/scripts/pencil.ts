// The hand-drawn layer for the Sheet draft.
//
// Every [data-rough] element already has a plain CSS version of its line
// (`.css-line`). The layout sets `html.hand` before first paint when this
// layer is expected; we confirm with `html.hand-ready` once Rough.js has
// loaded. If we never confirm, the CSS lines come back on their own.
//
// Lines are drawn on the first time they're well into view, one item at a
// time ("one pencil"), in held drawings on the 12fps beat. Never tweened.

type RoughSVG = ReturnType<typeof import("roughjs").default.svg>;
type Options = Record<string, unknown>;

const FRAME_MS = 1000 / 12;
const root = document.documentElement;

const LEVELS: Record<string, Options> = {
  straightedge: { roughness: 0.55, bowing: 0.6, disableMultiStroke: true },
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

const SVG_NS = "http://www.w3.org/2000/svg";

type Item = {
  el: HTMLElement | SVGElement;
  /** real content (figures) draws before decoration (rules, notes) */
  content: boolean;
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

function makeItem(el: HTMLElement | SVGElement, rough: typeof import("roughjs").default): Item | null {
  const kind = el.dataset.rough;
  const seed = seedOf(el.dataset.seed ?? kind ?? "x");
  const opts = (level: string, extra: Options = {}) => ({
    ...LEVELS[level],
    seed,
    stroke: "currentColor",
    ...extra,
  });

  let build: () => SVGPathElement[];

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
    build = () => {
      const svg = overlay(el);
      const rc: RoughSVG = rough.svg(svg);
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      // offset by the (transparent) 1px border the CSS version uses
      svg.style.inset = "-1px";
      svg.style.width = `${w}px`;
      svg.style.height = `${h}px`;
      svg.appendChild(rc.rectangle(1, 1, w - 2, h - 2, opts("twice", { strokeWidth: 1 })));
      return [...svg.querySelectorAll("path")];
    };
  } else if (kind === "links" && el instanceof SVGSVGElement) {
    // Constellation linework, drawn in the chart's own coordinate space.
    build = () => {
      const g = el.querySelector<SVGGElement>(".chart__hand")!;
      g.replaceChildren();
      const rc: RoughSVG = rough.svg(el);
      el.querySelectorAll<SVGPolylineElement>(".chart__links polyline").forEach((pl, i) => {
        const pts = (pl.getAttribute("points") ?? "")
          .trim()
          .split(/\s+/)
          .map((p) => p.split(",").map(Number) as [number, number]);
        g.appendChild(rc.linearPath(pts, opts("straightedge", { seed: seed + i, strokeWidth: 1 })));
      });
      return [...g.querySelectorAll("path")];
    };
  } else if (kind === "arrow" && el instanceof SVGSVGElement) {
    build = () => {
      el.querySelectorAll(":scope > g.rough-arrow").forEach((g) => g.remove());
      const g = document.createElementNS(SVG_NS, "g");
      g.classList.add("rough-arrow");
      const rc: RoughSVG = rough.svg(el);
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
    content: kind === "links",
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

/**
 * Draw one item on. Strokes overlap: each starts halfway through the one
 * before, so the item reads as one gesture. Resolves when the pencil may
 * move to the next item (about two-thirds through this one).
 */
function drawOn(item: Item, hurry: number): Promise<void> {
  item.drawn = true;
  let start = 0;
  let end = 0;
  for (const path of item.paths) {
    const len = path.getTotalLength();
    const want = Math.round(len / 120);
    const drawings = Math.max(2, Math.min(12, Math.round(want / hurry)));
    const frames: Keyframe[] = [];
    for (let i = 0; i <= drawings; i++) {
      frames.push({
        strokeDashoffset: `${len * (1 - i / drawings)}`,
        easing: "steps(1, end)",
      });
    }
    const duration = drawings * FRAME_MS;
    path.animate(frames, { duration, delay: start, fill: "forwards" }).finished.then(() => {
      // settle: drop the dash so a later resize/redraw isn't clipped
      path.style.strokeDasharray = "";
      path.style.strokeDashoffset = "";
    });
    end = Math.max(end, start + duration);
    start += duration / 2;
  }
  return new Promise((resolve) => setTimeout(resolve, (end * 2) / 3));
}

async function start() {
  if (!root.classList.contains("hand")) return;

  let rough: typeof import("roughjs").default;
  try {
    rough = (await import("roughjs")).default;
  } catch {
    root.classList.remove("hand");
    return;
  }

  const items = [...document.querySelectorAll<HTMLElement | SVGElement>("[data-rough]")]
    .map((el) => makeItem(el, rough))
    .filter((i): i is Item => i !== null);

  for (const item of items) {
    item.paths = item.build();
    item.paths.forEach(blank);
  }
  root.classList.add("hand-ready");

  // ---- one pencil ----
  const queue: Item[] = [];
  let busy = false;

  const pump = async () => {
    if (busy) return;
    busy = true;
    while (queue.length) {
      // content first, then document order (the queue is filled top-down)
      queue.sort((a, b) => Number(b.content) - Number(a.content));
      const item = queue.shift()!;
      const hurry = 1 + queue.length * 0.6;
      await drawOn(item, hurry);
    }
    busy = false;
  };

  const io = new IntersectionObserver(
    (entries) => {
      const arriving = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      for (const e of arriving) {
        const item = items.find((i) => i.el === e.target);
        if (item && !item.queued) {
          item.queued = true;
          queue.push(item);
          io.unobserve(e.target);
        }
      }
      pump();
    },
    // "well into view": the bottom fifth of the viewport doesn't count
    { rootMargin: "0px 0px -20% 0px" },
  );
  items.forEach((i) => io.observe(i.el));

  // Pixel-sized overlays redraw on resize with the same seed. Items already
  // drawn redraw finished (never traced over again); others stay blank.
  const ro = new ResizeObserver((entries) => {
    for (const e of entries) {
      const item = items.find((i) => i.el === e.target);
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
  const imgFrames: Keyframe[] = [];
  const hatchFrames: Keyframe[] = [];
  for (let i = 0; i <= DRAWINGS; i++) {
    const s = (i / DRAWINGS) * (1 + BAND / 2);
    imgFrames.push({ clipPath: tri(Math.max(0, s - BAND / 2)), easing: "steps(1, end)" });
    hatchFrames.push({ clipPath: band(s), easing: "steps(1, end)" });
  }
  const timing = { duration: DRAWINGS * 2 * FRAME_MS, delay: 2 * FRAME_MS, fill: "backwards" as const };
  hatch.style.display = "block";
  img.animate(imgFrames, timing);
  hatch.animate(hatchFrames, timing).finished.then(() => (hatch.style.display = ""));
}

/** Print toggle: vellum ⇄ blueprint. Defaults to the system. */
function themeToggle() {
  const btn = document.querySelector<HTMLButtonElement>(".theme-toggle");
  const value = btn?.querySelector(".theme-toggle__value");
  if (!btn || !value) return;
  const sys = matchMedia("(prefers-color-scheme: dark)");
  const current = () => root.dataset.theme ?? (sys.matches ? "dark" : "light");
  const paint = () => {
    const dark = current() === "dark";
    value.textContent = dark ? "Blueprint" : "Vellum";
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", `Print: ${dark ? "blueprint" : "vellum"}. Switch to ${dark ? "vellum" : "blueprint"}`);
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

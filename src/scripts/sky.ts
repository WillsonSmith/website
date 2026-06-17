/*
 * Time-of-day theme engine.
 *
 * Each stop is a driver set for one canonical hour. Colours are OKLCH
 * strings; CSS blends between two stops (see theme.css). The engine only
 * picks the bracketing stops, sets the segment endpoints + progress, and
 * interpolates the one scalar (star visibility).
 *
 * Stops are denser near the horizons, where the sky changes fastest.
 */

export interface Stop {
  /** Hour of day, 0–24. */
  hour: number;
  zenith: string;
  horizon: string;
  sea: string;
  accent: string;
  /** Star-field opacity, 0–1. */
  star: number;
}

export const STOPS: Stop[] = [
  // midnight — deepest night
  {
    hour: 0,
    zenith: "oklch(0.13 0.05 280)",
    horizon: "oklch(0.18 0.06 275)",
    sea: "oklch(0.15 0.04 220)",
    accent: "oklch(0.86 0.03 250)",
    star: 1,
  },
  // dawn — sunrise; warm horizon under a cool sky
  {
    hour: 6,
    zenith: "oklch(0.52 0.09 265)",
    horizon: "oklch(0.8 0.12 45)",
    sea: "oklch(0.44 0.06 220)",
    accent: "oklch(0.82 0.12 50)",
    star: 0.12,
  },
  // morning — fresh and bright
  {
    hour: 9,
    zenith: "oklch(0.72 0.11 245)",
    horizon: "oklch(0.9 0.05 95)",
    sea: "oklch(0.62 0.09 220)",
    accent: "oklch(0.88 0.11 90)",
    star: 0,
  },
  // noon — brightest blue
  {
    hour: 12,
    zenith: "oklch(0.8 0.12 240)",
    horizon: "oklch(0.93 0.04 230)",
    sea: "oklch(0.7 0.1 225)",
    accent: "oklch(0.95 0.08 100)",
    star: 0,
  },
  // dusk — golden hour (the original "Dusk Fable" look)
  {
    hour: 18,
    zenith: "oklch(0.3 0.08 290)",
    horizon: "oklch(0.7 0.14 60)",
    sea: "oklch(0.32 0.05 210)",
    accent: "oklch(0.78 0.13 75)",
    star: 0.35,
  },
  // night — deepening toward midnight
  {
    hour: 21,
    zenith: "oklch(0.18 0.06 285)",
    horizon: "oklch(0.24 0.07 290)",
    sea: "oklch(0.19 0.04 215)",
    accent: "oklch(0.8 0.06 240)",
    star: 0.8,
  },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Find the two stops bracketing `hour` (wrapping past the last stop back
 * to the first) and how far between them we are.
 */
function bracket(hour: number): { from: Stop; to: Stop; t: number } {
  const h = ((hour % 24) + 24) % 24;
  for (let i = 0; i < STOPS.length; i++) {
    const from = STOPS[i];
    const to = STOPS[(i + 1) % STOPS.length];
    const start = from.hour;
    const end = to.hour <= start ? to.hour + 24 : to.hour;
    const probe = h < start ? h + 24 : h;
    if (probe >= start && probe <= end) {
      return { from, to, t: (probe - start) / (end - start) };
    }
  }
  return { from: STOPS[0], to: STOPS[0], t: 0 };
}

/** Apply a time of day (0–24h) by setting the theme's CSS custom properties. */
export function applyTimeOfDay(
  hour: number,
  root: HTMLElement = document.documentElement,
): void {
  const { from, to, t } = bracket(hour);
  const s = root.style;
  s.setProperty("--seg-from-zenith", from.zenith);
  s.setProperty("--seg-to-zenith", to.zenith);
  s.setProperty("--seg-from-horizon", from.horizon);
  s.setProperty("--seg-to-horizon", to.horizon);
  s.setProperty("--seg-from-sea", from.sea);
  s.setProperty("--seg-to-sea", to.sea);
  s.setProperty("--seg-from-accent", from.accent);
  s.setProperty("--seg-to-accent", to.accent);
  s.setProperty("--seg-t", String(t));
  s.setProperty("--star-opacity", String(lerp(from.star, to.star, t)));
}

/** A human label for a time of day, for the dial's `aria-valuetext`. */
export function labelForTime(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  if (h < 1 || h >= 23) return "Midnight";
  if (h < 5) return "Late night";
  if (h < 7) return "Dawn";
  if (h < 11) return "Morning";
  if (h < 13) return "Midday";
  if (h < 16) return "Afternoon";
  if (h < 19) return "Dusk";
  if (h < 21) return "Evening";
  return "Night";
}

/**
 * The time to open at: a `?time=` query override (handy for previews and
 * shareable deep-links), otherwise the visitor's real local time.
 */
export function currentTimeOfDay(): number {
  const override = new URLSearchParams(location.search).get("time");
  if (override !== null) {
    const parsed = Number.parseFloat(override);
    if (!Number.isNaN(parsed)) return parsed;
  }
  const now = new Date();
  return now.getHours() + now.getMinutes() / 60;
}

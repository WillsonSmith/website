// What the home page draws, apart from its prose (which lives in
// src/content/index/*.md): each sheet's figure and every handwritten note.
//
// scripts/subset-hand.ts reads this module (and the sheet titles from the
// content frontmatter) to cut Caveat down to just the characters drawn in
// handwriting, so any new handwritten string must come from here.

/** The note beside the avatar on the cover. */
export const avatarNote = "that’s me";

export type Star = { x: number; y: number; r: number; bright?: boolean };
export type Label = { x: number; y: number; t: string };
export type Note = { text: string; x: number; y: number; arrow: string };
export type Chapter = {
  kicker: string;
  fig: string;
  figName: string;
  stars: Star[];
  links: string[];
  labels: Label[];
  note: Note;
};

// Same star data as the live page; presentation only.
export const chapters: Record<number, Chapter> = {
  1: {
    kicker: "Introduction",
    fig: "Fig. i",
    figName: "Ursa Minor, the guiding star",
    stars: [
      { x: 276, y: 52, r: 3.2, bright: true },
      { x: 242, y: 68, r: 2 },
      { x: 208, y: 82, r: 2.2 },
      { x: 176, y: 94, r: 2.8, bright: true },
      { x: 150, y: 128, r: 2.2 },
      { x: 104, y: 134, r: 2 },
      { x: 96, y: 100, r: 2.2 },
    ],
    links: ["276,52 242,68 208,82 176,94 150,128 104,134 96,100 176,94"],
    labels: [{ x: 250, y: 40, t: "POLARIS" }],
    note: { text: "start here", x: 220, y: 172, arrow: "M258 152 C 270 130, 282 100, 276 66 M276 66 L 270 76 M276 66 L 283 75" },
  },
  2: {
    kicker: "Approach",
    fig: "Fig. ii",
    figName: "Lyra, the storyteller’s lyre",
    stars: [
      { x: 180, y: 54, r: 3, bright: true },
      { x: 150, y: 96, r: 2.2 },
      { x: 188, y: 108, r: 2 },
      { x: 208, y: 150, r: 2.4 },
      { x: 168, y: 150, r: 2 },
    ],
    links: ["180,54 150,96 168,150 208,150 188,108 150,96"],
    labels: [{ x: 196, y: 50, t: "VEGA" }],
    note: { text: "a lyre, if you squint", x: 14, y: 188, arrow: "M60 166 C 50 110, 120 60, 171 56 M171 56 L 162 50 M171 56 L 163 62" },
  },
  3: {
    kicker: "Practice",
    fig: "Fig. iii",
    figName: "Draco, the sleepless dragon",
    stars: [
      { x: 44, y: 168, r: 2.4 },
      { x: 80, y: 150, r: 2 },
      { x: 96, y: 120, r: 2.6 },
      { x: 82, y: 92, r: 2 },
      { x: 116, y: 80, r: 2.4 },
      { x: 150, y: 92, r: 3, bright: true },
      { x: 186, y: 76, r: 2.2 },
      { x: 214, y: 88, r: 2 },
      { x: 248, y: 72, r: 2.6 },
      { x: 281, y: 60, r: 3, bright: true },
      { x: 298, y: 82, r: 2.2 },
      { x: 268, y: 94, r: 2.4 },
    ],
    links: [
      "44,168 80,150 96,120 82,92 116,80 150,92 186,76 214,88 268,94 248,72 281,60 298,82 268,94",
    ],
    labels: [
      { x: 150, y: 112, t: "α" },
      { x: 281, y: 44, t: "β" },
    ],
    note: { text: "still awake", x: 218, y: 176, arrow: "M298 156 C 314 136, 306 112, 291 99 M291 99 L 292 110 M291 99 L 302 101" },
  },
  4: {
    kicker: "Contact",
    fig: "Fig. iv",
    figName: "Sagitta, the arrow",
    stars: [
      { x: 256, y: 64, r: 2.8, bright: true },
      { x: 204, y: 90, r: 2.2 },
      { x: 158, y: 110, r: 2.4 },
      { x: 126, y: 96, r: 2 },
      { x: 132, y: 134, r: 2 },
    ],
    links: ["256,64 204,90 158,110", "126,96 158,110 132,134"],
    labels: [{ x: 256, y: 46, t: "γ" }],
    note: { text: "this way", x: 226, y: 172, arrow: "M262 152 C 276 124, 268 94, 259 76 M259 76 L 256 87 M259 76 L 267 84" },
  },
};

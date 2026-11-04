// Cut the site's fonts down to the characters it can actually show, and
// write them to public/fonts/ (loaded by src/styles/fonts.css).
//
// - Caveat (handwriting) is only ever short, fixed strings: the sheet
//   titles (content frontmatter) and the notes (src/data/figures.ts). It's
//   cut to exactly those characters.
// - B612 and B612 Mono set prose that comes from the markdown, so they keep
//   all of printable ASCII, the punctuation Astro's smartypants turns quotes
//   and dashes into, and any other character in the content, templates and
//   src/data (what the page can show; not code comments). New
//   prose in plain English needs no re-run; the build re-runs it anyway.
//
// Characters outside fontsource's Latin files (α β γ → today) were never in
// these fonts; they fall back to a system face, and the script lists them.
//
// Runs before `dev` and `build` (see package.json). Plain type-only
// TypeScript, so Node 22.18+ runs it directly, as does Bun.
//
//   node scripts/subset-fonts.ts

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import subsetFont from "subset-font";
import { avatarNote, chapters } from "../src/data/figures.ts";

const ROOT = new URL("..", import.meta.url).pathname;
const FONTSOURCE = join(ROOT, "node_modules/@fontsource");
const OUT_DIR = join(ROOT, "public/fonts");

/** Every file under `dir` (recursively) with one of `exts`. */
async function files(dir: string, exts: string[]): Promise<string[]> {
  const found: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await files(path, exts)));
    else if (exts.includes(extname(entry.name))) found.push(path);
  }
  return found;
}

/** Sheet titles, from each content file's frontmatter `title:` line. */
async function titles(): Promise<string[]> {
  const found: string[] = [];
  for (const file of await files(join(ROOT, "src/content"), [".md"])) {
    const text = await readFile(file, "utf8");
    const front = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
    const title = front.match(/^title:\s*(.+)$/m)?.[1]?.trim();
    if (title) found.push(title.replace(/^(["'])(.*)\1$/, "$2"));
  }
  return found;
}

const unique = (text: string) => [...new Set(text)].sort().join("");

// ---- Caveat: exactly what's handwritten ----
const hand = unique(
  [...(await titles()), avatarNote, ...Object.values(chapters).map((c) => c.note.text)].join(""),
);

// ---- B612 / B612 Mono: ASCII, smart punctuation, and whatever src/ uses ----
const ascii = Array.from({ length: 0x7f - 0x20 }, (_, i) => String.fromCharCode(0x20 + i)).join("");
// smartypants (Astro's markdown default): ‘ ’ “ ” – — …, plus a no-break space
const smart = "‘’“”–—… ";
let used = "";
const shown = [
  ...(await files(join(ROOT, "src"), [".md", ".astro"])),
  ...(await files(join(ROOT, "src/data"), [".ts"])),
];
for (const file of shown) {
  used += (await readFile(file, "utf8")).replace(/[\x00-\x7f]/g, "");
}
const text = unique(ascii + smart + used);

// fontsource's Latin subset: what these source files can contain at all.
const LATIN =
  /^[\u0000-ÿıŒœʻʼˆ˚˜̩̄̈ -⁯€™↑↓−∕﻿�]$/u;
const outside = (chars: string) => [...chars].filter((c) => !LATIN.test(c));

const FACES: { from: string; to: string; chars: string }[] = [
  { from: "caveat/files/caveat-latin-500-normal.woff2", to: "caveat-500-hand.woff2", chars: hand },
  { from: "b612/files/b612-latin-400-normal.woff2", to: "b612-400.woff2", chars: text },
  { from: "b612/files/b612-latin-400-italic.woff2", to: "b612-400-italic.woff2", chars: text },
  { from: "b612/files/b612-latin-700-normal.woff2", to: "b612-700.woff2", chars: text },
  { from: "b612-mono/files/b612-mono-latin-400-normal.woff2", to: "b612-mono-400.woff2", chars: text },
];

await mkdir(OUT_DIR, { recursive: true });
let before = 0;
let after = 0;
for (const face of FACES) {
  const source = await readFile(join(FONTSOURCE, face.from));
  const font = await subsetFont(source, face.chars, { targetFormat: "woff2" });
  await writeFile(join(OUT_DIR, face.to), font);
  before += source.length;
  after += font.length;
  console.log(
    `subset-fonts: ${face.to.padEnd(22)} ${String([...face.chars].length).padStart(3)} chars  ` +
      `${(source.length / 1024).toFixed(1).padStart(5)} KB → ${(font.length / 1024).toFixed(1).padStart(5)} KB`,
  );
}
console.log(`subset-fonts: total ${(before / 1024).toFixed(1)} KB → ${(after / 1024).toFixed(1)} KB`);

const missing = unique(outside(hand + text).join(""));
if (missing) {
  console.warn(`subset-fonts: not in the Latin source, so drawn by a system face: ${[...missing].join(" ")}`);
}

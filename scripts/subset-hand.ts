// Cut Caveat (the handwriting face) down to the characters the site
// actually writes by hand: the sheet titles (content frontmatter) and the
// notes (src/data/figures.ts). Handwriting is only ever short, fixed
// strings, so the full Latin face (~51 KB) is mostly glyphs nobody sees.
//
// Runs before `dev` and `build` (see package.json). Plain type-only
// TypeScript, so Node 22.18+ runs it directly, as does Bun.
//
//   node scripts/subset-hand.ts

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import subsetFont from "subset-font";
import { avatarNote, chapters } from "../src/data/figures.ts";

const ROOT = new URL("..", import.meta.url).pathname;
const SOURCE = join(ROOT, "node_modules/@fontsource/caveat/files/caveat-latin-500-normal.woff2");
const OUT_DIR = join(ROOT, "public/fonts");
const OUT = join(OUT_DIR, "caveat-500-hand.woff2");

/** Sheet titles, from each content file's frontmatter `title:` line. */
async function titles(): Promise<string[]> {
  const dir = join(ROOT, "src/content/index");
  const found: string[] = [];
  for (const file of (await readdir(dir)).filter((f: string) => f.endsWith(".md"))) {
    const text = await readFile(join(dir, file), "utf8");
    const front = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
    const title = front.match(/^title:\s*(.+)$/m)?.[1]?.trim();
    if (title) found.push(title.replace(/^(["'])(.*)\1$/, "$2"));
  }
  return found;
}

const strings = [
  ...(await titles()),
  avatarNote,
  ...Object.values(chapters).map((c) => c.note.text),
];
const chars = [...new Set(strings.join(""))].sort().join("");

// The source is fontsource's Latin subset; anything outside it would fall
// back to another face mid-word. Say so rather than ship it silently.
const latin = /^[ -~ -ÿ–—‘-‚“-„•…]$/u;
const outside = [...chars].filter((c) => !latin.test(c));
if (outside.length) {
  console.warn(`subset-hand: not in Caveat's Latin subset: ${outside.join(" ")}`);
}

const font = await subsetFont(await readFile(SOURCE), chars, { targetFormat: "woff2" });
await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT, font);

const before = (await readFile(SOURCE)).length;
console.log(
  `subset-hand: ${chars.length} characters, ${(before / 1024).toFixed(1)} KB → ${(font.length / 1024).toFixed(1)} KB (public/fonts/caveat-500-hand.woff2)`,
);

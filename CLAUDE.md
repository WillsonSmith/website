# CLAUDE.md

willsonsmith.com: Willson Smith's personal site, built with Astro. One page
(`src/pages/index.astro`) drawn as a modfox **Sheet**: a set of numbered sheets
on solid paper over the grid, its edge sketched in pencil (no drafting
frame). Deployed by Netlify from `main` (`netlify.toml`), so
merging to `main` ships it.

## Commands

| Command | What it does |
| --- | --- |
| `bun run dev` | Subset the fonts, then the Astro dev server |
| `bun run build` | Subset the fonts, then build to `dist/` (Netlify runs `npm run build`) |
| `bun run check` | `astro check`: types and Astro diagnostics. Must pass |
| `bun run fonts` | `scripts/subset-fonts.ts`: subset B612, B612 Mono and Caveat to the characters the page uses. Re-run after changing text |

## The brand (modfox-kit)

The brand's rules are in `brand/`, copied from **modfox-kit** (`kit.json`: the
version, and the paths the kit owns here, `brand/` and
`.claude/skills/modfox-brand/`). The `modfox-brand` project skill loads for UI,
design or motion work and points at them: start at `brand/README.md`. Don't
edit the kit-owned paths here; change them in modfox-kit and update this repo
with the global `modfox-kit` skill.

This site follows the brand with its **own implementation**, not the kit's
`src/kit/` (the project skill's pointers to `src/kit/` don't apply here):

- `src/styles/modfox-tokens.css`: modfox's vellum/blueprint skin, under the
  older token names (`--red`, `--blue`, `--paper-on-sheet`).
- `src/styles/sheet.css`: the sheet, its frame, sections, plates, figures.
- `src/scripts/pencil.ts`: the hand-drawn lines (Rough.js), each over a
  `.css-line` fallback.
- `src/layouts/Sheet.astro`, `src/data/figures.ts`, `src/content/`: the page's
  structure and copy.

## Git

Branch from `main`; never commit to it directly. Commit at green checkpoints
(`bun run check` and `bun run build` passing), conventional-style messages.
Push and open PRs freely; merging waits for the user, since it deploys.

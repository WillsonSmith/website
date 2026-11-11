# Skins

A skin is a palette: values for the colour roles below, in both themes. The
core (type, labels, handwriting, linework, motion, sound) never changes; the
skin does. modfox's own skin is **vellum** by day and **blueprint** at night,
and it's the default. A product can wear its own skin and still be modfox.

## The roles

Every skin defines every role, for light and dark. Components only ever use
roles, never raw colours, so a page re-skins by swapping one file.

| Role          | Token                | What it is                                                                                |
| ------------- | -------------------- | ----------------------------------------------------------------------------------------- |
| Page          | `--paper`            | The background: the drafting table under the grid (Sheet), or the flat page (Product)     |
| Sheet         | `--sheet`            | The solid paper content sits on, covering the grid. Usually `--paper`                     |
| Surface       | `--surface`          | A solid face: panels, dialogs, cards, anything covering what's beneath                    |
| Ink           | `--ink`              | Lines and body text                                                                       |
| Secondary ink | `--ink-2`            | Labels and secondary text                                                                 |
| Rule          | `--rule`             | Light dividers, dashed outlines, placeholders                                             |
| Faint         | `--faint`            | Construction lines, selected rows                                                         |
| Grid          | `--grid`, `--grid-2` | Minor (fifths) and major (modules) grid lines                                             |
| Accent        | `--accent`           | What's _happening_ or what you're _pointing at_: hover, live, errors. modfox's red pencil |
| Note          | `--note`             | modfox's own hand: handwritten notes and asides, the focus ring. modfox's blue pencil     |
| Wash          | `--wash`             | A modal dialog's backdrop: the page colour at 70–85%, never darker                        |
| Grain         | `--grain`            | Opacity of the film-grain texture (Product level), about 0.03 light, 0.05 dark            |
| Tape          | `--tape`             | Masking tape over a picture stuck to the sheet (Sheet level)                              |

A product may add its own roles (a primary button fill, status colours,
rarity tiers); name them for what they mean, and give each both themes.

## Vellum and blueprint (modfox's skin)

The default. By day pale vellum, at night a **blueprint**: pale blue-white
lines on deep blue. Never grey-on-black.

| Role                  | Vellum (light)          | Blueprint (dark)        |
| --------------------- | ----------------------- | ----------------------- |
| `--paper`             | `#e9eeeb`               | `#173f66`               |
| `--ink`               | `#2e353b`               | `#e8f1f7`               |
| `--ink-2`             | `#4f585e`               | `#a9c4d8`               |
| `--rule`              | `#9aa3a8`               | `#5f86a8`               |
| `--faint`             | `rgb(47 93 138 / .22)`  | `rgb(159 208 255 / .2)` |
| `--grid` / `--grid-2` | ink at 7% / 14%         | ink at 6% / 13%         |
| `--accent`            | `#b83a2e` (red pencil)  | `#ff8a75`               |
| `--note`              | `#2f5d8a` (blue pencil) | `#9fd0ff`               |
| `--sheet`             | `--paper`               | `--paper`               |
| `--surface`           | `--paper`               | `--paper`               |

`--red` and `--blue` remain as names for the two pencils in this skin.

## Making a product skin

1. **Start from the meaning, not the colours.** Pick the page, ink and the two
   pencils first: an accent for "happening / pointing at", and a note colour
   for the handwriting. They must be distinct, and the accent must stay rare.
2. **Fill every role, in both themes.** Decide which theme is the default:
   products are often dark first (set it before first paint, offer Auto /
   Light / Dark). Keep `<meta name="theme-color">` in step with `--paper`.
3. **Keep it muted.** No neon, no gradients. Contrast for body text at least
   WCAG AA; check the secondary ink and labels too.
4. **Put it in the project, not the kit:** `src/skin/<name>.css` (start from a
   copy of `src/kit/skins/harbour.css`), loaded instead of `vellum.css`.
   `src/kit/` belongs to the kit and is replaced on update; a project's skin
   is its own. Nothing else changes.

The kit includes an example product skin (`skins/harbour.css`) used by the
Product demo page.

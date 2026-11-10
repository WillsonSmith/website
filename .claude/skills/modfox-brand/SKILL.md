---
name: modfox-brand
description: modfox's brand for this project's web UI — a technical drawing with pencil-drawn accents and illustrations, pencil-test motion and quiet pencil-and-cartoon sound, on modfox's vellum/blueprint skin or a product's own. Use whenever building, restyling or reviewing UI, pages, layout, components, colours, type, icons, illustrations, dialogs, animation or sound effects in this project, even if the brand isn't named.
---

# modfox brand

The brand lives in this project, in `brand/` (copied from modfox-kit; the
kit's version is in `kit.json`). Read it before designing anything:

1. **`brand/README.md` first, always.** The idea, the instrument-or-hand
   question, the brand levels (Sheet, Product, Drafted, Quiet), the core's
   exact values, the never/always lists and the checklist. Name the level
   before you start.
2. **Then the file for what you're doing:**
   - Colours, themes, a product's palette: `brand/skins.md`
   - Page layout, the grid, the paper sheet, grain: `brand/layout.md`
   - Hand-drawn lines, Rough.js, drawing on: `brand/linework.md`
   - Animation, the pop, shading in, timing: `brand/motion.md`
   - Plates, cards, dialogs, buttons, inputs, tables: `brand/components.md`
   - A product or landing page: `brand/product.md`
   - Sound effects: `brand/sound.md`
   - Illustrations and icons: `brand/illustration.md`
3. **Use the kit's code rather than rewriting it:** `src/kit/` (tokens, skins,
   `kit.css`, `pop.ts`, `pen.ts`, `rough.ts`, `shade.ts`, `sound.ts`,
   `speaker.ts`, `card.ts`). Its style guide (`bun run dev` in the kit) shows
   every part working.

`brand/`, `src/kit/`, `sound/` and `fonts/` belong to the kit: change them in
modfox-kit and update this project from it (the global `modfox-kit` skill),
rather than editing them here, unless the change is deliberately local.

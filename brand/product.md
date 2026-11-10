# Product pages

The Product level is modfox's voice on a product's own skin: a landing page
that sells something, made by someone who draws. It keeps the core (B612, the
mono label, handwriting, pencil linework, the pop, sound) and drops the
drafting-sheet furniture (the grid, the frame, spec plates, "Sheet N of M").
Fishing Pond's landing page is the reference.

## The page

1. **Nav.** Sticky, plain: the wordmark, two or three links, one primary
   button ("Sign in", "Get started"). Solid `--paper` with a `--rule` hairline.
2. **Hero.** Centred: a mono label eyebrow, a big B612 headline with its key
   words handwritten in the accent (Caveat, about 1.35em, tilted −1°), a lede
   of about 52 characters a line, two buttons (primary and secondary), and a
   small note under them if needed.
3. **The demo stage.** The product, working, under the hero: a live mock (not a
   screenshot) in panels framed in pencil, with one or two handwritten notes in
   the note colour pointing at what matters ("the bot calls out every catch").
   It loops quietly; under reduced motion it holds still and complete.
4. **How it works.** Three steps, each a Caveat numeral ("1.") and a small
   pencil sketch with hatching.
5. **Features.** A grid of items, three across (two, then one, narrower): an
   icon on a soft tile, a short heading, one muted line. Open, no boxes.
6. **A data graphic,** where it says something true: hand-drawn (a tally of
   pencil dots, a sketched chart) with a legend in mono labels.
7. **The closing call.** A doodle, a handwritten question ("Ready to stock your
   pond?"), and the two buttons again.
8. **Footer.** Links, language, the theme toggle, small print.

## The details

- **Section titles** are handwritten (Caveat, about 48px, 38px on phones,
  −0.6°), under a mono eyebrow. One idea per section.
- **Buttons** are crisp instruments here: rounded (about 13px), 44–48px tall,
  B612 700 in sentence case, a 1.5px border; the primary filled with the
  product's primary colour. Hover: the accent, and a 1px lift at most.
- **Icons** can be a standard line set (Lucide or similar), one colour, on a
  rounded tile. Illustrations (doodles, the bobber, the speaker) stay
  hand-drawn.
- **Copy** is plain: aim for a reading grade of 8 or below. Handwriting only
  for short fixed strings.
- **Motion** is sparse: the demo's instrument motion (a line sliding up in
  200ms, no fade), the pop-out card's pop, and nothing on load. The pencil
  doesn't draw the page in.
- **Accessibility:** 44px targets, the demo `aria-hidden` when it's decoration,
  real buttons for anything interactive in it, colour never the only signal.
- **Meta:** Open Graph and Twitter cards, `hreflang` for translations,
  structured data (JSON-LD) for the product.

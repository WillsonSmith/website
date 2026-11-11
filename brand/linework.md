# Linework

Read this when drawing anything by hand. For which lines _should_ be drawn by
hand, ask the instrument-or-hand question in [README.md](README.md) first.

## Instrument lines

These are plain CSS borders and outlines, 1–2px, in `--ink`, `--rule` or
`--faint`. Dashed for anything provisional or construction-like (a compass ring,
an outline of something not there yet). A framed sheet gets a 2px border plus a
1px outline offset 6px: the double rule of a drawing border. (A plain sheet's
edge is a hand line: see below.)

## Hand lines (Rough.js)

[Rough.js](https://roughjs.com) draws the hand lines. Draw into an SVG laid over
the element, sized to it, and redraw on resize.

- **Seeds are fixed per element** (derive one from an id or index), so a redraw
  keeps the same wobble. A line changes shape only on purpose, when it boils.
- **Stroke with `currentColor`** so the themes recolour it for free. Light
  pencil is `color: var(--rule)`.
- **Pin closed shapes' vertices** (`preserveVertices: true`). Otherwise Rough.js
  leaves gaps at the corners.
- **Keep a CSS version underneath.** The element keeps its border or rule in CSS.
  When the hand layer takes over, hide the CSS line (a class on `<html>` set
  before first paint), and give it back if the layer hasn't loaded within a few
  seconds. Under reduced motion, consider keeping the CSS lines and skipping
  Rough.js altogether.
- **Load Rough.js after first paint** (a dynamic import), so it never blocks
  content.

Three levels, from careful to quick. Reuse one before inventing another:

| Level           | Settings                                                              | For                                                                             |
| --------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Straightedge    | `roughness: 0.55, bowing: 0.6, disableMultiStroke: true`              | Rules, dimension lines, frames, placeholders                                    |
| Gone over twice | `roughness: 1.2, bowing: 1.2, disableMultiStroke: false`              | Edges of plates and the sheet, anything meant to look worked over               |
| Quick sketch    | `roughness: 0.9, bowing: 0.8`, multi-stroke, `preserveVertices: true` | Transient surfaces (pop-out cards), boxed buttons' rounded boxes, illustrations |

**Long lines bow less.** Rough.js bows a line in proportion to its length, so
an edge many times a plate's size (the sheet's, a page tall) would swing tens of
px at the plate's bowing. Scale `bowing` down by the longest side so it bows
about as much as a ~600px side does (`rough.ts` does this for the sheet).

## Drawing lines on

At Sheet level (and Drafted, if it suits), a hand line starts blank and is drawn
on the first time it's well into view. The exception is the **sheet's edge**:
it's there from the start (see layout.md), and only its CSS border shows until
the pencil layer loads.

- Reveal each stroke in **held chunks on the 12fps beat**, one drawing per
  ~120px of travel, 2–12 drawings. Animate the stroke dash and step it. Don't
  tween.
- Strokes within one element overlap, each starting halfway through the
  previous one, so the element reads as one gesture.
- **One pencil.** Draw one _item_ at a time (an item is everything belonging to
  one thing: a plate's edge, a rule, a piece with its dimension line). The next
  item starts when the current one is about two-thirds done, top to bottom.
- **The pencil only draws what's on screen.** An item that's off screen when
  its turn comes is simply finished (shown drawn), and an item being drawn stops
  holding the pencil once it's scrolled away. A fast scroll, or a reload that
  lands partway down the page, never leaves what's in view waiting behind what
  was passed. A line that's a sliver of its element (a section's top rule)
  counts as on screen only when the line itself is.
- **Boxes go round, one side at a time.** Rough.js draws a box (a rectangle, a
  rounded rectangle, a multi-stroke shape) as _one_ path of separate strokes,
  each starting with its own `M`. A dash animation restarts at every stroke, so
  drawn on as one path, every side grows at once from its own corner. Split the
  path into one path per stroke, then draw the sides in turn, each starting on
  the last drawing of the one before; a second pass follows its side two
  drawings behind. Pace each stroke by its own length, and put a stroke on ones
  (twice the steps, same duration) when a drawing's jump would pass ~120px.
- **Content goes first.** Items with real content (images, data) jump ahead of
  items that are only lines.
- **With a backlog, hurry.** The more items queued, the quicker each one draws
  (never under 2 drawings), and nothing waits more than ~5s.
- **Draw once.** Never trace over a line that's already visible, and don't
  redraw on a later scroll.

## The pencil-grain filter

Larger handwriting (titles, the wordmark's notes) goes through an SVG filter so
it has graphite grain. The text stays real, selectable text.

```html
<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
  <filter id="pencil" x="-2%" y="-10%" width="104%" height="120%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4" result="warp" />
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="rough" />
    <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="9" result="grain" />
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.1 0 0 0 1.45" result="tooth" />
    <feComposite in="rough" in2="tooth" operator="in" />
  </filter>
</svg>
```

Apply it with `filter: url(#pencil)`. Size the SVG to zero rather than using
`display: none`, which disables the filter in some browsers. Never put it on
images.

## Handwriting fonts

Caveat 500 only. If you self-host and subset it to the characters the page uses
(worth it, since it's big), remember that any new handwritten string needs a
re-subset, and that runtime text can't use it.

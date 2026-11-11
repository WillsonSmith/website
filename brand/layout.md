# Layout

## The grid is the table, you read on the paper

At Sheet level the grid is the drafting table, not the page you read. It fills
the whole background (`--paper` with the grid drawn on it), and the content
sits on a **sheet** of solid paper laid on top (`--sheet`). The grid shows
round the sheet, not through it: around the edge it says "drawing", and the
paper you read on stays quiet. (Drawn through the paper too, even faintly, the
grid reads as noise behind the text.)

- **Body text never sits on the grid.** Put it on the sheet, on a plate, or on
  a solid patch.
- **The sheet is plain by default:** its edge, and nothing else. It sits on
  module lines (width in whole modules, centred with the grid) with one module
  of padding (one fifth on phones). On a phone it fills the screen less a
  sliver of table, rather than rounding down to whole modules: every px counts
  there, and nothing on the plain paper needs to meet the table's lines.
- **Its edge is sketched in pencil,** like a spec plate's ("gone over twice",
  see [linework.md](linework.md)), so the sheet reads as a larger plate. It's
  there from the start, not drawn on: it's the paper the drawing is made on,
  and a page-long edge drawn on would hold up every other line. Its CSS border
  shows until the pencil layer loads, and stays as the fallback.
- **The grid is drawn, faintly:** a minor line every fifth of a module
  (`--grid`), a major one every module (`--grid-2`), centred on the page so the
  sheet lands on its lines.
- **One sheet per page,** usually. A long page can stack sheets with a module
  of table showing between them, each its own "Sheet N of M".

## The frame (optional)

A personal Sheet-level site can dress its sheet as a full drawing: a 2px border
plus a 1px outline 6px out (the double rule, ruled, so not sketched), zone
references in the margin (1–8 across, A–F down), and a title block at the foot
(site, author, revision). It's character, not structure, and it's the most
literal part of the motif: use it sparingly, and leave it off product pages,
tools and the template. modfox.ca tried it and took it off as noise.

## Drafted and Quiet

Drafted apps keep the module as the measure, and draw the grid faintly or not
at all. Quiet apps don't draw it. Either way, content sits on `--surface`
panels or straight on `--paper`.

## Product pages

No grid. The page is `--paper`, flat, with a faint film grain fixed over the
whole viewport (`--grain`, about 3% light, 5% dark): texture without lines.
Sections are open, separated by space and their headings, not boxes; only the
framed demo and the odd panel get an edge (in pencil). A content column of
about 1080px with `max(16px, 4vw)` side padding, sections about 88px apart (64px
on phones). See [product.md](product.md).

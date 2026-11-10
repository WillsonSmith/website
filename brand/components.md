# Components

Patterns, not code: build them in whatever stack the app uses. Before inventing
a component, check whether one of these already does the job.

## Drafting components

**Section (a sheet).** A top rule (hand-drawn at Sheet and Drafted levels), then
a `.label` kicker ("Sheet 2 of 3 · Details") above a heading. At Sheet level the
heading is handwritten in graphite (`--ink`, never blue). Elsewhere it's B612.
At Sheet level, number the sections and keep "of N" right.

**Spec plate.** The drafting card. It arrives outline first: its edge goes
round, then it's lettered in a row per drawing (see Outline, then contents, in
motion.md). It has a ruled edge (gone over twice if
hand-drawn, a 1px `--ink` border if not), an 80% paper face
(`--sheet`) when it sits on the sheet or a solid face (`--surface`) in a dialog, a
header row at least one module tall, an optional short description in
`--ink-2`, then `dt`/`dd` rows: a `.label` column about 2.4 modules wide, mono
values, and `--rule` dividers. Rows are `0.6 × --m` tall. List only the fields
that apply. Good for: project summaries, settings groups, detail views, record
metadata.

**Dimension line.** Ticks at both ends with a mono value centred in a gap in the
line. Use it to state a real measurement (an image's size, a duration, a count
across a range), never as decoration.

**Placeholder.** A light (`--rule`) box crossed corner to corner with a `.label`
in the middle ("TBD", "In progress"). It's the drafting way to show something
that isn't done yet: loading slots, unfinished features, empty media.

**Empty state.** A placeholder, or a small handwritten note in the note colour with
a hand-drawn arrow pointing at what to do. This is the best place to spend a
Quiet app's one hand-drawn accent.

**Note on the drawing.** A short label (`.label` or handwriting) on a solid
`--surface` patch so lines don't run through it. The wording uses drafting terms:
"Datum A", "Ø 2.4 mod typ.", "Not to scale", "See sheet 3". Decorative notes are
`aria-hidden`.

**Pop-out card.** For detail about something on the page: a speech bubble
sketched in pencil ("quick sketch" roughness) with its tail touching the thing
it describes. Its width is whole modules and its height whole fifths. It holds
a name, a dashed `--rule` divider, `.label`/value rows, and can hold a link
(touch has no hover, so the card is how a phone reaches it). It pops (see
motion.md), with its pop sound on its first drawing out, and boils gently while
open.

- **Its source is a button**, not a link: hover (after ~70ms), focus or a tap
  opens the card. A tap or Enter pins it open until the source is pressed
  again, something else is pressed, or Escape; a mouse click opens it like a
  hover. The source reports it with `aria-expanded` and `aria-describedby`, and
  the card sits right after its source in the DOM, so the next Tab reaches its
  link.
- **A safe area to cross.** While the pointer is between the source and the
  card, anywhere in the convex hull of the two (with a few px of slack), the
  card stays open; out of it, the usual ~90ms close starts. Only the bubble and
  its text take the pointer, never the box around them.
- **Placement.** Beside its source if it fits at its natural width, on
  whichever side has room. If neither (a phone), above it, or below when above
  wouldn't be on screen (off the top, or under a sticky header), centred on the
  source but held inside its container's width, wrapping only past that. The
  tail leaves whichever edge faces the source, so it can come from the bottom
  right of a card above a source on the right. Its container clips only
  sideways, so the card may overhang it.

Never put anything _only_ here: the facts it shows are also reachable without
it.

**Dialog.** A `<dialog>` holding one plate with a solid face, settled square. It
pops out of whatever opened it (on ones, with a third of the sway) and snaps
back into it, however it's closed, so route every close through one animated
close function. It opens half a drawing after the release click of whatever
opened it; it boings on its overshoot and gives a soft thup as it closes (see
sound.md). Two kinds, decided by whether it blocks the page:

- **Modal** (`showModal()`): it blocks the page, so it always has a backdrop
  that washes the page out (`--wash`: the page colour at 70–85%), never darkening it, and
  page scroll locks while it's open. Closed by button, Escape or the backdrop.
  It isn't draggable: there's nothing behind it to get at.
- **Window** (`show()`): it blocks nothing, so it has no backdrop and the page
  stays usable. It can be dragged by its header (clamped on screen), and several
  can be open at once, each coming to the front when it's opened or pressed.
  Closed by button or Escape. Use a window when the visitor might want the page
  and the dialog together (a reference panel, a tool, a list to compare
  against).

Only a dialog that blocks interaction gets a backdrop, and a dialog without one
must leave the page usable: never a modal without a backdrop.

**Circle (avatar).** An avatar ringed in `--ink` inside a dashed compass ring a
fifth of a module out, centred on a grid intersection. When several appear
together, they're all the same size, so no position implies rank. Live status:
a red-pencil arc around the ring and a handwritten red "live". In dense lists,
ring the avatar in red instead.

**Masking tape.** Two translucent `--tape` strips across the corners of a
picture "stuck" to the sheet, varied between neighbours. Only at Sheet level.

## Everyday controls

Mostly instruments: crisp and quiet, the brand showing in their type and colour,
not in wobbles. The one exception is a boxed button's box.

- **Button.** `.label` text (mono uppercase), a `--surface` face, padding in
  fifths. At Sheet and Drafted level its box is drawn by hand: a rounded
  rectangle (about 10px corners) sketched with Rough.js like a pop-out card's
  edge (roughness ~0.9, gone over twice, vertices pinned so the corners stay
  joined), drawn on like any other hand line, and in the button's own colour so
  it turns `--accent` with the label on hover. Underneath, a crisp 1px rounded
  border in the same colour is the fallback (no script, reduced motion, the
  pencil layer failing). It sits square unless it's part of an illustration.
  In Quiet apps: a 1px `--ink` border with square corners. The primary button
  inverts (`--ink` face, `--paper` text). Hover: `--accent` text and box. At
  Product level buttons are crisp and rounded, in sentence case: see product.md. No
  gradients, shadows or smooth pills.
- **Text link / quiet button.** Inherits the text colour and turns `--accent` on
  hover. An underline is fine.
- **Input.** A bottom border only (a line to write on) or a 1px `--rule` box,
  with the `.label` above it and mono for numbers and codes. Focus is the blue
  ring. Errors are written in the accent below the field: a short handwritten or
  `.label` note, plus `aria-describedby`.
- **Checkbox / radio.** A small square or circle in `--ink`. The checked mark
  can be a hand-drawn tick: it's the user's mark on the drawing.
- **Table.** Reads like a drawing's schedule: `.label` column headers, mono for
  numbers (right-aligned, `tabular-nums`), `--rule` row dividers, no zebra
  stripes, no fill on the header. The selected row gets a `--faint` wash.
- **Tabs.** `.label` text with a 2px `--ink` underline under the active tab,
  moving with instrument motion.
- **Toast / status.** A small plate with a solid face that comes from the edge it
  sits at with instrument motion. Red pencil only if something needs action.
- **Icons.** Thin single-weight line icons in `currentColor`, square caps,
  roughly 1.5px strokes. Never filled, coloured or emoji. Bigger, hand-drawn
  pictures (a call to action, an empty state) are illustrations: see
  [illustration.md](illustration.md).
- **Loading.** A placeholder box, or a line drawing itself on in held drawings.
  No spinners at Sheet or Drafted level. At Quiet, a thin instrument progress
  bar.

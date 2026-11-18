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
hand-drawn, a 1px `--ink` border if not), a paper face
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
`--surface` patch so lines don't run through it. Use one only when it tells the
reader something true and useful ("See sheet 3", "TBD"); a note that only
imitates a drawing ("Datum A", "Ø 2.4 mod typ.") is noise. Decorative notes
are `aria-hidden`.

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

**Confirmation.** A modal dialog that asks before something that can't be
undone (`confirmAction` in confirm.ts), never the browser's `confirm()`. Its
title is the question ("Delete Team 1?"), its body says in a line or two what
will happen (who'll be disconnected, what's left behind), and its buttons are
**Cancel** and the action named in full ("Delete channel", never "OK"), at the
foot on the right, the action primary. Cancel takes focus first, so Enter alone
never does the destructive thing. Closing it any other way is a no. The plate
is in the page from the start (`CONFIRM_HTML`), so its edge is sketched.

**Popover menu.** A short list to choose from, opened by a button: what a
`<select>` would be (`menuButton`, `menuField` in menu.ts). The button is an
instrument, like the rows and fields it sits among: square, a 1px `--rule`
border, mono text naming the choice or what it does ("Move to…"), and a thin
caret. The menu is a transient surface, so it's drawn by hand: a rounded box
(the boxed button's 10px corners) sketched in pencil, over a crisp rounded
border as the fallback, with a solid `--surface` face and no shadow. It pops
out of its button (the card's poses, a third of the sway, settling square: it's
read and used) with the card's pop on its first drawing out, and snaps back into
the button when it closes; reduced motion just shows it. It opens in the top layer
(a `popover="manual"`), so nothing clips it, not even a dialog; it's placed
from script and closes itself, so it can snap back.

- Items are names in sans; a heading over a group is a `.label`, and a group
  can have a divider instead (or as well): a crisp 1px `--rule` line above it,
  for setting groups apart without naming them. The chosen
  item gets a tick in the margin every row keeps for it; an item that can't be
  chosen (where something already is) is in `--ink-2`. The row the keys are on
  gets a `--faint` wash, the pointer's turns `--accent`.
- It opens below its button, or above when there's more room, held on screen,
  as wide as the button (within reason), scrolling inside past its room.
- Keyboard, as the menu button pattern has it: Enter, Space or Down opens on
  the chosen item, Up on the last; arrows, Home, End and typing move; Enter or
  Space chooses; Escape and Tab close back to the button. Pressing anywhere
  else, scrolling the page or resizing closes it.
- **Two steps**, when one button covers several kinds of choice (a row's
  Actions: move to a channel, or set a team): the first list names the kinds,
  each ending in a `›`; choosing one swaps the list in place for its choices,
  under a Back item (Left arrow goes back too, Right arrow goes on). Never
  deeper than two. Give an item `next` (its own label, groups and onChoose).
- **Settings** are ticked items (give each `checked`). One that's on or off
  ("Sound") is a checkbox item: Space switches it and keeps the menu open.
  One of a set ("Theme: Auto, Light, Dark") is a radio item in a group with
  `radio` and a heading. A click or Enter (or Space on a radio) chooses,
  shows the new tick for three drawings, then closes.
- **A menu button that can't be used now** (`disabled`) stays focusable:
  it's `aria-disabled`, so focus isn't lost when a page redraws it, and a
  screen reader hears it's unavailable. It won't open; its `title` says why.
- **An item that can't be chosen now** (`disabled`) says why in its `title`
  (hover, and a screen reader's description), not in its label: the label
  stays an instruction ("Delete all team channels", not "… · none left").
- One at a time. A page redrawn from live data holds its redraws while one is
  open (`isMenuOpen`, `onMenuClose`), and gives each button a `key` so focus
  can find it again after a redraw.

**Date field.** A date and time, the same in every browser, in place of a
native `datetime-local` input (`dateField` in date.ts). It's instruments: a
date to type (YYYY-MM-DD, mono) with a square calendar button joined to its
right, and a time to type (24-hour HH:MM). What's typed loosely ("7:30 pm") is
written out in full once you move on; what isn't a date or time gets an
`--accent` border. The calendar is a transient surface, as a menu is: a solid
`--surface` face in a rounded box, sketched in pencil over a crisp rounded
border as the fallback (the crisp border alone at Quiet), popping out of its
button (growing in, at Quiet), in the top layer.

- The month's name between ‹ and ›, then the days under two-letter weekday
  heads, mono, `tabular-nums`. Today is underlined; the chosen day is
  inverted (`--ink` face); the key's day gets the `--faint` wash.
- Keyboard, as the date picker dialog pattern has it: one tab stop in the
  grid; arrows a day or a week, Home and End the week's ends, Page Up and
  Page Down a month (Shift: a year); Enter or Space chooses and moves on to
  the time; Escape closes back to the button. Pressing outside, scrolling or
  tabbing out closes it.
- Its value is a calendar date and a wall-clock time, never an instant: the
  page turns it into one, in the person's time zone, when it needs to.

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
- **Choosing from a list.** A popover menu (above), not a native `<select>`,
  whose open list the browser draws in its own style.
- **Input.** A bottom border only (a line to write on) or a 1px `--rule` box,
  with the `.label` above it and mono for numbers and codes. Focus is the blue
  ring. Errors are written in the accent below the field: a short handwritten or
  `.label` note, plus `aria-describedby`.
- **Checkbox / radio.** A small square or circle in `--ink`. The checked mark
  can be a hand-drawn tick: it's the user's mark on the drawing. The kit's
  checkbox is `.check` (kit.css): a native checkbox in its label, drawn
  with `appearance: none` and a masked tick. The label is the press target
  (44px tall) and clicks like a button.
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
- **Settings.** A page's settings (the theme, sound) are rare choices, so
  they wait behind one gear, in the same place on every page: an icon-sized
  gear in a circle with a `--surface` face, floating in the bottom-right
  corner above the page (`<modfox-settings>`, settings.ts; last in the
  `<body>`, so it's last in the tab order too). It opens a popover menu:
  **Theme**, one of Auto, Light and Dark (Auto says what the system shows
  now, "Auto (light)"), and, where the page has sound, **Sound**. The gear
  is drawn like a small illustration (pencil, tilted) except at Quiet,
  where it's a crisp, square line icon. Keep the corner clear of anything
  else fixed there: something anchored to the bottom that would reach the
  corner (a toast, on a phone) sits at `--settings-clear`.
- **Loading.** A placeholder box, or a line drawing itself on in held drawings.
  No spinners at Sheet or Drafted level. At Quiet, a thin instrument progress
  bar.

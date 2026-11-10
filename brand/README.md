# The modfox brand

Every modfox app is **a sheet from a set of technical drawings**: a grid,
ruled lines, labels in small mono capitals, measurements, and notes in pencil,
with a bit of humour in the margins. It should feel exact, unhurried and
handmade together, like an engineer's drawing someone has annotated with care.

The brand is in two parts:

- **The core** is the voice, and every modfox app has it: the type, the mono
  label, handwriting for short notes, the question of _instrument or hand_,
  pencil linework, pencil-test motion, quiet sound, and the sketched
  illustrations. It's what makes a page recognisably modfox's.
- **The skin** is the palette and the surfaces. modfox's own skin is
  **vellum** by day and **blueprint** at night. A product can wear its own skin
  (its own colours, a dark default) and still be modfox, as long as it keeps
  the core and fills the same colour roles. See [skins.md](skins.md).

Only the values marked **exact** below are fixed. Everything else is a
principle to apply.

## The one question: instrument or hand?

Every mark on the page was made with one of two kinds of tool. Decide which
before you draw anything; most other decisions follow.

|           | **Instrument**                                                  | **Hand**                                                                                                   |
| --------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Made with | Ruler, compass, plotter                                         | Pencil, freehand                                                                                           |
| Looks     | Crisp and exact: plain CSS                                      | Slightly irregular: Rough.js lines, handwriting, a pencil-grain filter                                     |
| Moves     | Smoothly and briefly, or not at all                             | In held drawings, like a cartoon pencil test                                                               |
| Sounds    | Silent (a pressed control clicks)                               | Like what drew it: pencil, eraser, a cartoon boing or pop                                                  |
| Typical   | The grid, borders, inputs, tables, nav, text links, focus rings | Section rules, measurements, placeholders, annotations, pop-out cards, illustrations, a boxed button's box |

**Controls read as instruments, but a boxed button's box is drawn by hand**
(Sheet and Drafted levels): a rounded box sketched in pencil, over a crisp
rounded border as the fallback, with a label in mono label type. Beyond that,
the hand is for _commentary on_ the drawing: emphasis, notes, things arriving,
things that aren't finished yet.

## How much brand an app gets

Pick a level for each app, or for each screen of a larger one, and name it when
you start. Going a level too high is the most common mistake.

| Level       | For                               | What it gets                                                                                                                                                                                                                                                                                                                                                                             |
| ----------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sheet**   | Personal sites, showcases         | Everything: the grid as the table and the content on a paper sheet, "Sheet 1 of N" sections, pencil rules drawn on, handwritten titles, illustrations, the full set of sounds. The drafting frame (double rule, zone numbers, title block) is optional, for personal sites                                                                                                               |
| **Product** | Product and landing pages         | The core on the product's own skin (often dark first). No grid: a flat background with a faint grain, open sections separated by space, not boxes. Handwritten section titles and blue notes pointing at things, a live demo framed in pencil, crisp rounded buttons in sentence case, an icon set, one idea per section. Sound: clicks, dialogs and cards. See [product.md](product.md) |
| **Drafted** | App shells, light apps            | The skin, type, module grid (drawn faintly or not at all), spec plates, hand-drawn section rules and empty states, pop-out cards, pencil-test motion for transient surfaces. Sound: clicks, dialogs and cards only                                                                                                                                                                       |
| **Quiet**   | Dense tools, forms, tables, admin | The skin, type, labels, focus ring, what the accent and note colours mean. At most one hand-drawn accent per screen. Instrument motion only. No sound, or clicks at most                                                                                                                                                                                                                 |

At every level you should still be able to tell the app is modfox's from its
type, labels and handwriting alone.

## Layout: the grid is the table, you read on the paper

The grid is the drafting table. It sits behind the page; content sits on a
sheet of translucent paper laid on top, so the grid shows around it and only
faintly through it. **Body text never sits on the full-strength grid.** See
[layout.md](layout.md) for the field, the sheet, the optional frame, and the
Product level's flat background with grain.

## The core: exact values

**Type (exact).** Three families, self-hosted:

| Family    | Token         | Weights  | Role                                       |
| --------- | ------------- | -------- | ------------------------------------------ |
| B612      | `--font-sans` | 400, 700 | Body, names, headings                      |
| B612 Mono | `--font-mono` | 400      | Labels, specs, numbers, measurements, code |
| Caveat    | `--font-hand` | 500      | Handwriting: titles, notes, short asides   |

- **Labels**: mono, 11px, `0.14em` tracking, uppercase, the secondary ink. The
  most recognisable piece of type: field names, column headers, section
  kickers, eyebrows, metadata. Kept at every level.
- **Body**: sans 15px, `line-height` 1.55–1.6. Specs and values: mono 11–12px.
- **Only the wordmark is big and bold** at Sheet and Drafted; a Product hero
  can be big too, in B612. Everything else is 400, with the occasional 700.
- **Handwriting is for short, fixed strings you wrote**, never user data or
  anything long. It sits at a slight tilt: −0.6° for titles, up to −1.5° for an
  aside. Larger handwriting goes through the pencil-grain filter.
- `h1`–`h3` get `text-wrap: balance`.

**The module (exact).** One length, `--m` (50px, 40px when narrow), sizes and
places everything at Sheet and Drafted, with a minor line every fifth. Sizes
are whole modules or fifths. Text sits _inside_ module-sized boxes; the grid
never stretches to fit it. Product pages may use plain CSS layout, but keep
spacing in modules where it's easy.

**The beat (exact).** Hand-drawn motion runs at **12 drawings a second**
(≈83ms), holding each pose (`steps(1, end)`), never tweening. Instrument motion
is smooth, `ease`, at most 200ms. Sounds land on drawings too. See
[motion.md](motion.md).

**The colour roles (exact in meaning, not value).** Every skin fills the same
roles; see [skins.md](skins.md). Two of them carry meaning everywhere:

- **The accent** (modfox's red pencil) marks what's _happening_ or what you're
  _pointing at_: live status, hover, errors, the one thing that needs
  attention. Spent on decoration, it stops meaning anything.
- **The note colour** (modfox's blue pencil) is modfox's own hand: personal
  notes and asides, and the keyboard focus ring.

## Sound

What's drawn by hand makes a sound, quietly: a pencil as things are shaded in
and long lines drawn, an eraser, a cartoon boing as a dialog springs open and a
pop as a card does. Pressing a control clicks, down and up with the hand.
**Sounds react to what's seen**, landing on the drawing where something visibly
happens. Nothing plays before the visitor's first press, so a sketched speaker
beside a "Turn on sound" button invites one. See [sound.md](sound.md).

## Never

- Darken the page behind a dialog. Wash it out with the paper colour at 70–85%.
- Give a modal dialog no backdrop, or a window one. Only windows can be dragged.
- Put body text on the full-strength grid.
- Add drop shadows, gradients, glassmorphism or glows. The drawing is flat:
  depth comes from lines and from paper covering what's beneath it.
- Use rounded "card" UI at Sheet and Drafted. Corners are square, or roughly
  drawn by hand. (Product pages may round crisp buttons and panels a little.)
- Fade something in from nowhere. It grows out of what opened it, or it's
  drawn on.
- Tween hand-drawn motion, or make it bounce, spring or ease.
- Make every line hand-drawn. Most lines are instruments.
- Put a pencil or sketch filter on photos or someone else's art. The pencil may
  _reveal_ art, but never sits on top of it.
- Use handwriting for runtime text, long text or anything read closely.
- Paint paper-coloured strokes to "erase". Cut it out with a mask.
- Use a colour that isn't a role of the skin, or (at Sheet and Drafted) a size
  that isn't in modules or fifths.
- Tilt instrument things. Small hand-drawn things sit about 1° off square (at
  most 1.5°); illustrations about −3°. A button tilts only as part of an
  illustration, and then with it.
- Play a sound before the visitor has pressed something, louder than a pencil,
  or for something nobody saw happen.

## Always

- Give every hand-drawn line a plain CSS version underneath: for no script, for
  reduced motion, and in case the drawing layer fails.
- Under `prefers-reduced-motion`, show the end state at once.
- Give every pointer action a keyboard version. Anything that opens on hover
  also opens on `:focus-visible` and closes on Escape.
- Make the focus ring 2px in the note colour, offset 3px.
- Never put something _only_ in a hover surface: touch has no hover.
- Treat fetched extras (live status, counts) as enhancements.
- Use drafting language where it fits: "Sheet 2 of 3", "Rev. B", "Ø 2.4 mod
  typ.", "Datum A", "Not to scale", "TBD". Wry, never cute.

## The rest

| File                               | Covers                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| [skins.md](skins.md)               | The colour roles, the vellum/blueprint skin, making a product skin                         |
| [layout.md](layout.md)             | The grid as the table, the paper sheet, the optional frame, grain                          |
| [linework.md](linework.md)         | Rough.js levels, drawing lines on, the one pencil, the pencil-grain filter                 |
| [motion.md](motion.md)             | Pencil-test rules, the pop, shading in, erasing, instrument motion                         |
| [components.md](components.md)     | Spec plate, dimension line, placeholder, pop-out card, dialog, buttons, inputs, tables     |
| [product.md](product.md)           | The Product level: hero, framed demo with notes, features, data graphics, the closing call |
| [sound.md](sound.md)               | Sound design, browser rules, the sounds, timing with animation                             |
| [illustration.md](illustration.md) | The sketched illustration style; the speaker                                               |

The kit's code (`src/kit/`) implements all of it; the style guide
(`bun run dev`) shows it working.

## Before you finish

- [ ] Picked a brand level and stuck to it
- [ ] Decided instrument or hand for each new thing, and drew, moved and voiced it to match
- [ ] Only the skin's colour roles, checked in both themes
- [ ] Body text on paper, never on the full-strength grid
- [ ] Sized in modules or fifths (Sheet, Drafted), and checked at narrow widths
- [ ] Hand-drawn things have a CSS fallback, and reduced motion shows the end state
- [ ] Keyboard and screen-reader equivalents for anything on hover
- [ ] Every dialog is a modal (backdrop, not draggable) or a window (no backdrop, draggable)
- [ ] Sounds fit the level, land on a drawing, cancel with their animation, and stay quiet

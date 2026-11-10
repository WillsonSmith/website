# Illustration

Read this when drawing a picture rather than a line or an icon: a call to action,
an empty state, a small drawing that explains something. The sketched speaker
that switches sound on is the reference: draw new illustrations in its style.

Small interface icons stay as they are (see Icons in
[components.md](components.md)): thin, crisp, single-weight. An illustration is
bigger, drawn by hand, and there to be noticed.

## Style

- **Line only, in pencil.** Strokes in `currentColor`, no fills, no colour of
  its own: `--ink` at rest, `--accent` on hover when it's pressable, `--note` only
  for modfox's own aside beside it.
- **Drawn as plain geometry first.** Author it as a clean SVG on a small grid
  (the speaker is `viewBox="0 0 64 48"`): straight lines and quadratic curves,
  round caps and joins, stroke about 1.6. Each stroke is its own `<path>`, so
  it can be shown, hidden or drawn on by itself.
- **Then sketched.** Once Rough.js has loaded, redraw each stroke with the
  "quick sketch" level (roughness 0.9, bowing 0.8, multi-stroke, vertices
  pinned) and a fixed seed per stroke, so it's the same sketch every visit. The
  clean SVG stays underneath as the fallback.
- **Few strokes.** A recognisable silhouette in under ten strokes. It's a margin
  sketch, not an engraving.
- **Sized in modules.** The speaker is 1.6 × 1.2 modules.
- **Tilted, like a note dashed off in the margin.** About −3°: past the 1.5°
  for small hand-drawn things, because an illustration is bigger and meant to
  look placed by hand. A control that belongs to it (its button) tilts with it,
  the one case where a control sits off square.

## States are strokes

Show a change of state by drawing or removing strokes, not by swapping
pictures. The speaker is crossed out while muted; switched on, the cross goes
and its sound waves are drawn on one by one, 2 drawings each, with a pencil
stroke you can hear. Reduced motion shows each state at once.

## As a control

When an illustration is pressable (a call to action), pair it with a real
button in label type, so it reads as something to press: the speaker sits
beside "Turn on sound", whose box is a sketched rounded rectangle (a boxed
button, see components.md). The whole thing is one `<button>` with an
accessible name (`aria-label="Sound"`, `aria-pressed`); the picture is
`aria-hidden`. Lay out every label it can show in the same cell, so it never
changes size, and keep it in place whatever its state.

## The speaker

```html
<svg class="speaker__art" viewBox="0 0 64 48" aria-hidden="true" focusable="false">
  <path data-stroke class="speaker__body" d="M6 17 L16 17 L16 31 L6 31 Z" />
  <path data-stroke class="speaker__body" d="M16 17 L28 7 L28 41 L16 31" />
  <path data-stroke class="speaker__wave" d="M34 17 Q39 24 34 31" />
  <path data-stroke class="speaker__wave" d="M39 12 Q47 24 39 36" />
  <path data-stroke class="speaker__wave" d="M44 7 Q55 24 44 41" />
  <path data-stroke class="speaker__mute" d="M37 18 L49 30" />
  <path data-stroke class="speaker__mute" d="M49 18 L37 30" />
</svg>
```

A ready-made `<modfox-speaker>` element, wired to sound, is in the
kit: `src/kit/speaker.ts` and `src/kit/elements.ts`.

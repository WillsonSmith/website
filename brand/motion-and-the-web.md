# Motion and the web guidance

Read this with [motion.md](motion.md) whenever a guide from modern web
guidance (the `modern-web-guidance` skill) says how something should move.
The two are built for different things, and this page says where each one
decides.

## Two intents

The web guidance designs motion for **perceived speed**: motion that gets
out of the way, so the interface feels instant. Its patterns carry values
to match, such as a menu that opens in under 150ms with opacity and a small
translate.

The brand's hand-drawn motion is designed for **character**: the thing you
opened was drawn, and it springs out of what you pressed like a cartoon on a
pencil test. It's slower on purpose (about half a second to open), held on
twos, and it overshoots.

Both are right for what they're for, and the brand already has both:

| Kind of motion              | Intent          | Follows                                                              |
| --------------------------- | --------------- | -------------------------------------------------------------------- |
| Instrument motion           | Perceived speed | The web guidance, nearly as is: ≤200ms, eased, opacity and translate |
| Hand-drawn motion (the pop) | Character       | The brand: held poses, overshoot and squash, sound on a drawing      |

The level decides which a page gets. **Quiet** uses only instrument motion:
a tool used all day shouldn't perform for its user. Sheet, Drafted and
Product use hand-drawn motion for what the user draws or opens, and
instrument motion for chrome (see motion.md).

## Where the brand decides

For hand-drawn motion, the brand's values replace a guide's, and each has a
reason:

- **Held poses, not tweens.** Every keyframe holds for a whole drawing
  (`steps(1, end)`), 12 drawings a second, or 24 for a big surface. A
  guide's `ease-out` would make it a slide, not a drawing.
- **About half a second to open, two or three drawings to close.** A
  guide's 100–200ms can't hold six poses.
- **Overshoot, squash and a decaying turn.** A guide asks for opacity and a
  small translate only. The pop's poses are what make it hand-drawn.
- **A beat after the click.** A dialog opened by a click waits up to half a
  drawing after the click's release, so press, release and spring are
  distinct beats. Never longer.
- **Sound lands on a drawing** (sound.md), so the motion and its sound are
  timed together.
- **Closing animates too, so the kit closes things itself.** The menu snaps
  back into its button and a dialog shrinks into what opened it. A browser's
  own light dismiss would hide them at once, so:
  - the menu is a `popover="manual"` (top layer only), not `"auto"`, and
    the kit handles Escape, Tab and pressing elsewhere;
  - dialogs don't use `closedby`: the kit's `popDialog` catches Escape, and
    a click outside closes only when the press began outside too.

## Where the guidance decides, even for cartoon motion

Character never costs access. These hold at every level:

- **Reduced motion shows the end state at once.** No poses, no boil, no
  shading in, no drawing on: the thing is simply there. Colour changes on
  hover and focus stay. Check with `reducedMotion()` per animation, never
  by shrinking every duration globally.
- **Animate what's cheap to animate.** The pop is `rotate()` and
  `scale()`, content comes in with `opacity`, a picture is shaded in with
  `clip-path` (as the guidance recommends for reveals), and the pencil
  draws with `stroke-dashoffset` on small SVG strokes. Never layout
  properties (`width`, `top`, `margin`).
- **No flashing.** Nothing goes light to dark more than three times a
  second, at any motion setting. The boil and the eraser change a thin line,
  never a filled area or a colour, and must stay that way.
- **Motion that runs on can be stopped.** Anything that keeps moving by
  itself for more than five seconds needs a way to stop it. The boil runs
  only while a transient card is up, and moving away or Escape puts it away;
  nothing boils on load or on a page left open.
- **Input and focus never wait for an animation.** Focus moves when a
  dialog or menu opens, not when its pop ends. A closing menu stops taking
  pointer events at once, so a click goes to what's underneath.
- **Every animation ends in its final state**, and code waiting for one to
  finish carries on at once when none ran (`getAnimations()` is empty),
  rather than waiting for an `animationend` that never comes.

## What to take from a guide anyway

A guide's mechanics are usually right even when its values aren't:

- the top layer, popovers and modal dialogs (`showModal()`), with the
  kit's own dismissal as above;
- `transform-origin` at the source, so things grow out of what opened them
  (a guide says "motion that opens from its trigger" too);
- the Web Animations API (`element.animate()`), which the kit's poses use;
  CSS transitions with `@starting-style` and `allow-discrete` are fine for
  instrument motion;
- its fallbacks and feature detection (see "The web guidance" in
  [README.md](README.md) for the kit's browser support).

Take those, then set durations, easing, poses and sound from motion.md.

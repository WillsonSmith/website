# Motion

There are two kinds of motion, matching the two kinds of tool. Under
`prefers-reduced-motion: reduce`, both show their end state at once.

## Instrument motion: smooth and brief

UI chrome that a person didn't draw (a nav settling into place, a tab
indicator, smooth scrolling, a value updating) moves like an instrument:
continuously, with `ease`, in **200ms or less**, using opacity and small
translations only. No overshoot, no held poses, no boil.

Dragging is direct manipulation, not animation: the thing follows the pointer.
Only windows drag: a dialog that doesn't block the page (no backdrop), which may
cover something you want to look at or use. A modal dialog never drags: it
blocks the page, so there's nothing behind it to get at. Dragging for its own
sake costs page scroll on touch.

Quiet-level apps use only this kind of motion.

## Hand-drawn motion: a pencil test

Anything drawn by hand that appears, changes shape or disappears moves like a
classic hand-drawn cartoon filmed one drawing at a time.

1. **Animate on twos.** The beat is 12 drawings a second (`FRAME_MS = 1000 /
   12`, ≈83ms). Hold each pose for a whole drawing, then jump to the next. Give
   every keyframe `easing: "steps(1, end)"`. Every duration is a whole number of
   drawings.
   **Big moves go on ones.** A surface covering much of the screen (a dialog)
   adds an in-between halfway between each key pose over the same duration (24
   held drawings a second). On twos, each of its jumps covers too much ground
   and reads as choppy. It's still held, never tweened.
2. **Grow out of the source.** Set `transform-origin` to the point the thing
   comes from, such as the button that opened it or the tip of a card's tail on
   the thing it describes. It springs out of something and collapses back into
   it.
3. **Overshoot, squash, settle**, in about six drawings (½s). Squash and stretch
   go in opposite directions so the shape seems to keep its volume. A small
   rotation per pose decays to 0. Big surfaces get about a third of the rotation:
   turned about a far-off source, a few degrees swings a whole plate across the
   screen.
4. **Exits are quicker and anticipate**: two or three drawings, a small squash
   first, then a snap back into the source.
5. **Secondary marks come in later.** Content appears once the shape is roughly
   full size (drawing 2), so it never smears through a squash. On the way out,
   content stays and shrinks with its shape. Accents last only a drawing or two.
6. **Glanced-at things settle slightly off square** (about 1°, at most 1.5°).
   Things you read and use, like dialogs, settle square.
7. **Boil gently, and only while something is up.** A small transient surface
   can redraw its outline in a slightly different wobble: three fixed seeds,
   each held 250ms (three drawings), vertices pinned. Static linework and
   dialogs never boil.
8. **Wait for intent.** Hover-triggered drawings wait ~70ms before opening, keep
   ~90ms of grace before closing, and swap straight to a neighbour. A dialog
   opened by a click waits half a drawing after the click's release sound, so
   press, release and spring are distinct beats.
9. **Arrive by being drawn, not by bouncing in.** Content on the page is shaded
   or drawn in on load, top to bottom. A pop on every visit is distracting.
   Save the pop for things the user opens.
10. **Content before decoration.** Real content draws first. Decorative lines
    follow once the drawing layer has loaded.
11. **Outline, then contents.** Anything that arrives in a box has its outline
    drawn on first. Pictures inside are shaded in; everything else appears in
    held drawings once the outline closes. A plate is lettered in a row per
    drawing as its box closes, top to bottom, its paper face arriving with the
    first row. Text is never shaded or drawn stroke by stroke.
12. **Sound lands on a drawing.** A sound plays on the drawing where its thing
    visibly happens (a card's first drawing out, a dialog's overshoot), not on
    the input behind it, and is cancelled if its animation is. See the timing
    table in [sound.md](sound.md).

### The pop

Each pose is `[scaleX, scaleY, rotateDeg]`, one per drawing:

```ts
const FRAME_MS = 1000 / 12;

const OPEN: [number, number, number][] = [
  [0.18, 0.32, -6],
  [0.72, 1.12, 4],
  [1.16, 0.88, -2.5],
  [0.94, 1.06, 1.5],
  [1.03, 0.97, -0.5],
  [1, 1, 0],
];

const CLOSE: [number, number, number][] = [
  [1.06, 0.94, 0],
  [0.5, 0.72, -4],
  [0.1, 0.16, 0],
];

/** Keyframes that hold each pose for one drawing. `tilt` is the resting angle; `sway` scales the rotation. */
function poseFrames(poses: [number, number, number][], tilt = 0, sway = 1): Keyframe[] {
  return poses.map(([sx, sy, turn]) => ({
    transform: `rotate(${turn * sway + tilt}deg) scale(${sx}, ${sy})`,
    easing: "steps(1, end)",
  }));
}

el.animate(poseFrames(OPEN, 1), {
  duration: FRAME_MS * (OPEN.length - 1),
  fill: "forwards",
});
```

For a dialog, use `sway = 1 / 3`, `tilt = 0`, and put it on ones by adding a
pose halfway between each pair.

### Revealing art and photos

Images are **shaded in**, not faded: a diagonal edge crosses the image in held
drawings on twos, revealing it, with a band of pencil hatching along the edge
(about 8 drawings for a large image, fewer for an avatar). The pencil only
reveals. It never stays on top of the image.

### Erasing

To replace something drawn, scrub it out: a single thick Z of eraser strokes,
one per held drawing, tilted and jittered so no two look alike, with a few
eraser crumbs flicked away over 1–5 drawings. Cut the strokes _out_ with a mask
so the paper and grid show through. Don't wipe it clean: shade the new thing in
over what's left.

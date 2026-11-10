# Sound

Read this before adding any sound to a modfox app. Sound follows the same
question as everything else: **instrument or hand?** What's drawn by hand makes
a sound; instruments stay silent, except that pressing a control clicks.

It should sound like a sheet being drawn on: a pencil, an eraser, a little
cartoon boing. Never like an app beeping at you. If a sound would be the
loudest thing in a quiet room, it's too loud.

A working implementation (Web Audio, no dependency), the six sounds below and
their credits are in this kit: `src/kit/sound.ts`, `sound/` and
`sound/SOURCES.md`.

## How much sound an app gets

| Level       | Sound                                                                   |
| ----------- | ----------------------------------------------------------------------- |
| **Sheet**   | Everything below                                                        |
| **Drafted** | Control clicks, dialog open and close, pop-out cards. No drawing sounds |
| **Quiet**   | None, or control clicks at most                                         |

## The rules

1. **Sounds react to what's seen, not to the input behind it.** A sound lands on
   the drawing where the thing visibly happens (a card's first drawing out of
   its source, a dialog's overshoot), not on the hover or click that started
   it. If the animation is cut short, cancel its sound.
2. **What's drawn by hand makes a sound.** Shading in, long hand lines, erasing,
   things popping open. Short marks (ticks, crosses) and instrument lines are
   silent: too frequent to be pleasant.
3. **Pressing a control clicks**, in two halves that follow the hand: down as
   the mouse button or key goes down, up as it's let go. A tap plays both as it
   lands (60ms apart): a touch may turn into a scroll, and a sound can't be
   taken back.
4. **Quiet.** One master level well below an alert, each sound a level beneath
   it. Nothing is louder than the pencil.
5. **Nothing piles up.** Each sound has a voice limit, counted over the time each
   one actually plays (a chain scheduled all at once, like six circles redrawn
   200ms apart, keeps every sound). A repeatable sound (boing, pop, click) cuts
   the last one off with a 30ms fade instead of being dropped.
6. **No two strokes sound the same.** The pencil and eraser play a random slice
   of one recording, as long as the drawing it goes with. Every sound varies
   its pitch by ±6%.
7. **Sound goes with its animation.** Reduced motion skips the animation, and so
   its sound. Nothing plays in a hidden tab.

## What browsers allow

- **No sound before the visitor's first click, tap or key on each page load.**
  Scrolling and hover don't count. So the first draw-in on load is always
  silent. Design for that rather than fighting it.
- **Fetch at the first sign of life, decode on the first press.** Start fetching
  the files on the first pointer move, touch or key (they're small), and create
  the `AudioContext` and decode them inside the first press. A visitor who never
  interacts loads nothing.
- **A sound asked for while audio wakes up** (the press that unlocked it is the
  one that wants it) still plays if it's ready within 250ms; later, it no
  longer belongs to its moment and is dropped.
- **Returning listeners** (sound on, and heard here before) get a try at
  starting audio on load. Browsers usually refuse unless the visitor allowed
  autoplay for the site. Ask first where the browser can say
  (`navigator.getAutoplayPolicy("audiocontext")`), so a refusal doesn't log a
  warning. A first visit never hears anything unasked.
- **The press that wakes audio can change state before its click lands.** A
  control that toggles sound acts on what it _showed_ when the press began, not
  on the state at click time.

## The switch

On by default once the visitor has interacted, remembered between visits, and
switched by one control: a sketched speaker beside a "Turn on sound" button
(see [illustration.md](illustration.md)), placed prominently near the top. It's
the call to action as well as the switch, so it says "turn on", never "turn up
your volume". It stays put whatever its state (both labels laid out), so nothing
shifts.

## The sounds

All CC0, credited anyway in `sound/SOURCES.md`. Mono MP3, about 80 kbps,
leading silence trimmed, loudness evened out to −20 LUFS (the page plays them
far quieter). About 45KB for the set.

| Sound           | Recording                               | Level | Voices          | Notes                                   |
| --------------- | --------------------------------------- | ----- | --------------- | --------------------------------------- |
| Pencil          | pencil_write, NachtmahrTV               | 0.35  | 3               | Random slice, the length of the shading |
| Line            | same, at 0.9×                           | 0.22  | 2               | Long hand lines: lower, slower, quieter |
| Eraser          | pencil_erase, damsur                    | 0.40  | 2               | Random slice, the length of the erase   |
| Boing           | jews_harp_boing, C-V                    | 0.30  | 1, restarts     | Dialog opening                          |
| Pop             | cartoon pop or drip, AlaskaRobotics     | 0.30  | 1, restarts     | Pop-out card opening                    |
| Thup            | the pop at 0.5× (an octave down)        | 0.32  | 1, restarts     | Dialog closing                          |
| Press / release | Kenney switch_001, split at its silence | 0.25  | 1 each, restart | A control's click halves                |

Master level 0.6. Only CC0 sources: check the licence on each sound's own page,
and never use CC-BY-SA or "free for personal use".

## Timing with animation

The beat is the drawing (≈83ms, see [motion.md](motion.md)). Each sound is
placed on a drawing:

| Moment                  | Animation                                                                | Sound                                                                     |
| ----------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Avatar shaded in        | 5 drawings                                                               | Pencil, same length, starting with the shading                            |
| Art shaded in           | 8 drawings                                                               | Pencil, same length                                                       |
| Long hand line (≥200px) | Its own drawings                                                         | Line, the length of the stroke (first pass only; going over it is silent) |
| Erasing                 | 3 drawings                                                               | Eraser, same length                                                       |
| Control pressed         | —                                                                        | Press on pointer/key down, release on up; a tap plays both                |
| Dialog opens            | Waits ½ drawing (one drawing on ones) after the release click, then pops | Boing on drawing 2, the overshoot                                         |
| Dialog closes           | Squash, then snap back in (2 drawings)                                   | Thup as the close starts                                                  |
| Pop-out card opens      | After the 70ms hover delay; drawing 0 is a speck at its tail             | Pop on drawing 1, the first out; cancelled if it closes first             |
| Speaker switched on     | Its waves drawn on, 2 drawings each                                      | Line, the length of the waves                                             |

# Pointer-driven Color drift — 2026-09-22

## Reference finding and final scope

User clarified that the important behavior is the response to the pointer, not recreating the complete reference website. A 16-frame contact sheet covering the first 8 seconds of the original video showed new pigment following cursor movement, with older traces curling and dissipating. The public reference video was downloaded only into `/tmp/color-drift-reference`, not included in the site.

The final page retains our original small composition and copy. The unrelated editorial layout exploration was archived before publication. V1 was also archived with its tests and an explanation.

## Behavior changes

- Replaced the autonomous fixed-wave WebGL shader with a bounded 180×110 CPU fluid simulation rendered through Canvas 2D.
- Semi-Lagrangian velocity and dye advection, pressure projection, vorticity confinement and dye dissipation. Pointer travel injects dye and directional momentum; segments are interpolated to avoid gaps.
- Full page starts empty. No pointer movement means no new pigment. Old pigment continues evolving and dissipates after the pointer stops.
- Rose, Tide and Amber choose the color of subsequent input. Existing pigment remains in the field.
- Pause freezes the field and disables input. Clear removes both pigment and momentum, retaining the pause state.
- Still/reduced-motion mode allows static marks but starts no animation. Thumbnail uses a deterministic sample gesture.
- Simulation suspends offscreen/hidden and stops after pigment dissipates. Mobile pointer capture permits drawing with a finger; the drawing area reserves touch gestures, while the surrounding page remains scrollable.
- Disabled text selection inside the drawing stage after native drag QA exposed accidental selection.

## Verification

- Native Safari: full page's blank initial state and layout inspected.
- Native Chrome: actual pointer drag generated a broad pink/purple curling trail; later screenshot showed continuing evolution; Pause displayed Resume and the paused state.
- Further Chrome actions occasionally failed because the foreground window changed during tool operation. Clear is covered by simulation tests; no claim of completed native Clear or mobile touch acceptance.
- Tests: 27 passed, including empty initial field, localized input, momentum, post-input evolution/dissipation, finite values, clear and subsequent restart.
- `pnpm typecheck`: passed.
- `pnpm exec tsc --noEmit --allowJs --checkJs --target ES2022 --module ESNext --moduleResolution bundler --skipLibCheck public/lab/color-drift/script.js public/lab/color-drift/fluid.js`: passed.
- `pnpm build`: passed. No lint script exists in this repository.

## Limits

This implements the observed interaction principle with original code, not the original author's undisclosed implementation. Resolution is deliberately limited for CPU cost; fine detail differs from a full-resolution GPU simulation. Mobile visual/touch validation remains outstanding. Other lab experiments are unchanged.

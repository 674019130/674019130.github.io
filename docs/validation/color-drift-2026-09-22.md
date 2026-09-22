# Color drift — 2026-09-22

Reference: https://x.com/basit_designs/status/2102067269165592945

Observed the original video in Chrome: white editorial layout, pink/lilac moving color behind the hero, subsequent dotted-circle and contour-line sections, and a soft color footer. This experiment adapts the hero's color/typography principle; it does not reproduce the entire recruiting website or the later point-cloud sections. Original copy and shader, no reference assets or source code copied.

## Implementation

- Independent `/lab/color-drift/` page and bilingual Lab entry.
- Original WebGL domain-warped noise and soft ribbon; Rose, Tide and Amber palettes; gentle pointer offset.
- Pause preserves time; palette selection works while paused.
- Reduced-motion and `still=1` prevent the render loop. Hidden/offscreen pages stop rendering. Context loss falls back to static color and restores the existing pause state.
- No new dependencies. Shared preview and dark-theme conventions retained. Existing experiments unchanged.

## Verification

- Existing suite: 24 passed. New lifecycle tests: 3 passed.
- `pnpm typecheck`: passed.
- `pnpm exec tsc --noEmit --allowJs --checkJs --target ES2022 --module ESNext --moduleResolution bundler --skipLibCheck public/lab/color-drift/script.js`: passed after declaring the script as a module.
- `pnpm build`: passed. Local Node 26 emits the existing Node 24 engine warning; CI uses Node 24.
- Native Chrome: actual shader rendering visible; Rose and paused Tide screenshots checked; dark `preview=1&still=1` checked.
- Mobile visual QA attempted via Chrome device mode, but the computer-use surface stopped returning the accessibility tree or screenshot. Responsive CSS is present; mobile visual acceptance remains unverified.
- GPU fallback/context-loss/reduced-motion scheduling tested with mocks; no claim of cross-device GPU testing.

## Risks

WebGL performance varies by device. Drawing resolution is capped at 1.5 device pixels per CSS pixel and animation at approximately 30 frames per second. Static CSS color remains available if WebGL initialization fails. The effect is an interpretation, not a frame-identical reproduction of the reference.

# Folding card — 2026-09-21

## Reference and implementation
- Reference viewed in Chrome, including fullscreen video open and closed states: https://x.com/iamncdai/status/2101608687702053067
- Independent implementation; no author source, image or identity assets copied.
- Vanilla CSS 3D two-sided leaf, shared hinge, interpolated centering and shadows. Existing shared Lab styles and preview protocol; no new dependencies.
- New `/lab/folding-card/` and gallery entry. Prior experiments remain unchanged.

## Verification
- `npm test`: 19 passing, including interrupted motion, still-mode endpoints, slider/reset, pointer cancellation and link exclusion, and gallery SSR link.
- `npm run typecheck`: passed.
- `node --check public/lab/folding-card/script.js`: passed.
- `node_modules/.bin/tsc --noEmit --allowJs --checkJs --target ES2022 --lib ES2022,DOM --skipLibCheck public/lab/shared/setup.js public/lab/folding-card/script.js`: passed.
- `npm run build`: passed; existing MySQL syntax-highlighting warnings.
- Chrome local UI: viewed open/closed layouts, clicked open/reset/still mode, dragged closed, used Home/Right/End on slider. No clipping seen in desktop states.
- Hidden contact links remain inert until fully open. Hidden faces use aria-hidden. OS reduced motion and explicit still mode skip settling animation.
- Window automation stopped returning content during attempted narrow-screen emulation. Mobile touch, dark-mode and gallery hover preview visual inspection remain unverified; do not treat automated state tests as those visual checks.

## Impact and limits
Only a new experiment and Lab entry. No site framework, home, articles or old experiment behavior changes. Native CSS 3D, pointer capture and inert require a modern browser. Real device touch verification remains a follow-up.

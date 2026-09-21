# Folding card: Duo handoff and pointer lighting — 2026-09-21

## Change and reference
The previous rotating-paper implementation is preserved under `archive/lab/2026-09-21-before-duo-lighting/` with its removal reason. The existing public route and gallery integration remain unchanged.

Reference: https://x.com/iamncdai/status/2101608687702053067
Supporting design research: https://developer.apple.com/videos/play/tech-talks/111466/ and https://github.com/akashtdev/iphone-duo-animation . No reference implementation code or assets copied.

Replaced rotating text with front-facing content clipped to a perspective-projected folding surface. Opening angle controls blur, opacity and content displacement. A shared pointer light changes each surface’s gradient location, hue and intensity with the hinge normal. The last pointer position persists; there is no autonomous light drift. Added a Holographic toggle. No dependencies added.

## Verification
- `npm test`: 21 passing, including existing fold interruption, drag cancellation, slider/reset and reduced-motion checks; new handoff and pointer/hinge lighting checks.
- `npm run typecheck`: passed.
- `node_modules/.bin/tsc --noEmit --allowJs --checkJs --target ES2022 --lib ES2022,DOM --skipLibCheck public/lab/shared/setup.js public/lab/folding-card/script.js`: passed.
- `npm run build`: passed (existing syntax-highlighting warnings).
- Native Chrome visual QA: closed, partially open and fully open; frontal blurred content at 118 degrees; sharp endpoints; straight center seam; distinct upper-right pink/gold and lower-left cyan/green reflection positions; dark mode and instant still-mode opening.
- Native Chrome responsive viewport set to 390 × 740: inspected upper card and scrolled to lower controls. Card and buttons fit the viewport without horizontal clipping. This is emulation, not a physical touch-device check.

## Functional impact and limits
Existing open/close, slider, reset, Escape, contact links, preview and reduced-motion behavior retained. Holographic finish defaults on and may be toggled off. Perspective geometry is calculated in JavaScript; gradients approximate an iridescent material, not physically accurate ray tracing or an exact reproduction of Apple’s animation. Modern CSS clip-path, masks, filters, pointer events and inert are required. Other experiments, homepage and writing are unchanged. Physical-device touch and cross-browser rendering remain unverified.

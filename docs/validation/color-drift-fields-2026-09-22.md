# Remaining Color drift studies — 2026-09-22

## Reference and scope

Reviewed a 25-frame sheet sampled once per second from the reference video's remaining 8–33 seconds. Particle rings and curved point fields respond around the cursor. Contours occur within process-step transitions; the video alone does not establish a direct pointer response. Footer reuses soft pigment. Original site's hiring copy and tables were not reproduced.

Added three independent sections to the existing Color drift page:
- Particle field: localized angular/radial deformation with damped return, mouse/touch and arrow-key controls.
- Contours: deterministic scalar fields traced with marching squares; Islands/Ridges/Ripples selection, interpolated transitions and an original local pointer perturbation.
- Afterglow: independently mounted instance of the existing fluid simulation, preserving original interaction.

## Verification

- `npm test`: 29 passed, including local particle response, recovery, deterministic landscapes and edge interpolation.
- `pnpm typecheck`: passed.
- Explicit `tsc --allowJs --checkJs` over all Color drift JS: passed.
- `pnpm build`: passed before the final pointer-capture release correction; final explicit JS type check and model tests passed afterward. CI performs the final build.
- Safari native QA: particle field at rest, focus/arrow interaction, visible settled ring, Ridges/Ripples controls, contour pause, footer input leaving pigment and independent footer pause checked.
- Fixed premature release of mouse interaction caused by automatic pointer-capture release on mouse-up.
- Mobile touch and physical reduced-motion settings are not visually verified. Existing still/reduced-motion logic has been retained; new fields stop animation in those modes.
- Offscreen and hidden fields stop their own requestAnimationFrame loops. The Lab thumbnail hides added sections.

## Compatibility and limits

No dependencies added. Main fluid controls are now scoped per instance so the closing field does not change the first field. Original page and controls were archived before refactoring. Canvas fallback depends on a browser supporting Canvas 2D; this is an interpretation of the observed behavior, not the author's original simulation. Marching-squares ambiguous cells use deterministic edge pairing, so fine topology may differ from a production contouring library. Other lab experiments remain unchanged.

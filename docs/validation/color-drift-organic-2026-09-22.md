# Organic fields revision — 2026-09-22

## Change
- Replace fixed-radius particle targets with evolving asymmetric polar folds, gesture-speed expansion, damped inertia and one-step motion strokes. 5,200 particles; far-field rotation attenuated by distance.
- Replace periodic terrain with smooth deterministic multiscale noise and domain warping; fewer contour levels, subtle evolving lavender/rose wash, gradual landscape transitions.
- Keep existing Canvas stack, original and footer fluid implementations, independent pause controls, visibility suspension, and still/reduced-motion behavior. Prior field scripts archived with reason.

## Validation
- `pnpm typecheck`: passed.
- Explicit `tsc --allowJs --checkJs` for all Color drift JS: passed.
- `npm test`: 30 passed, including finite states after repeated fast gestures, temporal variation, and return to base positions after release.
- `pnpm build`: passed. Local Node 26 gives engine warning (project requests 24); deployment uses project CI environment.
- Native Safari: inspected particle initial/settled frames, arrow input, Islands and Ripples terrain, landscape selection and independent pause state. Observed asymmetric folded rings and irregular closed contour islands.
- Physical mobile touch and low-end device frame rate not measured. No fidelity or FPS guarantee. Reference video does not establish whether contour changes were pointer- or step-driven; our hover deformation is an adaptation.

## Behavior / risks
- Held particle interaction now keeps evolving; terrain slowly changes while running even without hover. Pause freezes both geometry and color; reduced-motion uses static frames.
- Higher particle count and terrain sampling increase CPU work; loops remain capped near 30fps and suspended offscreen/hidden. No new dependencies.

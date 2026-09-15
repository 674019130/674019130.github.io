# Continuous Lab motion — 2026-09-15

- Receipt feed changes from 44 discrete steps over 2550 ms (about 17 position changes per second) to continuous linear transform interpolation. Duration, layout, reset and reduced-motion behavior remain unchanged. No claim of measured device FPS.
- Mascot now keeps two eye paths and one mouth path mounted across all ten expressions. Numeric control points and stroke widths interpolate on requestAnimationFrame over 420 ms. Interruptions start from the last rendered geometry; reactions morph back to their base mood. Reduced motion applies the destination immediately; pagehide cancels the frame loop. No dependency added.
- Prior source archived with removal reason in archive/lab/2026-09-15-before-continuous-motion.

Validation: npm test (9 passing), npm run build, node --check public/lab/mascot/script.js, git diff --check. Added regression coverage for intermediate geometry, interruption continuity and reduced-motion face changes. Safari foreground window checked happy/sleepy faces and printing intermediate state; screenshots are not a frame-rate measurement. Native window Raise resolves background Safari repaint suppression encountered during prior QA.

Typecheck rerun using the exact command in lab-refinement-types-2026-09-15.txt: identical existing diagnostics, no new diagnostics. Existing typecheck remains failing for the recorded archive/Waline/DOM iterable/Valaxy resolution issues.

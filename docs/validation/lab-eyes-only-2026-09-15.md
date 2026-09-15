# Eyes-only mascot — 2026-09-15

Removed mouth and cheeks from SVG, styles and morph state. Keeps the same two eye paths and interruptible 420ms interpolation. Eyes use a shared nested translation of 6 SVG units for optical centering; outer face motion remains unchanged. Proud, notice, surprised and approve now have distinct eye geometry or gaze to compensate for removing the mouth. Old source archived with the reason.

npm test: 9 passed. npm run build and node --check public/lab/mascot/script.js passed. Typecheck rerun with the command in lab-refinement-types-2026-09-15.txt; diagnostics identical to the preceding run. Safari foreground screenshots checked idle/happy without mouth or cheeks and optical placement. No new dependency, no receipt or timeline changes.

Current morph uses direct cubic control-point and stroke-width interpolation. Semantic eye parameters and blink choreography discussed as a future alternative; not implemented in this change.

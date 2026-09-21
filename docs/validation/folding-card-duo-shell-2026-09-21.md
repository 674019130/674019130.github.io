# Duo shell / rectangular display correction — 2026-09-21

## Reference and scope
User-provided 114-degree screenshot is the acceptance reference. Previous revision is preserved in `archive/lab/2026-09-21-before-duo-shell/` with its replacement reason.

The perspective shell is now black. Its front-facing display occupies the original vertical bounds, exposing the shell above and below the display while folded. Foil and glare are restricted to the display. Fixed-panel text remains sharp and stationary; only the unfolding panel receives blur and late content reveal. Angle-dependent shading darkens the display and its outer edge.

## Verification
- Native Chrome local visual inspection at 90, 114 and 180 degrees, and animated close: exposed black upper/lower shell at 114; display top/bottom aligned with fixed panel; sharp fixed text; restored left content and collapsed black wedges when fully open.
- Holographic toggle checked on/off; previous pointer lighting retained.
- `npm test`: 21 passing, including interruption, slider/reset, drag cancellation, still mode, pointer light persistence and revised display-state regression.
- `npm run typecheck`: passed.
- Explicit checkJs TypeScript check of shared/setup.js and folding-card/script.js: passed.
- `npm run build` and `git diff --check`: passed. Existing syntax-highlighting warnings remain.

## Impact and limitations
Same route, controls, links, preview protocol and dependency stack. Changed only visual layering, blur scope and angle shading. The material and shadow remain a visual approximation. This revision was visually checked in desktop Chrome; physical mobile and cross-browser rendering were not revalidated. The prior revision’s narrow viewport check does not substitute for those checks.

# Receipt and mascot refinement — 2026-09-15

Supersedes the original appearance described in kaifan-labs-2026-09-15.md. Previous HTML/CSS is archived in archive/lab/2026-09-15-before-refinement with the reason for replacement.

- Receipt: removes app branding and the former example order; uses an explicitly fictional stationery shop, sample order and decorative barcode. Narrow 240px paper, eight items, full paper footer and torn edge. Controls precede the long stage. Hover preview shows the entire strip. Existing 2550ms stepped feed, reset and reduced-motion behavior are retained.
- Mascot: replaces the original SVG face and keyframes with centered eyes, consistent mouth geometry, ten distinct expressions and smaller movements. Existing five moods, five temporary reactions, sequence controls, dark mode and static preview remain supported. Original application untouched; no new dependency.

Validation: npm test (7/7), npm run build, JavaScript syntax checks and git diff --check. Safari visually checked the narrow-window receipt footer and entire dark static preview, the centered idle face and dark happy preview. Native mood selection updated the accessible state; the first screenshot did not repaint the active face, so that screenshot alone is not claimed as animated-expression validation. Existing controller cancellation tests pass.

Typecheck command and exact existing diagnostics: lab-refinement-types-2026-09-15.txt. These include archived HomeActivity data, Waline module resolution, DOM iterable configuration and Valaxy generated/integration imports; no diagnostics originate in this change.

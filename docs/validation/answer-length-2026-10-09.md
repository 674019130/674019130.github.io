# A little less — answer length study

Reference: https://x.com/dominikmartn/status/2108179881926574321 (Dom, “drag to make ai answers shorter”). Inspected the 11.366-second public video at 2 fps, including full, intermediate, compact and restoring states. Independent implementation; no original source code or media redistributed. Demo uses original room-layout copy and four prewritten answers, clearly labelled as a local interaction study.

## Implementation and scope

- Static lab experiment, bilingual title/list entry, and durable UI lab authoring standard in CLAUDE.md.
- Match surviving tokens with a longest common subsequence, preserving order and unique repeated-token matches. English words and Chinese glyphs animate at a constant font size with native WAAPI. Full sentences remain available to assistive technology.
- Snapshot visible token rectangles before cancelling existing animation; outgoing ghosts are excluded from accessibility. Card height is animated independently; pointer dragging follows a bounded height and snaps to content height on release.
- Pointer capture, cancellation/Escape restoration, keyboard arrows/Home/End, explicit shorter/longer/reset controls, reduced-motion/`still=1`, and language switching at the current level.
- On-page bilingual explanations with actual FLIP, measured-height, anchored-handle and pointer-capture snippets. CSS and JS links included.
- Localhost-only `?motion=12` slows the same animation for inspection; ignored in production.
- Existing experiments and homepage behavior unchanged. No new dependency or AI/network service.

## Verification

- Native Chrome: default full answer; keyboard Home to shortest; actual native pointer drag from shortest back to full. Three successive slow-motion screenshots show surviving words relocating while outgoing words fade and height converges.
- Responsive review: 375 px Chinese dark/still, 320 px English, and 600 × 400 preview. No observed horizontal overflow or text collision. Long code snippets scroll within their own blocks.
- Automated model tests cover unique ordered matching of repeated words, Chinese shortening/expansion, empty input and bounded nearest-height selection.
- JavaScript syntax check, TypeScript check, regression tests and production build run for release. Actual touch-device hardware was not tested; touch handling shares Pointer Events and uses touch-action only on the handle.

Final results: `npm run typecheck` passed; `npm test` passed 33/33; `npm run build` passed. Final Chrome check confirmed Chinese full sentences in the accessibility tree and preserved detail level 2 after quick Up/Up/Down reversal followed by language switching. Existing npm project-config warnings remain unchanged.

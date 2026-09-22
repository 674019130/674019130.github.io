# Live numbers — 2026-09-22

## Reference and implementation
Reference inspected in native Chrome: https://x.com/preetsuthar17/status/2102010365307675057 . The visible demonstration uses fictional asset rows, Live/1H/1D/1W, tabular numerals and an animation toggle. This is an independent implementation with original fictional names and generated data, no copied code or assets, and no dependencies added.

Added `/lab/live-numbers/` and bilingual gallery entry. Changing digits slide within clipped slots; unchanged digits stay put. Equal-width digits are enabled by default, with proportional figures as a comparison. Live updates run every 2.4 seconds; range snapshots are deterministic. Pause persists through range switches. Reduced motion disables transitions; hidden documents stop their timers. The static page supports existing preview/theme/still parameters.

## Verification
- `npm test`: 24 passing. New checks cover stable snapshot/precision, pause/range/visibility timer lifecycle, and reduced-motion/animation opt-out. Gallery SSR includes the new entry.
- `npm run typecheck`: passed.
- `node_modules/.bin/tsc --noEmit --allowJs --checkJs --target ES2022 --module nodenext --moduleResolution nodenext --lib ES2022,DOM --skipLibCheck public/lab/live-numbers/script.js public/lab/live-numbers/model.js`: passed.
- `npm run build`: passed; existing syntax highlighting warnings remain.
- Native Chrome: desktop table, weekly snapshot, return to Live, pause, tabular/animation toggles; 390px viewport upper-table inspection; dark preview/still rendering.

## Impact and limits
Existing Lab experiments and interactions unchanged. Existing untracked folding-card audit retained and excluded from this commit. Simulated prices are not market information. Animation uses Web Animations API; no physical-device touch or cross-browser validation. Native coordinate automation intermittently failed during narrow-screen scrolling, so lower mobile controls were not visually confirmed. No exact frame-by-frame fidelity claim for the reference.

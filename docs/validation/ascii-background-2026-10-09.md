# ASCII atmosphere — 2026-10-09

Reference: https://x.com/studiobakers/status/2107806898242097632 (three static photographs, not an observed animation).

Independent Canvas implementation using two self-hosted Unsplash photographs. Three false-color treatments, photograph/treatment comparison, adjustable ASCII opacity, portrait mode and opt-in CSS drift. Characters sample the same softened image as the backdrop. No random per-frame text, no animation library, and no pixel reads during drift. Pause retains the current CSS animation position. Reduced motion and `still=1` disable drift; document visibility pauses it.

## Scope

Adds a static lab experiment and one bilingual lab list entry. Homepage background and existing experiments are unchanged. Different source photographs mean this reproduces the treatment, not identical composition. Source and license links are included in assets/credits.md. No reference artwork or source code is redistributed.

## Verification

- Chrome native UI screenshots: Haze, Ember, Grove, original photo comparison; keyboard range to 100%; built portrait + drift states.
- Size review page: 375 px dark/still, 320 px light, 600 × 400 lab preview; no observed horizontal overflow or overlapping labels. Controls wrap on 320 px; still mode disables Drift.
- `node --check public/lab/ascii-background/script.js`: passed.
- `npm run typecheck`: passed.
- `npm test`: 30 existing tests passed. These are regression checks, not canvas pixel tests.
- `npm run build`: passed after final implementation changes. npm emits existing unknown project config warnings for shamefully-hoist and strict-peer-dependencies.

Release approved by the user. Local built preview: http://localhost:5200/lab/ascii-background/ .

## Bilingual release checks

- EN / 中 switch translates headings, descriptions, controls, scene names, status messages, accessible labels, attribution labels, page title and description metadata. Implementation notes have complete English and Chinese versions. `?lang=zh` is a shareable Chinese entry point.
- Chrome verified Grove + Drift remain selected when switching language; expanded implementation notes switch to English. Chinese 375 px dark/still and English 320 px layouts have no observed text collisions.
- Final typecheck, 30 regression tests, script syntax check and production build passed.

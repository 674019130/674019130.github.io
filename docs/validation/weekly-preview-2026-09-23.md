# Weekly preview validation — 2026-09-23

The user approved publication of the minimal bilingual layout. This document retains the preview checks and limitations.

## Verified

- `pnpm typecheck`: passed.
- `pnpm test:weekly`: 6 passed, including immutable source URLs and Hong Kong week boundaries.
- `pnpm test`: 30 passed before the final compact layout revision.
- `pnpm build`: passed after the compact layout revision.
- `uv run --with mypy mypy --ignore-missing-imports scripts/weekly.py`: passed.
- `uv run --with ruff ruff check scripts/weekly.py tests/test_weekly.py --select F`: passed.
- Native Chrome desktop: sequential text/cursor, show all, expand/collapse source detail, community filtering, light/dark themes visibly worked.
- Mobile visual QA remains unverified: Chrome accessibility/screenshot output became empty when opening device tools. No mobile acceptance claim.
- Real source collection completed with 262 records and no failed sources across the 14 configured sources. An isolated full-generation trial is separate from the reviewed seed issue.

## Existing Vue diagnostics

`pnpm --package=vue-tsc@3.1.0 --package=typescript@5.9.3 dlx vue-tsc --noEmit` reports these errors in unchanged files; no WeeklyDigest diagnostic:

- `components/HomeComments.vue(3,24) TS7016`: no declaration for `@waline/client/component`.
- `components/HomeComments.vue(14,7) TS6133`: unused `props`.
- `components/PostLanguageSwitch.vue(25,9) TS2345`: inferred `rel: string` is incompatible with `UseHeadInput` link type.

Local Node is 26.3.1; the project/CI requests Node 24. No JavaScript lint script/config is currently configured.

## Functional changes

The homepage adds one weekly link. Weekly rows now expand to expose sources and full summaries; their default state shows only product and short change. Animation stops for reduced motion, focus, category/issue changes or a hidden tab. Source dates display in Hong Kong time. Previous blog routes/components are not replaced.

## Minimal bilingual revision

After user approval of the screenshot, removed top navigation, row expansion, filters, history selector, replay control and footer copy. Only the title, date and compact list remain, plus a small language toggle. Product names retain source links. English and Chinese changes are validated in the generator; homepage passes its selected language in the URL.

Verified `pnpm typecheck`, 7 Python tests, mypy, Ruff and build. Native Chrome verified English/Chinese switching, updated document language/title, and the English desktop layout. Full Vue check still reports exactly the three existing diagnostics above. Mobile visual QA remains outstanding.

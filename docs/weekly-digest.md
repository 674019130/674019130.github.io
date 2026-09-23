# AI / Agents weekly

## Behaviour

- `/weekly/` is a static, source-linked archive; homepage navigation adds AI weekly.
- Existing writing, comments, themes and background remain unchanged. The weekly page shares the letter homepage’s 538px reading column, typography and light/dark palette.
- Seed issue 2026-09-14 is the reviewed pilot, clearly labelled. No fabricated historical issues.
- The compact three-column list retains the reference’s symbol/product/change structure, semantic colors, sequential typing and following cursor within the homepage palette. Only the heading, period and rows are rendered. Product names link directly to the original source. A small language toggle in the header switches between Chinese and English; homepage entry follows its selected language. Reduced motion, keyboard focus and hidden-tab handling stop the animation.
- Query-string language (`lang=zh|en`) and issue selection retain source links; no API key reaches the browser.

## Automation

`weekly-digest.yml` collects every six hours at minute 17 UTC; Monday 01:43 UTC (09:43 Hong Kong) also generates the prior complete Hong Kong week. Schedules may be delayed by GitHub.

Durable source snapshots, run evidence and issues live in the `weekly-data` branch. Pipeline code always comes from the triggering code branch. Source URLs and dates are code-owned; MiMo selects IDs and writes bounded product names, Chinese and English one-line changes and detailed summaries. Both languages are mandatory before an issue can publish. Generation never replaces an existing issue. Malformed output, missing key, insufficient evidence or failed HN backfill preserves the prior issue and fails the workflow.

GitHub Releases use the runner token only for api.github.com; source requests cannot receive MiMo credentials. HN RSS is provided by the third-party hnrss.org service. Historical Show HN results use Algolia, partitioned daily and paginated, without a popularity cutoff. RSS gaps/errors are retained and reflected in coverage notes. Non-HN sources without historical endpoints can still have gaps; this is not a complete news index.

The only MiMo call in the scheduled pipeline is summarization (Flash, maximum 3000 output tokens, at most 28 bounded source excerpts). MiMo web search is enabled on the account but remains supplemental and is not automatically called: its pilot recall was poor. No retries of paid model calls. One generation per week plus explicit manual retries. Source collection is independent of model spending.

Generated issues explicitly dispatch the existing Pages workflow because GITHUB_TOKEN pushes do not trigger ordinary push workflows. Pages restores the latest issue archive from weekly-data before building. No public messages, automatic subscriptions or paid search calls are made.

## Commands

- `pnpm weekly:collect`
- `MIMO_API_KEY=... pnpm weekly:generate` (provide through an environment secret, never shell history)
- `pnpm test:weekly`
- `uv run --with mypy mypy --ignore-missing-imports scripts/weekly.py`
- `uv run --with ruff ruff check scripts/weekly.py tests/test_weekly.py --select F`

Use `WEEKLY_ROOT` for an isolated trial directory. `GH_TOKEN` is optional locally and avoids anonymous GitHub API rate limits. Required GitHub repository secret: MIMO_API_KEY. The workflow uses the repository owner's verified local Git identity for automated data commits.

## Publication boundaries

Community timestamps mean the date of the post, not the product release. A current README may describe capabilities added after that post: discovery summaries are descriptions checked at collection time, not historical release claims. Automated summaries are not independent product tests. There is no exhaustive coverage guarantee or billing-derived cost claim.

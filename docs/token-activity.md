# Token Activity Update Runbook

## Architecture

The site is deployed as static files on GitHub Pages. `HomeActivity.vue` reads `data/token-activity.json`; the browser never connects to Tokdash and GitHub-hosted runners do not have access to the local Tokdash API.

The supported flow is therefore:

1. Read Tokdash from a machine where its local API is available.
2. Convert the private daily totals into a public, privacy-limited snapshot.
3. Review and commit that snapshot.
4. Let the normal GitHub Pages workflow build and deploy it.

This is a build-time snapshot, not real-time synchronization.

## Refresh Procedure

Tokdash defaults to `http://127.0.0.1:55423`. Start Tokdash first, then run:

```bash
pnpm activity:tokdash
git diff -- data/token-activity.json
pnpm test
```

For another local address:

```bash
TOKDASH_URL=http://127.0.0.1:55424 pnpm activity:tokdash
```

Before committing, verify:

- the command prints `Synced tokdash activity to ...` rather than `Activity sync skipped`
- `generatedAt` reflects the current refresh
- `period` covers the intended rolling six-month UTC window
- `summary` contains only `totalTokens`, `activeDays`, and `averageTokensPerActiveDay`
- every `days` entry contains only `date` and `level`
- `pnpm test` passes

Commit `data/token-activity.json` with the release or as a focused data-refresh commit. The GitHub Pages workflow will use that committed snapshot; it must not attempt to contact Tokdash.

## Transformation And Privacy

`scripts/sync-activity.mjs` requests `/api/stats?year=YYYY` for each year touched by the rolling six-month range, deduplicates records by date, sorts them, and computes the public summary. Exact daily token totals exist only during this local transformation.

The committed heatmap uses fixed levels:

| Level | Daily tokens |
| --- | --- |
| 0 | no activity |
| 1 | below 100M |
| 2 | 100M or more |
| 3 | 300M or more |
| 4 | 500M or more |
| 5 | 1B or more |

Do not add exact daily token counts, costs, models, providers, session identifiers, prompts, or source details to the public JSON. The aggregate six-month total and aggregate active-day statistics are intentionally allowed.

The homepage heatmap ends at the final synchronized Tokdash day. It does not render speculative empty cells for dates after the local snapshot.

## Failure Behavior

If Tokdash is unavailable and `data/token-activity.json` already exists, the script logs a warning and keeps the previous snapshot so an unrelated site build can continue. This means the process exit code alone cannot prove that a refresh succeeded. Always check the log message, file diff, and `generatedAt`.

If no previous snapshot exists, synchronization fails instead of creating misleading empty data.

## Automation Boundary

The current refresh is intentionally local and manual. A future scheduled refresh may run only on a trusted host that already has Tokdash data, must generate the same privacy-limited JSON, and must deliver it through the normal Git workflow. Do not expose the Tokdash API publicly, embed credentials in the site, or add a browser-side fetch merely to make the chart appear real-time.

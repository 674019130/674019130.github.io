# Su's Blog

Personal engineering notes about search systems, AI agents, data-intensive software, and day-to-day practice. The site is built with [Valaxy](https://valaxy.site/) and deployed as a static site at [674019130.github.io](https://674019130.github.io/).

The homepage defaults to English and provides an in-page English/Chinese switch. Article content remains in its authored language, with direct links between bilingual variants when available.

## Local Development

Node.js 24 and pnpm are required.

```bash
pnpm install
pnpm dev
```

Valaxy prints the active local URL when the server starts. Before publishing changes, run:

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

The current Valaxy dependency graph has known type-resolution errors for generated aliases and `@vueuse/integrations`; production builds remain the authoritative framework check until those upstream errors are resolved.

## Activity Data

The browser never calls GitHub or a local Tokdash server. The homepage reads committed or build-generated JSON snapshots from `data/` so it remains compatible with GitHub Pages.

| Data | Refresh command | Automation |
| --- | --- | --- |
| GitHub contribution calendar | `pnpm activity:github` | On pushes to `main` and daily at 01:23 UTC |
| Featured GitHub projects | `pnpm projects:github` | On pushes to `main` and daily at 01:23 UTC |
| Tokdash activity | `pnpm activity:tokdash` | Local only; commit the refreshed snapshot before deployment |

GitHub activity is fetched through the GraphQL contribution calendar. Actions uses `PROFILE_GITHUB_TOKEN` when configured and otherwise falls back to the workflow `GITHUB_TOKEN`. This is scheduled snapshotting, not a real-time browser request.

Tokdash cannot be refreshed by GitHub-hosted runners because its API is local. Its public snapshot contains six-month aggregate totals and daily threshold levels only; it excludes exact daily token counts, costs, model names, providers, and session details. Heatmap levels are `<100M`, `100M+`, `300M+`, `500M+`, and `1B+`, and the grid stops at the last locally synchronized record.

## Bilingual Posts

Bilingual variants use the same `translationKey` in front matter and render `PostLanguageSwitch` near the beginning of each article. Internal article URLs must omit the trailing slash because GitHub Pages serves Valaxy's generated `posts/<slug>.html` files from extensionless paths.

```yaml
lang: en
translationKey: example-topic
```

```vue
<PostLanguageSwitch
  current="en"
  english-path="/posts/example-topic-en"
  chinese-path="/posts/example-topic-zh"
/>
```

## Project Structure

- `pages/posts/`: Markdown articles and front matter
- `components/PortfolioHome.vue`: bilingual portfolio homepage
- `components/HomeActivity.vue`: GitHub and Tokdash activity presentation
- `components/PostLanguageSwitch.vue`: direct bilingual article navigation and metadata
- `layouts/home.vue`: homepage layout override
- `scripts/`: static activity and project snapshot generators
- `data/`: public JSON snapshots consumed by the homepage
- `tests/`: snapshot schema and privacy-boundary tests
- `archive/`: retired implementations retained with removal reasons
- `.github/workflows/gh-pages.yml`: scheduled GitHub Pages build and deployment

Detailed design and maintenance conventions are recorded in `CLAUDE.md`.

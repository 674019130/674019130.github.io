# Components

Components are auto-registered on demand through `unplugin-vue-components`.

- `PortfolioHome.vue`: restrained bilingual homepage, profile details, writing, experience, working set, and projects
- `HomeActivity.vue`: six-month Tokdash and GitHub snapshot visualizations; it reads committed JSON only and must never call GitHub or a local Tokdash service from the browser
- `HomeComments.vue`: lazy homepage Waline instance sharing the site's existing comment service at path `/`
- `PostLanguageSwitch.vue`: visible language navigation plus `lang` and `hreflang` metadata for bilingual posts

Iconify classes used by these components must also be added to the `safelist` in `valaxy.config.ts` so production builds retain them.

Token Activity maintenance belongs to `scripts/sync-activity.mjs`, not the component. The component may render aggregate summary fields and daily threshold levels from `data/token-activity.json`; exact daily token totals and private Tokdash dimensions must remain outside the public snapshot. The update runbook lives in [`../docs/token-activity.md`](../docs/token-activity.md).

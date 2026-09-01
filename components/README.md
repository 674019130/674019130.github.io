# Components

Components are auto-registered on demand through `unplugin-vue-components`.

- `PortfolioHome.vue`: restrained bilingual homepage, profile details, writing, experience, working set, and projects
- `HomeActivity.vue`: six-month Tokdash and GitHub snapshot visualizations
- `PostLanguageSwitch.vue`: visible language navigation plus `lang` and `hreflang` metadata for bilingual posts

Iconify classes used by these components must also be added to the `safelist` in `valaxy.config.ts` so production builds retain them.

# Styles

Project-level Valaxy overrides live here:

- `index.scss`: structural overrides and homepage-aware theme integration
- `css-vars.scss`: shared Valaxy CSS variables

The homepage search override in `index.scss` deliberately keeps the existing Valaxy/Fuse behavior while replacing Yun's transparent blurred popup. Its fixed layer must cover the full viewport, use a solid homepage surface, align the input and results to the 636px content grid, hide results for an empty query, and omit internal score labels. `PortfolioHome.vue` keeps the header reveal free of a retained transform so the fixed search layer is not constrained to the header's containing block.

Keep these selectors scoped through `body:has(.portfolio-home)` unless the article-page design is intentionally updated at the same time. Verify light, dark, desktop, and mobile states after changing the search layer.

Valaxy custom-style documentation: <https://valaxy.site/guide/custom/styles>.

# Cloud background and framework release

Home, about and archives now use the approved cloud video without query parameters. Archive overlay is lighter. Existing theme layouts, article pages, search, comments and classic homepage remain in place. The preview UI is archived with its removal reason. The production pause button sits at the left edge so it does not overlap the theme's back-to-top button.

- Framework/theme: Valaxy and Yun 0.28.11 → 1.0.0-rc.12 (npm latest on 2026-09-20; release candidate).
- Vue runtime: 3.5.13 → 3.5.41, matching the framework peer range.
- Node 24.21.0 production SSG build passed. CI stays on Node 24.
- `pnpm test`: 12 passed, including reduced motion without video download, manual pause, background-tab suspension and listener cleanup.
- `pnpm run typecheck`: passed after enabling bundler module resolution, DOM.Iterable, framework virtual-module declarations and the Waline declaration path. This runs TypeScript, not full Vue template type checking.
- Tip blocks now explicitly use the Chinese label 提示; the unsupported `langs` option was replaced.
- `git diff --check`: passed.
- ESLint command attempted for the changed Vue files, but the existing project has no eslint.config file. No lint success is claimed.
- Safari production-build checks: narrow and wide homepage, light/dark, pause control, search DDIA → 10 results → article, and comment form open/close without submitting. Archive list renders in the wide layout. Static HTML includes clouds only on home/about/archive, not the sampled article.
- Preview-stage about and archive checks are archived. Physical phone and OS reduced-motion interaction were not exercised; reduced-motion behavior has automated coverage.
- Remaining upstream peer warnings concern devtools, the old i18n tooling TypeScript range, and LightGallery's `latest` peer declaration. Build and exercised runtime paths passed.

Media source: https://www.allysen.net/images/background.mp4 . Original attribution retained in the site log. No explicit reuse license was found; attribution is not a license grant. The poster was compressed from the source preview image to 37 KB. Video is about 1.4 MB, self-hosted.

Official migration reference: https://valaxy.site/migration/version

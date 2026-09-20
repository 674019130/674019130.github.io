# Cloud background local preview

Scope: query-enabled home, about, and archives only. Theme layouts are reused. Default routes and article pages use the original theme. About uses a 72% white veil, archives 84%; panels remain translucent. Preview entry animations are suppressed so text and archive rows are immediately readable. No deployment or commit.

Verification: all five changed/new Vue SFC scripts, templates and styles compiled with @vue/compiler-sfc. npm test: 9 passed. git diff --check passed. Safari visual inspection covered about and archive content and the preview page navigation. A standard article loaded with its original theme. Phone hardware, full desktop width and reduced-motion switching were not exercised in this pass.

Type check: `./node_modules/.bin/tsc --noEmit` remains blocked by the existing Valaxy virtual-module/module-resolution errors (TS2307), implicit item any (TS7006), and NodeList iterator library error (TS2488). Full exact diagnostics: cloud-pages-typecheck.txt. This command does not type-check Vue templates; SFC compilation above is not a replacement for vue-tsc.

Lint: `./node_modules/.bin/eslint components/CloudBackgroundPreview.vue layouts/home.vue layouts/default.vue layouts/post.vue layouts/archives.vue` cannot run because eslint.config.(js|mjs|cjs) is missing. Full diagnostics: cloud-pages-lint.txt.

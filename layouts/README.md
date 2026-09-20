# Layouts

`home.vue` renders `LetterHome` at `/`, with a narrow, bilingual introduction and inline writing, project and contact links. The homepage is wrapped in `CloudBackground`. `default.vue` and `post.vue` reuse the upstream theme layouts and enable the background only for `/about/`; `archives.vue` wraps the upstream archive layout with a lighter cloud treatment. Other article routes remain on the upstream theme.

`classic.vue` renders the original `PortfolioHome` at `/home-classic`. This retains activity, experience, projects, writing and homepage comments. The default home links to it in its footer; its name link returns to `/`.

Restore the previous default by replacing `LetterHome` with `PortfolioHome` in `home.vue`. Frozen pre-change sources and the reason for preservation are listed in `archive/README.md`.

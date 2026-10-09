# Blog locale and answer motion regression check — 2026-10-09

## Changes and impact

Custom home, classic home, weekly digest and UI lab now share Valaxy's persisted language instead of maintaining independent state. Explicit language deep links take precedence on entry; both `zh` and `zh-CN` resolve to canonical theme locale `zh-CN`. SSR retains each page's original fallback until hydration completes. Changing a translated article version also updates the theme preference.

Copy-email feedback stores semantic state and derives its text reactively. Lab links and hover previews carry the selected language. Bilingual static experiments share the same preference and restore it after back-forward cache navigation; previews cannot overwrite the parent preference. Existing article text, reader comments, proper names and older single-language demos are not automatically translated. No dependencies added.

Answer-length's pointer focus no longer draws a purple outer ring. Keyboard focus remains visible on the small handle. Pointer updates are coalesced per animation frame, word geometry is read in a batch, stationary words skip animation, and per-word blur is removed. A small threshold dead band reduces boundary oscillation. Four levels, keyboard controls, cancellation and reduced-motion behavior are retained. No numerical FPS claim was measured.

## Validation

- `npm run typecheck`: passed.
- `npm test`: 35 passed. Includes locale aliases, 20 alternating selections, persistence, history state, disabled storage, storage events, back-forward cache and preview isolation. SSR preview-link tests cover both languages and all nine experiments.
- `npm run build`: production SSG passed.
- Safari local UI: Chinese → English → Chinese → English → Chinese with comments expanded. Body, search, theme control, comment labels, placeholder, submit/login/preview/sorting/reply controls followed every change. An unsubmitted test draft survived all switches.
- Copy email in English, switch to Chinese while feedback is visible: displayed `邮箱已复制`.
- Navigate from Chinese home to UI lab: list and experiment links remained Chinese. Toggle English: list and links changed together.
- Weekly deep link `?lang=zh`: Chinese title and six entries; English then Chinese switched title, entries and source labels together. Final URL used `zh-CN`.
- Answer demo deep link `?lang=zh-CN`: rendered Chinese. Native drag shortened detail from 3 to 1; screenshot confirmed no purple ellipse. Switching English preserved level 1 and localized content, controls, accessibility labels and four implementation notes.

## Compatibility notes

Language choice now persists between pages and reloads. This deliberately replaces per-page language resets. Switching languages does not remount comment widgets or reset demo state. The build emits routine RSS and route-map changes; those generated files are not included in this fix.

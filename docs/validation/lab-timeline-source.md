# Streaming timeline source

Adapted from the owner's `codex-skills/work/scmp/timeline-diff-motion` standalone sample. The original `script.js` is retained byte-for-byte, including sample data, event order, reset cancellation, removal disclosure, playback speed and reduced-motion behavior. CSS is preserved with a small breadcrumb addition. HTML adds a return link, blog title and no-JavaScript message.

The sample is served as an independent static page at `/lab/timeline/`, avoiding global CSS or DOM selectors leaking into Vue pages. `/lab` changes from an empty state to the first experiment entry. About and the log reflect its availability. No dependencies or APIs are added.

Source revision: `f8884a02dae1575b988c8e8b0cf8819753d5e319`.

Validation: `node --check public/lab/timeline/script.js`, `npm test` (3/3), `npm run build`, and `git diff --check` passed. SSG output includes the lab entry and all three standalone assets. Vue typecheck uses the exact command documented in `home-motion-types-2026-09-14.txt` and still reports the same existing diagnostics, none in the modified lab layout.

Safari visual QA: initial preview, animated playback, completed state, inserted middle group, collapsed two-removal cluster and expanded removal contents verified. Screenshot shows the running changed/removed state without overlap. Further reset/mobile interaction checks were interrupted by user browser activity; original script is unchanged, but those checks are not claimed as completed.

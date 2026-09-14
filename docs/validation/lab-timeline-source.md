# Streaming timeline source

Adapted from the owner's `codex-skills/work/scmp/timeline-diff-motion` standalone sample. The original event engine is retained, including reset cancellation, removal disclosure, playback speed and reduced-motion behavior. The extended version replaces all sample records with a fictional shared-garden project, adds 24 events at the original playback cadence, and reports playback progress. The page uses a single quiet column with compact controls and semantic diff colours. HTML includes a return link and a no-JavaScript message.

The sample is served as an independent static page at `/lab/timeline/`, avoiding global CSS or DOM selectors leaking into Vue pages. `/lab` changes from an empty state to the first experiment entry. About and the log reflect its availability. No dependencies or APIs are added.

Source revision: `f8884a02dae1575b988c8e8b0cf8819753d5e319`.

Validation: `node --check public/lab/timeline/script.js`, `npm test` (3/3), `npm run build`, and `git diff --check` passed. SSG output includes the lab entry and all three standalone assets. Vue typecheck uses the exact command documented in `home-motion-types-2026-09-14.txt` and still reports the same existing diagnostics, none in the modified lab layout.

Safari visual QA: initial preview, animated playback, completed state, inserted middle group, collapsed two-removal cluster and expanded removal contents verified. Screenshot shows the running changed/removed state without overlap. Further reset/mobile interaction checks were interrupted by user browser activity; original script is unchanged, but those checks are not claimed as completed.

Follow-up requested by the owner: longer playback, entirely fabricated data and a cleaner page. The previous source-revision note describes the source engine, not byte-identical current assets.

Extended sample checks: all 24 event references and both inserted-group positions validated against the fixture; JavaScript syntax, three repository tests, SSG build and diff check passed. Typecheck has the same pre-existing diagnostics. Safari loaded the updated page with the fictional-data label, compact playback controls and all 12 initial entries; further playback/screenshot capture was interrupted by user interaction, so the earlier animation QA applies to the preserved engine, not a completed visual replay of all 24 new events.

Playback refinement: removed the additional 700 ms pause between events at the owner's request. The original per-event durations and speed multipliers are retained; all 24 fictional events and the approved clean presentation are unchanged. Normal playback is approximately 9 seconds.

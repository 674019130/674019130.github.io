# Lab hover preview

Reference inspected on 2026-09-14: https://sanyam.sh/lab and its public `components/lab/lab-index.tsx` / `lab-preview.tsx` source in https://github.com/SanyamPunia/www. The reference uses compact rows and pointer-following recorded clips, a short dwell, edge flipping, pointer-events none, and still images for reduced motion.

This implementation independently uses Vue and the existing local timeline engine, with no new dependency or copied reference code. The old static bars and oversized entry are replaced with a compact title/date link. A teleported, non-interactive iframe mounts after 70 ms of mouse/pen hover or keyboard focus. It follows the pointer, flips near viewport edges and unmounts on leave, scroll, resize, blur, click or Escape. Touch navigates directly. Reduced motion uses the initial static timeline. Theme is passed into preview-only styles; the full demonstration retains its approved styling and cadence.

`?preview=1` reuses the same synthetic data, row rendering and diff queue, with a short initial pause and a loop after completion. Closing the preview removes the iframe browsing context and its timers. No iframe is fetched before preview activation.

Validation: JavaScript syntax check, 3 repository tests, SSG build and diff check passed. Vue typecheck has the same documented pre-existing errors and no diagnostics in LabTimelinePreview or the lab layout. Built HTML includes the compact title/date link and preview script/styles. Native browser QA could not run this turn: both Safari and Chrome returned `cgWindowNotFound`, and the browser-provider inventory was empty. Hover visuals and actual positioning are therefore not claimed as visually verified.

A mocked controller check also passed: touch does not open a preview; hover waits before opening; edge placement stays in the viewport; leaving cancels a pending open; reduced motion requests a still; Escape dismisses and suppresses reopening until leave; unmount cleans up. These are state checks, not browser-rendering evidence.

# Timeline: newly arrived group corrects its own position

## Behavior

A second scenario is available at `/lab/timeline/?scenario=regroup&lang=zh`. The existing 24-event edit scenario remains the default. The new scenario starts with three compact groups. A fourth group arrives at the end without its date; after 1.1 seconds, simulated date metadata arrives. The same handler validates its ISO date, stably sorts the groups oldest first, moves the existing DOM nodes, and starts a 640 ms FLIP animation. No extra delay separates detection and correction. Another item then arrives in the same group.

Ordering is derived from dates, not hard-coded destination indices. Equal dates retain order; undated groups stay at the end; invalid dates are ignored. Reordering uses the same nodes and transform-only motion, with a small horizontal arc to distinguish the moving group from neighbours. Geometry reads are batched before animation writes.

The page now has complete English/Chinese controls, fixture text, statuses and three implementation notes, integrated with the shared blog locale. Language changes retain the current scenario, playback progress and expanded removal clusters. Reset/scenario changes invalidate pending playback and cancel animations. No dependency or backend change.

## Verification

- `npm run typecheck`, `npm test` (40 tests) and `npm run build` passed.
- Sorting tests cover a late group moving from the end to the middle, movement in both directions, both endpoints, stable ties, unknown dates, impossible dates, object identity and preservation of the original input order.
- Translation coverage verifies all original fixture summaries/headlines/date labels and all 24 events.
- Safari: initial, appended/awaiting-date, in-motion and completed frames inspected. Local-only `motion=5` slows playback for dense screenshots; production ignores that parameter. Moving group remained readable; final order was Jan–Mar 2025, Apr–Jun 2025, Jul–Sep 2025, Jan–Mar 2026. Follow-up content appeared inside the relocated group.
- Safari 390 px iframe: controls, group labels, dates and notes fit without horizontal page overflow. A reset during the pending-date phase restored three initial groups and prevented the old stream from continuing.
- Original 24-event scenario completed with both removal clusters intact. Expanding the first cluster and switching to English retained its expanded content. The second cluster remained collapsed.
- Completed regroup state switched to English without resetting order or removing received items.
- Reduced-motion CSS and WAAPI guards reviewed: zero playback delay and no layout tween. OS-level preference switching was not performed.

## Scope and compatibility

Only the standalone timeline experiment and its tests/docs changed. Other labs, blog locale plumbing and article content are unaffected. The original scenario retains its fixture and event cadence; layout animation duration now follows its speed control. The new language option is additive. The local review page is in docs, outside published static assets.

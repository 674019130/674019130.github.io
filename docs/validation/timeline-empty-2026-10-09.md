# Timeline: from zero and segmented scenarios

The `empty` scenario starts with no groups. Replay streams three group headers and six item events separately, retaining the existing token cancellation, speed multiplier and reduced-motion handling. Reset returns to an empty state. The original edit and reordering scenarios retain their data and cadence, and edits remains the default. Deep link: `/lab/timeline/?scenario=empty&lang=zh`.

Scenario selection now uses a native radio group, with three compact, equal-width segments. The active segment has a white surface on a muted track; keyboard focus is visible. Native arrow-key selection changes the scenario and invalidates pending playback. Mobile uses the available width; descriptive text sits below the control instead of inside long labels. English and Chinese labels, empty/progress/completion states and implementation notes are included.

Validation:
- `npm run typecheck`, `npm test` (41 passed), `npm run build`, and `git diff --check` passed.
- Unit coverage verifies that empty group headers precede their items, replay is repeatable, and generating a stream does not mutate the original fixture.
- Safari at 390 px: selected states, initial empty state, successive group/item arrivals, and completion with 3 groups / 6 items inspected. No control or content overflow.
- While playing, switching to Auto-order restored its three initial groups. Right arrow selected From zero and returned to the empty preview; old messages did not leak into the new scenario.
- English standalone layout and deep link inspected. Local-only slow motion showed one group receiving its first and second items before the following group arrived.
- Existing shared language and reduced-motion paths retained; no dependencies added. No numeric FPS claim or new OS-level reduced-motion test.

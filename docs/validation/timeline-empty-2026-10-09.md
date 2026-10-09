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

## Corrected scope: from zero must also reorder

The user clarified that From zero must include correction in the same playback. It now streams the initial three dated groups, appends the undated spring group at the end, receives its date and moves that same group between January and July, then adds another spring item. Final state: 4 groups, 8 items. No pre-existing groups are required. The other two scenarios and segmented selector are unchanged.

A regression test evaluates the actual scenario setup from the production script, starts with an empty group collection, verifies the wrong append order immediately before the date event, applies the production sorting function, and checks the corrected order, preserved group identity and later item. All 42 tests, typecheck and SSG build passed.

Safari slow-motion QA followed the same playback from an empty preview through streamed groups, correction/movement and completion. English-to-Chinese switching preserved the completed order and all 8 items; reset restored the empty state. The bilingual scenario hint, completion text and implementation notes now explicitly describe the combined flow.

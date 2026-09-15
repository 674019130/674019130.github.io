# Kaifan UI lab experiments — 2026-09-15

Source: the owner's `lunch-wheel` checkout, commit `7f7ceea866fe8f86bab20344f7c9fdbd4c9b39b5`, specifically the active `src/renderer/components/Mascot.tsx`, `ReceiptDialog.tsx` and `src/renderer/appica.css`. No Kaifan application files or user data were changed.

- `/lab/receipt/`: extracted the clipped paper translation, 44-step feed and printer shell. A compact fictional lunch receipt replaces real orders and history. Print, completion, replay and interrupting reset are supported. Reduced motion completes immediately. Printed paper can scroll in a narrow viewport.
- `/lab/mascot/`: retains the original SVG, five moods, five temporary reactions, original keyframes and light/dark character palettes. Adds explicit mood/reaction controls and a stoppable demonstration sequence. Manual selection cancels pending sequence/reaction updates.
- Shared static CSS/setup keeps the standalone pages lightweight; no React, Electron or UI dependency was added. Preview mode hides controls and plays the real demo. `still=1`/reduced motion yields a static preview. Removing the hover iframe disposes its document and timers.
- `LabExperimentPreview` replaces the single-purpose timeline row. The original source is archived with a reason. Timeline remains first; receipt and mascot follow it. Escape dismisses only active/pending previews, leaving other rows usable.

## Regression found and fixed

Safari showed a blank `/lab` after hydration while the SSG HTML contained the rows. The original component always mounted a Teleport into `body`, even with no visible preview. The shared component now conditionally mounts the Teleport only after preview activation. Reloading the same page in Safari then rendered all three links normally. The SSR regression test verifies no body teleport output or iframe on initial render for any of the three slugs. This follows Vue's SSR guidance to conditionally render teleports on client mount: https://vuejs.org/guide/scaling-up/ssr.html#teleports.

## Validation

- `npm test`: seven checks pass, including SSR body-teleport regression, print/reset cancellation, reduced-motion printing and sequence cancellation by manual mood selection.
- JavaScript syntax checks passed for the new page controllers; SSG build succeeded. Vue typecheck uses the command in `home-motion-types-2026-09-14.txt`; the same pre-existing errors remain, with no diagnostics in the shared preview or lab layout.
- Safari: receipt initial/printing/printed/reset states and final paper layout visually checked; mascot mood selection, wink feedback, sequence completion and reset checked. Lab reload and all three links checked after the hydration fix. Both new hover previews visually checked; entering them is simulated by moving the pointer with the available native drag action, not by executing browser JavaScript.

Additional visual check: resized Safari to its narrow window size (about 640 px in the returned screenshot); list rows and printed receipt remained readable without overlap. This is a narrow desktop-window check, not a physical phone test.

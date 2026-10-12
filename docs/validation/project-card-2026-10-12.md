# Project card — hover-to-open project summary

Reference: https://x.com/flohoeller/status/2109230261858656727 (Flo, “Project card component”). Inspected the 17.3-second public video at 1–2 fps plus native-resolution crops of collapsed, expanded, row-hover, status-picker, avatar-focus and dark states. Independent implementation; no original source code or media redistributed. Sample project and people are labelled as a local interaction study.

## Implementation and scope

- New static experiment `public/lab/project-card/` (edition 10), lab list entry in `layouts/lab.vue`, preview SSR test slug, and `tests/project-card.test.mjs`.
- Collapsed card shows the segmented progress ring, title, status pill, due date and avatar stack. Mouse hover, visible keyboard focus, the status picker, or a pinned state open it; the task list and footer use `grid-template-rows: 0fr → 1fr`, so they are interruptible without measuring.
- Five-segment ring uses `pathLength="100"` circles and transitions `stroke-dasharray`; the centre count, footer line and status pill use a two-layer clipped swap that leaves from the visible pose. The pill animates its measured width.
- Row hover/focus reveals the assignee and footer “Assigned to / Done by”; avatar hover previews and click locks a person filter (“Mara · 2 of 2 done”). Status picker with arrow keys, outside click and Escape. Escape order: picker → filter → pinned.
- Touch never depends on hover: tap the title to pin, tap a face to lock, tapped rows highlight briefly. Collapsed regions are `inert`.
- Bilingual copy, controls, announcements and four implementation notes with real snippets; language switch and Light/Dark preserve all state. Reduced motion and `still=1` drop travel; localhost-only `?motion=N` slows the same motion.
- Existing experiments and homepage behaviour unchanged. No new dependency.

## Verification

- Chrome: hover open; row hover → “Assigned to Priya”; check → ring 3→4 and “Done by Priya”; avatar hover dims others → “Priya · 1 of 1 done”; picker → Done; switch to Chinese and dark with checks, status and pinned state preserved.
- Slow motion (`?motion=12`): mid-open frame shows rows clipped by the growing track; counter sampled mid-roll (old “4” leaving upward at 0.24 opacity, new “5” entering).
- Keyboard: Tab opens the card at the title; Enter opens picker focused on the current status; Right moves; Escape returns focus to the pill and closes the picker without collapsing; Space on a task toggles it with announcement.
- Layout: 320 px (due date wraps under the pill), 375 px dark Chinese, and 600 × 400 preview; no horizontal overflow. Found and fixed: pill shrinking/clipping at 320 px, footer whitespace trimmed by inline-flex, ring counter positioning.
- Real touch hardware was not tested; touch paths share Pointer Events.

Final results: `npm run typecheck` passed; `npm test` passed 47/47; `npm run build` passed. Existing npm project-config warning unchanged.

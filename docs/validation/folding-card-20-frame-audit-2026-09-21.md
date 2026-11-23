# Folding card: 20-frame visual audit

Date: 2026-09-21. Inspection only; no implementation changes.
Reference: https://x.com/iamncdai/status/2101608687702053067
Method: native Chrome fullscreen video, paused and sought to 20 timeline positions. Timestamps below are player AX values; angles are read from the angle label rendered in the video. These are time-sampled frames, not 20 consecutive frames. Video includes manual dragging; timestamps do not establish a spring timing curve.

| Frame | Video time (s) | Visible angle (degrees) |
| --- | --- | --- |
| 1 | 0.043 | 0 |
| 2 | 0.487 | 70 |
| 3 | 0.943 | 180 |
| 4 | 1.394 | 180 |
| 5 | 1.850 | 29 |
| 6 | 2.301 | 0 |
| 7 | 2.757 | 0 |
| 8 | 3.208 | 30 |
| 9 | 3.664 | 70 |
| 10 | 4.115 | 112 |
| 11 | 4.571 | 130 |
| 12 | 5.022 | 151 |
| 13 | 5.478 | 168 |
| 14 | 5.929 | 177 |
| 15 | 6.385 | 180 |
| 16 | 6.836 | 180 |
| 17 | 7.292 | 167 |
| 18 | 7.744 | 72 |
| 19 | 8.199 | 38 |
| 20 | 8.651 | 11 |

## Observed differences from current local implementation
- At 29–38 degrees the reference cover is bright on its left, shaded toward its outer right edge; the exposed fixed panel is dark. Current 30-degree cover is dark on the left, brighter on the right. The same shading rule is incorrectly reused on both sides of 90 degrees.
- At 70–72 degrees reference cover logo/name remain visible. Current 71-degree cover is almost blank; its text opacity drops too early.
- At 130 degrees the reference inner message already has a visible blurred silhouette; current version is almost blank. At 168 degrees reference text/avatar remain visibly blurred, while current version is already substantially sharp. Blur and opacity need distinct progress curves rather than compensating for each other.
- Black perspective shell and horizontally bounded display are present in both. Their presence alone does not establish animation fidelity.

Current implementation was inspected with Holographic disabled at 30, 71, 130 and 168 degrees. Different display sizes prevent reliable pixel-level comparisons of blur radius or geometry. No exact physical-lighting or source-code claims are made from these observations.

# Light atmosphere: saved directions and review state

This file preserves the user's design choices across chat compaction. Read it before continuing atmosphere work.

## Baseline and feedback

- Accepted baseline: `d0ee45d`, pushed to `main`. Dark is the default; the animated theme control is rightmost in the header. The user likes the improved graph.
- The original light gas feels less substantial than dark mode and needs better depth across the whole background.
- Rejected experiment: `e588660` increased spatial frequency, introduced contour bands and stronger pigment. The user strongly disliked the resulting marbled/paint-like clouds. The gas was restored in `d0ee45d`; graph improvements were retained.
- First option-1 trial: `408a4b0`. User feedback: "i cant see the difference, not impressed". Treat it as too subtle, not accepted. Merely lightening the uniform lavender wash did not create visible depth.
- Keep purple, broad full-viewport coverage, the original flowing motion, and smooth boundaries. Do not confine the gas to a corner or repeat the contour-based treatment.
- Preserve the accepted graph, dark theme, typography, layout, and responsive behavior. Preserve the stable renderer/materials and instant theme switching; do not restore full-page view-transition snapshots.

## Three directions discussed with the user

1. **Daylight violet mist — currently selected for a trial.** Broad, translucent purple clouds illuminated by daylight. A faint atmospheric layer and softly overlapping violet depth, with clearer white spaces between clouds. Keep the current flow/scale/speed; first explore color and density mapping. Strongest purple remains in the name, graph, and controls. Avoid sharp boundaries, uniform lavender tint, and heavy pigment.
2. **Light through violet glass — saved alternative, not yet tried.** Diffuse violet reflections moving across white, as if light passes through softly curved glass. Complements glossy graph nodes. Risk: becoming a generic gradient background or introducing hard caustic lines.
3. **Atmosphere illuminated by the graph — saved alternative, not yet tried.** Full-screen haze becomes slightly richer near the active node and travelling packet. Connects atmosphere to the system journey. Risk: distracting blobs or excessive halos around nodes.

The user explicitly asked to remember all three options and may request trials of options 2 and 3 later. Do not treat option 1 as a permanent choice or discard the alternatives.

## Current authorization and workflow

- User: "lets try 1st one, we can try others too so remember these 3 options even if auto compact hits".
- Trial branch: `codex/daylight-violet-mist`, based on `main` at `d0ee45d`.
- Implement and preview option 1 locally for discussion. Keep the published baseline as the comparison; this trial is not yet authorized for a main merge/push.
- Compare the same viewport and atmosphere time where practical, then inspect motion, scroll, text readability, mobile fallback, and theme switching.
- Record implementation, verification, and review outcome below. Do not describe an unreviewed trial as user-approved.

## First trial (408a4b0): too subtle

Option 1 was implemented locally and rejected as insufficiently different. No main merge or push for this trial.

- Desktop: the same noise coordinates, spatial scale, pointer response, and animation speed. Light colors now combine a distant lilac layer with a nearer violet layer. A continuous squared density curve opens up the thinner regions, while a small daylight contribution brings them closer to white. No contour bands, new noise samples, masks, or postprocessing passes.
- Mobile: the same three cloud paths and soft radial falloff. The broad CSS base is lighter and the nearer canvas clouds are slightly richer, creating separation without adding cloud shapes.
- Graph, dark shader, camera, postprocessing, and theme-switching code are byte-for-byte unchanged from the accepted baseline (verified against `d0ee45d`).
- Production build and TypeScript pass. The existing Three.js chunk-size warning remains.
- Visually checked the fixed-time desktop comparison, moving hero and journey, and 390px mobile layout (no horizontal overflow). Comparison controls work in both directions. This is a design trial, not an accessibility audit; the graph's existing placement over some journey text is unchanged.
- Desktop switching probe: theme attributes updated in 1ms; longest observed frame gaps were 17ms and 22ms, with no frame over 50ms in either 1.2-second sample. These are local browser measurements, not a guarantee for all devices. Probe code is excluded from the final preview and source.

## Revised option 1: visible cloud depth

- Retains the original fluid coordinates, speed, pointer response, noise samples and dark shader. Changes only light color/density mapping.
- Uses the broad drift for a distant layer and the original fluid billows for a nearer layer. Exponential violet light absorption produces noticeably richer cloud cores and white openings. Cooler distant lilac separates from nearer violet.
- A 20% white contribution limits the darkest clouds; no sharp contour bands, added noise, spatial masks, new render passes, or renderer remounts.
- Mobile and CSS fallbacks use richer, softly feathered clouds on the existing paths.
- Production build/TypeScript and diff whitespace checks pass. Moving desktop and 390px mobile inspected; no mobile overflow. Theme switching checked interactively; the earlier measured timings belong to v1, not a new v2 performance benchmark.
- Revised preview awaits user review. Dark remains the production default. Main remains at `d0ee45d`; alternatives 2 and 3 remain available and untried.

### Repeatable comparison

Run `node scripts/preview-atmosphere.mjs` to build the accepted atmosphere at `d0ee45d` and the current trial at the same cloud time (24 seconds). It serves baseline on port 4174 and trial on 4175 using temporary output directories, leaving source files and the normal build untouched. Optional arguments select another baseline commit and cloud time. The review builds start light; production still starts dark. Only the desktop cloud time is frozen; graph, dust, and mobile motion remain live.

For the latest feedback comparison, run `node scripts/preview-atmosphere.mjs 408a4b0 24` to compare the too-subtle first trial against the revision. This is the currently running comparison. Saved screenshots are `daylight-mist-v1-t24.png`, `daylight-mist-v2-t24.png`, and `daylight-mist-v2-mobile.png` in the same artifact directory below. `daylight-mist-v2-review.html` preserves the latest comparison.

Moving trial: normal preview at `http://127.0.0.1:4173/` with output `/tmp/portfolio-light-build`.

Saved review artifacts: `/Users/siddharthkalyani/.codex/visualizations/2026/10/13/01a133af-6648-7fa3-b27b-7aa2b732b0d8/` contains `daylight-mist-baseline-t24.png`, `daylight-mist-trial-t24.png`, and `daylight-mist-review.html`. A temporary copy of the comparison page is served at `http://127.0.0.1:4173/atmosphere-review.html`; it is not part of the production site.

Next decision belongs to the user: keep/tune this trial, return to the accepted baseline, or try saved option 2 or 3. Preserve this option's branch when testing alternatives.

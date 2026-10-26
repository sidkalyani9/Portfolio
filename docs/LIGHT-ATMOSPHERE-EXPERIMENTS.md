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

1. **Daylight violet mist — preserved trial on `codex/daylight-violet-mist` (`314547c`).** Broad, translucent purple clouds illuminated by daylight. A faint atmospheric layer and softly overlapping violet depth, with clearer white spaces between clouds. Keep the current flow/scale/speed; first explore color and density mapping. Strongest purple remains in the name, graph, and controls. Avoid sharp boundaries, uniform lavender tint, and heavy pigment.
2. **Light through violet glass — tried and rejected on 2026-10-19.** Diffuse violet reflections moving across white, as if light passes through softly curved glass. Complements glossy graph nodes. Risk: becoming a generic gradient background or introducing hard caustic lines.
3. **Atmosphere illuminated by the graph — tried, then user returned to option 1.** Full-screen haze becomes slightly richer near the active node and travelling packet. Connects atmosphere to the system journey. Risk: distracting blobs or excessive halos around nodes.

The user explicitly asked to remember all three options and may request trials of options 2 and 3 later. Do not treat option 1 as a permanent choice or discard the alternatives.

## Current authorization and workflow

- Latest user instruction (2026-10-19): "go back to the latest option 1 we made".
- Active branch: `codex/daylight-violet-mist`. Application code is the latest option-1 revision at `314547c`, restored exactly. Later commits on this branch only update these notes.
- Option 2 is archived as rejected on `codex/violet-glass-light` at `592ecc9`. Option 3 is preserved on `codex/graph-lit-atmosphere` at `d6c4c92`; the user ended that trial and requested option 1.
- Accepted/published baseline remains `d0ee45d`. Dark is the default, with the theme control at the right end of the header. No main merge/push was requested for any of these trials.
- Keep only one local preview server, port 4173. The user explicitly requested surplus Node servers stopped.
- Current preview output: `/tmp/portfolio-light-build`, served at `http://127.0.0.1:4173/`.

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
- Revised option 1 is preserved for comparison. The user subsequently requested option 2, rejected it, and selected option 3. Main remains at `d0ee45d`.

### Historical option-1 comparison

Run `node scripts/preview-atmosphere.mjs` to build the accepted atmosphere at `d0ee45d` and the current trial at the same cloud time (24 seconds). It serves baseline on port 4174 and trial on 4175 using temporary output directories, leaving source files and the normal build untouched. Optional arguments select another baseline commit and cloud time. The review builds start light; production still starts dark. Only the desktop cloud time is frozen; graph, dust, and mobile motion remain live.

For the latest feedback comparison, run `node scripts/preview-atmosphere.mjs 408a4b0 24` to compare the too-subtle first trial against the revision. These comparison servers are stopped. Saved screenshots are `daylight-mist-v1-t24.png`, `daylight-mist-v2-t24.png`, and `daylight-mist-v2-mobile.png` in the same artifact directory below. `daylight-mist-v2-review.html` preserves the latest comparison.

Historical option-1 preview: normal preview at `http://127.0.0.1:4173/` with output `/tmp/portfolio-light-build`.

Saved review artifacts: `/Users/siddharthkalyani/.codex/visualizations/2026/10/13/01a133af-6648-7fa3-b27b-7aa2b732b0d8/` contains `daylight-mist-baseline-t24.png`, `daylight-mist-trial-t24.png`, and `daylight-mist-review.html`. A temporary copy of the comparison page is served at `http://127.0.0.1:4173/atmosphere-review.html`; it is not part of the production site.

These option-1 artifacts are historical. Preserve the branch and screenshots when testing alternatives.


## Option 2: violet glass — rejected

- Branch: `codex/violet-glass-light`. Preserved for history; do not carry its curved bands into option 3.
- User feedback on 2026-10-19: "option 2 looks shit, go to option 3". This supersedes the option-2 trial request.
- Desktop used two broad curved violet reflections with white openings. Mobile used smooth cached profiles. The original dark calculation, graph and theme controls were preserved.
- Build/TypeScript passed. Desktop and mobile rendering checked; initial mobile contour seams were fixed. Local switch samples updated the theme in 1–2ms, with maximum frame gaps of 34–42ms and no gaps above 50ms in 1.2-second samples. These are local measurements, not device guarantees.
- Option 1 stays on its separate branch. Main remains at `d0ee45d`. Option 3 is now authorized for a local trial, not a main merge/push.
- Keep only one local preview server, on port 4173. The user previously requested all surplus Node servers stopped.


## Option 3: atmosphere illuminated by the graph — archived trial

- Restores the original soft fluid texture and full-field haze from the accepted baseline, replacing all option-2 glass curves.
- The active node and packet expose references to their actual Three.js meshes. The atmosphere projects their world positions through the current camera and follows them with damped uniform updates. This includes graph rotation, node bobbing, case-study graphs and scroll movement without duplicating their positioning formulas.
- Two broad, flow-distorted light fields enrich the existing violet texture. They blend into each other and fade near off-screen graph positions. Lower ambient density leaves white openings. There are no new rings, contour bands, renderer remounts or postprocessing passes.
- Mobile keeps the original three distant clouds and adds one wide, feathered violet field at the blended active-node/packet position. Reduced-motion mode retains static rendering.
- Dark fluid calculations, camera, postprocessing, theme provider, header, shared CSS and CSS fallback were verified against `d0ee45d`. Graph changes only expose object references; materials, geometry and motion are unchanged.
- TypeScript/production build and diff whitespace check pass. Existing Three.js bundle-size warning remains. Desktop hero/journey, case-study graph, mobile at 390px, and both theme directions checked. No mobile horizontal overflow or browser errors observed. Reduced-motion path reviewed in code, not browser-emulated.
- Desktop theme samples: 0–1ms attribute update, maximum frame gap 34–39ms, no frames above 50ms in the 1.2-second samples. These are local observations, not device guarantees. Temporary probe is excluded from the source and final preview.
- Historical production output: `/tmp/portfolio-graph-lit-build`. Its preview server was replaced by option 1.
- Saved mobile screenshot: `graph-lit-option-3-mobile.png` in the artifact directory above. Desktop capture was not saved before the user ended the trial.
- User ended this trial on 2026-10-19 and requested the latest option 1. Preserve the branch for reference; do not merge/push it.


## Return to option 1 — 2026-10-19

- Restored the complete latest option-1 application from `314547c`, including its fuller violet clouds and clearer white openings.
- Retained the original dark default, rightmost theme toggle, graph and smooth switching.
- Options 2 and 3 remain archived on their own branches; all three directions and feedback are preserved here.

## Performance work — 2026-10-26

- `codex/animation-performance` optimizes the selected latest option 1 without changing its gas shader, palettes, particle counts or animation formulas.
- See [PERFORMANCE.md](PERFORMANCE.md) for changes, measured work reduction and regression checks. The three atmosphere options and prior feedback above remain the design record.
- Clean preview uses only port 4173, with output `/tmp/portfolio-perf-final`. No main merge or push is part of this performance task.

# Animation performance — 2026-10-26

Optimizes the selected **latest option 1 / daylight violet mist** at `c1cfd41` on
`codex/animation-performance`. Dark remains the default. This change does not
merge or push the design trials to main.

## What changed

- Continuous scroll data lives in a stable external store. Camera, gas, edge
  packet and mobile canvas read it in their existing animation loops. React
  subscribes to discrete values such as the active node and displayed percentage.
  Hero parallax and CSS atmosphere apply the same values directly to their DOM
  elements. This removes component-tree work from the continuous update path.
- Scroll smoothing stops scheduling work only when its exact numeric output stops
  changing; scroll and resize measurements wake it again. The original 0.08/0.12
  smoothing, lead clamp, end snap and full floating-point tail are preserved.
- Bloom remains mounted and compiled across theme switches. Its update skips
  offscreen passes only when its opacity is **exactly zero**, after one warm-up
  frame at initialization/resize so switching from a saved light preference does
  not defer shader or render-target initialization to the first dark toggle. Visible/fractional
  bloom uses the original implementation and ADD blending. No renderer or effect
  reconstruction was introduced.
- Mobile animation has one pending RAF owner. Hiding a tab cancels its pending
  callback before resuming; repeated visibility changes can no longer accumulate
  competing loops. The original elapsed-time clock is retained.
- Camera interpolation reuses its output vectors instead of allocating two
  temporary vectors per frame. Arithmetic and coordinates are unchanged.
- Telemetry stores the displayed formatted counter string, avoiding state changes
  when only hidden fractional digits change. Existing tween duration/ease remain.
- Hash restoration relies on the refresh already performed by `scrollToId`,
  removing two redundant refreshes per initial restore attempt. Retry/correction
  behavior is retained.

## Measured work reduction

Local production builds, one browser tab and one server, 982 × 950 viewport.
Four-second idle samples at the hero and four-second scrolls from 0 to 1200px.
Baseline source is `c1cfd41`; final candidate is this branch. Raw samples are in
[performance-measurements.json](performance-measurements.json).

| Work | Before | After |
| --- | ---: | ---: |
| Light hero WebGL draw calls per frame | 29 | 13 |
| Invisible light-mode bloom passes per frame after warm-up | 16 | 0 |
| Dark hero WebGL draw calls per frame | 29 | 29 |
| Light idle renders: each monitored provider/hero/pipeline/rail/scene/fallback | 444 in 4s | 0 |
| Light idle graph-node renders (10 nodes) | 4,440 in 4s | 0 |
| Light scroll hero renders | 308 | 1 |
| Light scroll graph-node renders (all nodes) | 3,080 | 10 |
| Light scroll pipeline renders | 308 | 2 |
| Light scroll scene/provider/fallback renders | 308 each | 0 |
| Temporary camera vectors per frame | 2 | 0 |

The 55% reduction in light hero draw calls is **not** a claim of 55% higher FPS:
draws have different costs. Counters measure the instrumented component function
invocations, not all React work or commits. RAF callback timing excludes work
scheduled outside those callbacks and is not total CPU time. Browser frame cadence
varied substantially during the session; use the work counts rather than these
samples to claim a reproducible improvement. No weak-laptop hardware benchmark or
universal FPS claim is made.

An earlier run showed a fixed ~30Hz cadence on the candidate versus ~120Hz on
the baseline. Restoring the original bloom or previous atmosphere subscriptions
did not change that result. After restarting the preview session, the complete
optimized implementation measured 481 frames in 4.003 seconds (~120Hz), with zero
monitored idle renders; hiding the preview also retained ~120Hz median cadence.
The earlier fixed 30Hz result did not reproduce in that session. Its cause is not
established, and the raw anomalous samples are retained rather than discarded.
This is another reason to report eliminated work, not an FPS speedup.

## Preservation and validation

- `npm run test:performance`: 11 Node tests plus the real bloom-pass recorder.
- Scroll tests execute both the actual archived provider and current provider:
  exact values across scrolling, resizing, home/case-study routes, end snap,
  boot gating, settling, waking and cleanup. They exercise RAF handle zero.
- 4,804 camera samples compare exact coordinates, with no transient vectors.
- 100 mobile visibility cycles, duplicate show events, initially hidden/static
  modes, elapsed-time resume and late cleanup callbacks.
- 2,020 atmosphere samples compare the exact CSS strings with the archived
  component. Gas vertex/fragment shader text, dust, graph constants, main CSS and
  motion constants are checked against the same baseline.
- Bloom checks compare draw order, sizes, shaders, defines, uniforms and resource
  identities through zero, full, fractional and near-zero opacity.
- TypeScript and production build pass. The existing large Three.js chunk warning
  remains; this work targets sustained animation cost, not bundle splitting.
- Browser checks: both themes, desktop journey navigation at 1280px, case study
  and return to Systems, mobile at 390px, return to top and no horizontal overflow.
  No browser errors/warnings were observed in the checked flows. Reduced-motion
  scheduling is covered in the runtime test, not browser emulation.

DPR, particle counts, geometry detail, shader noise, palettes, easing, durations,
camera paths and animation frame-rate settings are unchanged. The animated GPU
scene still costs work every visible frame, especially in dark mode where bloom
is visible. Further GPU changes need profiling on an affected laptop and visual
comparison; lowering quality is outside this change's constraints.

## Reproduce

Run from the repository with dependencies installed and the baseline commit
available in Git history (the regression tests intentionally compare that commit).

```sh
npm run test:performance
npm run build -- --outDir /tmp/portfolio-perf-final
node scripts/build-performance-probe.mjs c1cfd41 /tmp/portfolio-perf-baseline
node scripts/build-performance-probe.mjs working /tmp/portfolio-perf-candidate
```

Serve **one** output at a time; stop the previous process before switching:

```sh
node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173 --strictPort --outDir /tmp/portfolio-perf-candidate
```

Open `/?profile` for the local measurement controls. Let the intro finish, return
to the top, and measure in the same theme and viewport. Reload at the top before
idle measurements to avoid measuring a still-settling scroll tail. The probe is
not imported by the website and is absent from normal production builds. Historical
TS/TSX is substituted only for this probe; CSS/assets use the working tree and must
still match the baseline for comparisons. Use `/tmp` output because this repository
has historical tracked build files in `dist/`.

Current clean preview: `http://127.0.0.1:4173/`, output `/tmp/portfolio-perf-final`.

## Reference checks

The approach follows React Three Fiber's guidance to keep fast changes out of
React state and avoid allocating temporary objects in frame loops:
[R3F performance pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls).
Stable snapshots and discrete subscriptions follow the
[React external-store contract](https://react.dev/reference/react/useSyncExternalStore).
RAF ownership accounts for background suspension and valid zero handles described
in the [browser API reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame).

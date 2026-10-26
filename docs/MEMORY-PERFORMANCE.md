# Rendering memory and scroll work — 2026-10-26

The previous optimization was merged and pushed to `main` at
`1e7e31af74dfe07e3aa3bbb25a3a7372a30b5df2`. The deployed website was verified
serving that build's asset hashes. This follow-up is on `codex/memory-performance`.
Comparisons below use a local build of that exact commit and the new candidate;
the already-updated deployed website is not treated as an older baseline.

## Changes

- The final display canvas no longer requests a depth attachment. The 3D scene
  still renders into the composer's original input target, with depth enabled.
- The composer's other HDR target no longer allocates its unused depth attachment.
  Only fullscreen materials, which neither test nor write depth, draw into it.
- Bloom temporarily uses that existing HDR output texture for its luminance
  extraction. Its contents are consumed by the mip chain before the bloom
  composite overwrites it. This eliminates one full-resolution RGBA16F texture.
  Dimensions, format, filtering, color space, samples, viewport and other relevant
  properties must match or bloom falls back to its original target. `finally`
  restores target ownership even on failure; disposing bloom never disposes the
  borrowed composer buffer.
- Journey progress text and fill/packet styles update at the original callback
  cadence. React only rerenders at the original node, log and caret thresholds.
  Width/height/position properties and their CSS transitions are unchanged.
- Hero parallax skips writes once its exact output stops changing. One-shot reveal
  triggers retire after completion rather than remaining in the scroll registry.

No shader, palette, particle count, geometry, DPR cap, HDR precision, effect
strength, animation duration, easing or frame-rate setting was reduced.

## Safari process memory and CPU

Normal production builds were served sequentially at the same localhost URL,
with one dedicated Safari tab at the dark hero. The tab was reopened for each
pass, but Safari reused its WebContent process: these are **not** fresh-process
benchmarks. Raw results and exclusions are in
[memory-performance-measurements.json](memory-performance-measurements.json).

| `vmmap` physical footprint | Main baseline | Candidate |
| --- | ---: | ---: |
| First sequence | 648.5 MiB | 646.7 MiB |
| Repeat sequence | 699.0 MiB | 629.1 MiB |
| Repeat graphics dirty memory | 581.0 MiB | 505.4 MiB |

The repeat showed **69.9 MiB (~10%) less process memory**. The nearly flat first
sequence demonstrates how cache/allocator history can obscure savings; do not
present 10% as universal or guaranteed. Graphics allocation capacity decreased
in both sequences. Most of the original footprint was graphics rather than the
JavaScript heap, which is why this change targets render storage rather than
compressed download sizes.

The final sequential `top` samples ranged from 11.7–17.5% CPU on main and
11.8–17.8% on the candidate. These overlapping ranges establish **no additional
idle CPU reduction**. Earlier CPU samples overlapping a build or `vmmap` were
excluded from comparison and retained in the raw data. The measured CPU-side
improvement is reduced journey React work during scrolling, shown below.

## Verification

`npm run test:performance`: 22 tests plus the actual bloom-pass recorder.
TypeScript and the production build pass. The existing large Three.js bundle
warning remains.

Safari smoke checks cover normal animation, theme changes, Journey/Systems
navigation, opening the light-theme case study and returning home. Mobile and
reduced-motion behavior is covered by runtime regression tests in this pass.

The new pass-sequence tests run the production effect declarations, the installed
React composer's grouping logic and actual postprocessing pass methods. They
check scene depth, every shader/uniform/input, target sizes, image provenance,
resize, theme changes, initial light-mode warm-up, mismatched configurations,
exceptions and disposal. No draw samples its own destination texture. Bound color
targets fall from 18 to 17. The original visual regression checks remain intact.

Pipeline tests compare against the actual `1e7e31a` source for desktop, mobile,
reduced motion, threshold boundaries, reverse scrolling and rerender/ref behavior.
10,000 continuous progress updates produce 8 semantic React state changes.

### Safari pixel comparison

Safari viewport: 1800 × 956 CSS pixels, device DPR 2, unchanged render DPR cap 1.5.
Actual WebGL drawing buffer: **2685 × 1434** (the canvas excludes the scrollbar).
The local-only probe freezes scene time, dust positions, pointer influence and
noise time **only for pixel comparison**. These controls are not in normal builds
and were disabled for timing measurements. Entire RGBA canvas frames match
byte-for-byte (SHA-256) in both themes:

| Theme | Baseline and candidate SHA-256 |
| --- | --- |
| Dark | `adacbbb2034bfb717143408c058b4599924d880dcf20d5d5afdb8e39ea44f58d` |
| Light | `8d6f20f26b1f5c6a7f9e40e09c0348ad0068012a52810d83e511de20a7f9a8c1` |

Safari's real context reports default depth `true` → `false`. Its explicitly
allocated depth renderbuffers change from two to one, both at unchanged resolution.
At this drawing-buffer size, the eliminated HDR texture is 29.38 MiB. Two
24-bit depth attachments account for another 22.03 MiB raw, or 29.38 MiB if
stored with 32-bit alignment: **51.41–58.75 MiB of buffer storage in total**.
This is allocation arithmetic, not a promised percentage reduction in Activity
Monitor's process memory; driver backing stores and caches affect that total.

### Safari full-motion samples

Four-second samples, same viewport, dark theme. Journey samples start at the
Journey navigation destination and scroll another 1200px to 18% local progress.

| Metric | Main baseline | Candidate |
| --- | ---: | ---: |
| Journey panel function invocations | 111 | 3 |
| Journey frame median / p95 | 22 / 29 ms | 22 / 28 ms |
| Journey frames over 50 ms | 1 | 0 |
| Hero frame median / p95 | 16 / 20 ms | 18 / 20 ms |
| Hero frames over 50 ms | 1 | 0 |
| Hero GPU draws per frame | 31 | 31 |

These short samples show less React work, not a statistically established FPS or
whole-process CPU improvement. The visible bloom still renders every original
pass, so no large additional idle CPU/GPU reduction is claimed. Timing samples
include browser scheduling noise and other activity on the user's machine.

## Reproduce

Use one preview server on port 4173 and `/tmp` build outputs (the repository has
historical tracked `dist/` files).

```sh
node scripts/build-performance-probe.mjs 1e7e31a /tmp/portfolio-memory-baseline-probe
node scripts/build-performance-probe.mjs working /tmp/portfolio-memory-candidate-probe
npm run build -- --outDir /tmp/portfolio-memory-final
```

Serve one directory at a time with Vite preview. `/?profile` supplies timing and
buffer controls. `/?profile&capture` supplies a deterministic canvas frame for the
Hash frame control; never use that mode for performance timing. Keep the same
viewport/theme/scroll position and allow the intro to finish before sampling.
The instrumentation is absent from the normal production entrypoint.

Final normal preview: `http://localhost:4173/`, served from
`/tmp/portfolio-memory-final`. Only one Node listener remains on port 4173.

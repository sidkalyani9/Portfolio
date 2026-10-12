# Option 1: Signature → hero

Branch: `loader/01-signature`, based directly on `test-3-revamp-2` at `bbcea05`.

The loader uses the hero's existing letter masks and typography: each letter rises from below, then both words travel into the hero's measured position and size. The page emerges during that movement. The real heading takes over at the same coordinates without replaying its entrance.

## Preview

Run `npm run dev -- --host 127.0.0.1 --port 5173` and open <http://127.0.0.1:5173/?intro=1>. The query replays the introduction in development only. Ordinary visits play once per tab. Reduced motion, deep links and direct case-study visits skip it. Escape, viewport resizing or switching to reduced motion finish it immediately.

## Motion and loading

- Letter reveal: 1.05 seconds with a 45 ms stagger; the second word follows 160 ms later.
- The letter rise uses native transform animations so startup JavaScript does not drive each frame. The GSAP travel timing and easing are unchanged. Native animations are cancelled with the introduction.
- Travel: starts at 1.5 seconds, lasts 1.05 seconds and uses a smooth acceleration/deceleration curve.
- The backdrop fades during travel; supporting hero text starts near the landing to avoid overlapping the moving name.
- Font files are served locally; both title faces are preloaded. Layout is measured once after fonts settle. Animation updates transforms and opacity, without layout reads on each frame.
- The role line reserves its final height so streamed text cannot shift the destination.
- The name's glyph layers and reveal masks have extra horizontal paint space for italic serifs, balanced by negative margins to preserve placement and spacing. This styling is scoped to the loader and hero name.
- If fonts take longer than 900 ms, the page is released instead of animating toward unstable coordinates. A 4.2 second defensive deadline also releases the page.
- Covered controls are inert, scrolling is temporarily locked, and timers, event listeners, cloned text and animation styles are cleaned up.

## Validation

Production build and Chromium checks at 1440×1000, 1280×800, 390×844 and 320×720. Both word boxes and their first glyphs land within 0.001 CSS px of the hero in the measured checks; the hero does not replay the letter entrance. Also checked session skipping, reduced motion, Escape, resizing, deep links, blocked fonts/storage and delayed fonts. A fresh mobile-size browser run completed in about 2.65 seconds; a forced 1.4 second font delay released the page in about 0.97 seconds. These are local observations, not guarantees for every device.

The native rise and italic clipping fix were also checked in Chromium and WebKit at all four sizes at 2× pixel density: all 16 glyphs fit their paint bounds, the handoff stays within 0.001 CSS px, and native animations are removed on completion. The heading's dimensions and placement are unchanged. A Chromium animation trace reported no compositor failures for the 16 letter animations.

## Other concepts

`loader/02-monogram` and `loader/03-aperture` are independent branches from the same base commit. Their previews use ports 5174 and 5175 respectively. `loader-concepts.html` preserves the original research studies; this implementation is on the actual homepage.

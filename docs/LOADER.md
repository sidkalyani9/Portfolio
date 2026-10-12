# Option 4: Aperture title handoff

Branched directly from `loader/03-aperture` at `757ff26` on `loader/04-aperture-title`.

The fine seam and two sliding curtains retain Loader 3's choreography. The compact name above the seam now uses the hero's own letterforms: it rises into view, separates into two rows, then grows and travels into the hero's exact position as the curtains open. The real heading takes over on the same render that removes the overlay, without a second entrance.

Run `npm run dev -- --port 5173` and open `http://127.0.0.1:5173/?intro=1` to replay the introduction during local review. Ordinary visits play once per tab. Reduced motion, deep links and direct case-study visits skip it. Escape and viewport resizing finish it immediately.

The supporting hero content begins during the reveal. Self-hosted fonts are loaded before destination measurements, and the role line reserves its final height so typing cannot shift the landing position. Font readiness has a 900 ms bound; if fonts are still loading, the intro is skipped. Unavailable fonts or session storage never block access. Covered controls are inert, scrolling is locked temporarily, and all timers and animations are cleaned up.

Both words, the seam and both curtains use native transform/opacity animations on a shared document clock. The words are measured once, cloned at their final resolution, and animated as two layers with static letters; startup JavaScript does not drive their frames. The initial 480 ms name rise is preserved, and the curtains still start at 650 ms and open over 900 ms. The words separate vertically for 180 ms before growing, avoiding overlapping letters. Completion follows the bottom curtain's finish event; Escape, resize, reduced-motion changes and unmount cancel all five animations and the hero reveal timer.

Validation: production build; Chrome and WebKit at 1440, 1280, 390 and 320 px widths; word and glyph landing alignment within 0.02 px; unchanged curtain positions; session skipping; reduced motion; Escape; resize; deep links; blocked and delayed fonts/storage; screenshot review. The italic-letter clipping fix is preserved on both the moving and final title.

Chromium animation traces at normal speed and 4× CPU throttling reported no compositor failures for any of the five loader animations. These checks verify compositor eligibility and continuity; they do not guarantee a particular frame rate on every device.

`loader-concepts.html` contains the original research studies. The implemented loader is on the actual homepage.

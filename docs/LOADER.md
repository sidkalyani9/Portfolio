# Option 4: Aperture title handoff

Branched directly from `loader/03-aperture` at `757ff26` on `loader/04-aperture-title`.

The fine seam and two sliding curtains retain Loader 3's opening. The compact name above the seam uses the hero's own letterforms and Loader 1's masked letter rise: each letter rises for 1050 ms with a 45 ms stagger, starting at 50 ms for Siddharth and 210 ms for Kalyani. It then separates into two rows, grows and travels into the hero's exact position as the curtains open. The real heading takes over on the same render that removes the overlay, without a second entrance.

Run `npm run dev -- --port 5173` and open `http://127.0.0.1:5173/?intro=1` to replay the introduction during local review. Ordinary visits play once per tab. Reduced motion, deep links and direct case-study visits skip it. Escape and viewport resizing finish it immediately.

The supporting hero content begins during the reveal. Self-hosted fonts are loaded before destination measurements, and the role line reserves its final height so typing cannot shift the landing position. Font readiness has a 900 ms bound; if fonts are still loading, the intro is skipped. Unavailable fonts or session storage never block access. Covered controls are inert, scrolling is locked temporarily, and all timers and animations are cleaned up.

The 16 letters, two words, seam and curtains use native transform/opacity animations on a shared document clock. The words are measured once and cloned at their final resolution. Their path is prepared before playback, blending the row separation into travel without stopping at a waypoint or overlapping letters. Startup JavaScript does not drive any animation frames. The curtains start at 1550 ms, after the letter rise settles, and open over 1100 ms. Completion follows the bottom curtain's finish event; Escape, resize, reduced-motion changes and unmount cancel all 21 animations and the hero reveal timer.

The seam grows symmetrically from its center, with a gentler 1150 ms draw to 22% of the viewport width (previously 16%), followed by a 1000 ms expansion and fade. Its initial delay is 120 ms. The bounded failsafe releases the page after 4400 ms even if playback is interrupted.

While the opaque loader is covering the page, scroll tracking does not publish repeated React updates and WebGL prepares its scene on demand. Continuous scene rendering and scroll tracking start with the curtain reveal. A draw-call check confirmed that, after preparation, the scene performs no hidden drawing during the covered part of the letter rise, and resumes when revealed. Page and scene behavior after the intro retain their existing animation paths.

Validation: production build; Chrome and WebKit at 1440, 1280, 390 and 320 px widths; exact letter delays and duration; centered, increasing seam width; word and glyph landing alignment within 0.02 px; mirrored curtain positions; session skipping; reduced motion; Escape; resize; scrolling after the reveal; deep links; blocked and delayed fonts/storage; screenshot review. The italic-letter clipping fix is preserved on both the moving and final title.

Chromium animation traces at normal speed and 4× CPU throttling reported no compositor failures for any of the 21 loader animations. These checks verify compositor eligibility and continuity; they do not guarantee a particular frame rate on every device.

`loader-concepts.html` contains the original research studies. The implemented loader is on the actual homepage.

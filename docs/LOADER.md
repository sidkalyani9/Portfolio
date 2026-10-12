# Option 3: Aperture

Based directly on `test-3-revamp-2` at `bbcea05`.

A fine horizontal seam expands into two sliding curtains, revealing the homepage from the center.

Run `npm run dev -- --port 5173` and open `http://127.0.0.1:5173/?intro=1` to replay the introduction during local review. Ordinary visits play once per tab. Reduced motion, deep links and direct case-study visits skip it. Escape and viewport resizing finish it immediately.

The hero begins during the reveal. Fonts have a bounded wait; unavailable fonts or session storage never block access. Covered controls are inert, scrolling is locked temporarily, and all timers and animations are cleaned up.

Validation: production build; desktop and mobile browser checks; session skipping; reduced motion; Escape; deep links; blocked fonts/storage; screenshot review. The hero name also includes the italic-letter clipping fix, with extra paint space that preserves its layout and spacing.

`loader-concepts.html` contains the original research studies. The implemented loader is on the actual homepage.

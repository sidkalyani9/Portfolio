# Option 3: Aperture

Based directly on `test-3-revamp-2` at `bbcea05`.

A fine horizontal seam expands into two sliding curtains, revealing the homepage from the center.

Run `npm run dev -- --port 5175` and open `http://127.0.0.1:5175/?intro=1` to replay the introduction during local review. Ordinary visits play once per tab. Reduced motion, deep links and direct case-study visits skip it. Escape and viewport resizing finish it immediately.

The hero begins during the reveal. Fonts have a bounded wait; unavailable fonts or session storage never block access. Covered controls are inert, scrolling is locked temporarily, and all timers and animations are cleaned up.

Validation: production build; desktop and mobile browser checks; session skipping; reduced motion; Escape; deep links; blocked fonts/storage; screenshot review. The monogram landing was checked against the header at both viewport sizes.

`loader-concepts.html` contains the original research studies. The implemented loader is on the actual homepage.

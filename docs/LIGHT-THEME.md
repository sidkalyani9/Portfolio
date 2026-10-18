# Violet on paper

Dark by default, with an optional light theme. Originally developed on `codex/light-violet`, branched from `main` at `83d2432`.

For the current light-atmosphere trial, saved alternatives, and user feedback, read [LIGHT-ATMOSPHERE-EXPERIMENTS.md](./LIGHT-ATMOSPHERE-EXPERIMENTS.md).

## Design references

- [ET Studio — Studio](https://www.e-t.studio/studio): directly inspected the live page. Oversized typography, generous negative space, a restrained neutral palette, and clear editorial alignment. The studio lists its own site's 2023 Awwwards Site of the Day award on this page.
- [Azzerad Studios — Awwwards](https://www.awwwards.com/sites/azzerad-studios): Site of the Day, January 14, 2022; the award entry highlights white, typography, galleries, and motion.
- [White Coffee — Awwwards](https://www.awwwards.com/sites/white-coffee): Honorable Mention, June 5, 2024; a tightly limited white and charcoal palette with minimalist art direction.

The application to this portfolio is a design judgment: keep its distinctive serif typography and cinematic identity, give the typography a white canvas with visible purple clouds across the viewport, and keep text readable over the moving atmosphere. These references inform the treatment; no layouts or assets are copied.

## Color recommendation

Keep purple. It already connects the name, gas, particles, journey, and interaction states. Replacing it with blue would require changing the visual identity; teal would introduce a competing hue alongside the requested purple gas. Use deep violet for functional accents and pale lilac for atmosphere. The existing warm accent is reduced to a muted plum for occasional labels.

| Role | Color | Treatment |
| --- | --- | --- |
| Canvas | `#ffffff` | Actual white in CSS, WebGL, intro, and browser metadata |
| Surface | `#faf9fc` | Subtle separation from the canvas |
| Selected surface | `#f1edf7` | Pale violet with dark readable labels |
| Heading | `#21182e` | Near-black plum |
| Body | `#554b63` | Quiet, high-contrast supporting text |
| Muted text | `#685c76` | Small labels remain readable |
| Primary accent | `#7139bb` | Name, links, buttons, focus rings, journey packet |
| On accent | `#ffffff` | Dedicated button-label token |

Calculated contrast on solid white: heading 17.01:1, body 8.16:1, muted text 6.21:1, and accent 6.99:1. On the selected surface, these are 14.74:1, 7.07:1, 5.38:1, and 6.06:1. These are token-pair calculations, not a claim of a full accessibility audit over every animated frame.

## Implementation

- Preserve content, routes, typography, section layout, scroll choreography, intro timing, and interactions. Hide the redundant hero scroll cue below 900px, where it overlapped the runtime card; the persistent mobile journey navigation remains available.
- Replace dark glass with translucent white, quieter violet shadows, and visible ink-tinted borders.
- Retune the procedural gas shader as violet pigment on white across the entire viewport. Preserve pointer response and scroll movement. Remove the horizontal mask and radial crop, and reduce white veils so clouds remain visible on the left, center, and lower background.
- Use normal particle blending, since additive particles disappear against white. Give the light constellation saturated violet surfaces, controlled transparency, directional highlights, and darker connections so its depth reads against the clouds.
- Keep one stable, compiled effects pipeline for both themes. In light mode, set the dark vignette, bloom, chromatic aberration, and tone-mapping blend opacity to zero; retain a trace of texture. In dark mode, restore their original strengths, the gas shader, luminous dust, and constellation colors. Tone mapping explicitly uses NORMAL blending so zero opacity actually disables it.
- Give the mobile 2D canvas, CSS fallback, intro curtains, navigation, command palette, cursor, and progress HUD matching light treatments.
- Retain reduced-motion handling; repaint the static mobile canvas when resized.
- Keep system selectors more opaque than decorative surfaces so moving graphics cannot interfere with their labels.

## Validation

- TypeScript and production build pass (`npm run build -- --outDir /tmp/portfolio-light-build`). No dependencies added.
- `git diff --check` passes.
- Browser checks cover 320px and 390px phones, 768px tablet, 975px compact desktop, and 1440px desktop. No horizontal page overflow at the checked widths.
- Exercised section navigation, desktop and mobile systems selection, Bidstream and GrantFlow case-study routes, command search and keyboard activation, the mobile menu, and the mobile progress navigation.
- Resume PDF, locally hosted font, and direct case-study route return HTTP 200. No broken loaded images or browser console errors observed.
- Palette contrast ratios checked numerically. Reduced-motion branches inspected in source; the browser tool does not expose reduced-motion emulation.
- Vite still reports the existing large Three.js chunk warning. The WebGL bundle remains lazy-loaded.
- Generated `dist/` files are excluded from this change; Netlify builds from source with the existing configuration.

## Theme control

- A circular sun/moon button is the rightmost control in the fixed header, after social actions on desktop and after the menu on phones. Appearance stays accessible without opening navigation. The visible disc is 36px with a 44px hit target.
- The sun/moon icon rotates and scales between states. The palette updates immediately; there is no full-page snapshot, render wait, or temporary click lock. Reduced motion disables icon animation. This replaces the earlier View Transition implementation, whose canvas-frame wait caused a roughly four-second rendering stall in the local browser.
- A first visit always uses dark, regardless of the operating-system setting. An explicit choice is saved under `portfolio-theme` and restored in the document head before the first paint. Missing, invalid, or unavailable storage falls back to dark; changes also synchronize between tabs. Existing saved light preferences remain respected.
- Shared CSS tokens, intro curtains, browser chrome, glass, foregrounds, glows, desktop WebGL, and mobile 2D rendering follow the selected theme. The scene stays mounted and keeps its progress. Small dark-theme labels use a slightly brighter muted color for readability.
- At compact desktop widths, redundant social links and the command shortcut leave the header to give navigation and the theme control enough space. The same actions remain available in the page/footer, and the keyboard command shortcut remains active.

Additional validation: production build and TypeScript pass; browser checks at 320px, 900px, 975px, and 1440px show no horizontal overflow. Confirmed both palettes, Space-key activation, saved dark preference after reload, mobile navigation while switching, unchanged scroll position (9975px) when switching within Systems, and Bidstream case-study navigation and switching. Bootstrap checks cover no preference, light, dark, invalid preference, and blocked storage (all five pass). No application console errors observed. Reduced-motion and unsupported-browser fallback paths reviewed in source; these were not emulated in the browser.

## Full-field gas and switching performance follow-up

The light shader now uses the same viewport-wide flow coordinates as dark mode, with stronger violet pigment and no directional suppression. CSS and mobile canvas atmospheres are also broader and stronger; white text veils and the bottom fade are reduced. Dark-mode gas keeps its existing formula.

Theme changes reuse the effect instances, composer passes, and node materials. Effects are memoized so a new React children array cannot rebuild the composer during theme or scroll updates. Node materials remain in the transparent rendering path in both themes (opacity reaches 1 at night), avoiding material disposal and shader variant recompilation on each click.

A temporary local-preview frame probe sampled 1.2 seconds after clicks at 1280×720. Before the fix, the longest frame gaps were 4017ms and 4056ms. After the fix, both directions updated the document theme in about 1ms, with longest observed frame gaps of 17–18ms and no gaps over 50ms. These are local browser measurements, not a guarantee for every device. Repeated switching, immediate command-palette interaction, and the mobile menu also passed. The probe is not included in the source or final preview.

## Light graph refinement

The dark-default release and rightmost theme control were pushed to `main` at `df27afc`. This follow-up is developed separately on `codex/light-atmosphere-refinement`.

The atmosphere uses the soft, full-field gas from `df27afc`. The later contour-based treatment was rejected because it made the gas look marbled. Its shader scale, contour bands, increased pigment density, and mobile cloud changes have been reverted exactly to the earlier atmosphere.

The graph now has darker violet connections, more saturated nodes, stronger directional highlights, and a clearer active state. Light-mode node opacity increases from 25–50% to 64–94%, while ambient lighting decreases so it no longer flattens the facets. The redundant light hero node label is hidden where it crossed the oversized name. The node materials and effects remain mounted during switching.

Mobile retains the earlier three soft cloud layers and CSS atmosphere, alongside the clearer graph lines and progress nodes. Existing reduced-motion behavior remains in place.

Validation: TypeScript and the production build pass. Checked the desktop hero and journey, 390px mobile atmosphere and menu switching, and 320px header fit without horizontal overflow. A temporary preview probe recorded longest frame gaps of 17–18ms for desktop theme changes and 22ms for the checked mobile change, with no frames above 50ms in those 1.2-second samples. These are local measurements. The existing Three.js bundle-size warning remains.

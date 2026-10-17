# Violet on paper

Light-theme direction for `codex/light-violet`, branched from `main` at `83d2432`.

## Design references

- [ET Studio — Studio](https://www.e-t.studio/studio): directly inspected the live page. Oversized typography, generous negative space, a restrained neutral palette, and clear editorial alignment. The studio lists its own site's 2023 Awwwards Site of the Day award on this page.
- [Azzerad Studios — Awwwards](https://www.awwwards.com/sites/azzerad-studios): Site of the Day, January 14, 2022; the award entry highlights white, typography, galleries, and motion.
- [White Coffee — Awwwards](https://www.awwwards.com/sites/white-coffee): Honorable Mention, June 5, 2024; a tightly limited white and charcoal palette with minimalist art direction.

The application to this portfolio is a design judgment: keep its distinctive serif typography and cinematic identity, give the typography a white canvas, and make the moving atmosphere subordinate to reading. These references inform the treatment; no layouts or assets are copied.

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
- Retune the actual procedural gas shader as violet pigment on white. Preserve pointer response and scroll movement.
- Use normal particle blending, since additive particles disappear against white. Reduce the opacity of constellation solids so they do not obscure reading.
- Remove the dark vignette, bloom, chromatic aberration, and filmic tone mapping; retain a trace of texture.
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

/**
 * One easing language for the whole runtime.
 * Every animation — cursor, magnetic, reveals, wipes, counters — uses these.
 */
export const EASE_OUT_EXPO = "expo.out";
export const EASE_OUT_POWER = "power3.out";
export const EASE_OUT_QUINT = "quint.out";
export const EASE_IN_OUT_EXPO = "expo.inOut";
export const EASE_OUT_BACK = "back.out(1.4)";

/** CSS twins of the GSAP eases (see index.css custom properties) */
export const CSS_EASE_OUT_EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
export const CSS_EASE_OUT_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";

export const DUR = {
  page: 0.9,
  panel: 0.4,
  reveal: 0.85,
  scroll: 1.15,
  wipe: 0.55,
  micro: 0.3,
} as const;

export const HEADER_OFFSET = 88;

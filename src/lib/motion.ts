/**
 * Motion B — Editorial Balanced.
 * Slow-ish, heavy, premium: longer settles, soft staggers, no bounce chaos.
 */
export const EASE_OUT_EXPO = "expo.out";
export const EASE_OUT_POWER = "power3.out";
export const EASE_OUT_QUINT = "quint.out";
export const EASE_IN_OUT_EXPO = "expo.inOut";
/** Prefer expo/power over back for premium weight */
export const EASE_OUT_BACK = "expo.out";

/** CSS twins of the GSAP eases (see index.css custom properties) */
export const CSS_EASE_OUT_EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
export const CSS_EASE_OUT_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";

export const DUR = {
  page: 1.05,
  panel: 0.55,
  reveal: 1.05,
  scroll: 1.35,
  wipe: 0.78,
  micro: 0.42,
  magnetic: 0.55,
  magneticReturn: 0.9,
  cursorCore: 0.22,
  cursorRing: 0.58,
  preloaderMin: 2.2,
  counter: 2.6,
} as const;

/** Split-text / list stagger — Motion B */
export const STAGGER = {
  char: 0.055,
  item: 0.07,
  menu: 0.085,
} as const;

/** Desktop header clearance for scroll-to / pin. Mobile uses CSS calc against h-14. */
export const HEADER_OFFSET = 88;
/** Mobile fixed header: h-14 + small breathing room */
export const HEADER_OFFSET_MOBILE = 72;

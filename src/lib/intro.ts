export const INTRO_STORAGE_KEY = "portfolio:intro:aperture:v1";

/** Only introduce the homepage once per tab; local reviews can explicitly replay. */
export function shouldPlayIntro() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.location.pathname !== "/" || window.location.hash) return false;
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).get("intro") === "1") return true;
  try {
    return sessionStorage.getItem(INTRO_STORAGE_KEY) !== "seen";
  } catch {
    return true;
  }
}

export function rememberIntro() {
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "seen");
  } catch {
    // Storage restrictions must never prevent access to the portfolio.
  }
}

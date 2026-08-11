/**
 * Remember which home section opened a case study so "Back" can return there.
 */

const STORAGE_KEY = "portfolio:case-study-from";

const ALLOWED = new Set([
  "home",
  "telemetry",
  "about",
  "experience",
  "pipeline",
  "systems",
  "awards",
  "hackathon",
  "work",
  "contact",
]);

export function setCaseStudyOrigin(section: string | null | undefined) {
  if (!section || !ALLOWED.has(section)) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, section);
  } catch {
    /* ignore */
  }
}

export function getCaseStudyOrigin(fallback = "work"): string {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    if (v && ALLOWED.has(v)) return v;
  } catch {
    /* ignore */
  }
  return fallback;
}

/** Sensible fallback when no origin was stored (direct URL / refresh). */
export function originFallbackForSlug(slug: string | undefined): string {
  if (!slug) return "work";
  if (
    slug === "bidstream-ai" ||
    slug === "authenticated-scraping-automation" ||
    slug === "meeting-intelligence-pipeline"
  ) {
    return "systems";
  }
  if (slug === "grantflow") return "hackathon";
  return "work";
}

const BACK_LABELS: Record<string, string> = {
  home: "Back to home",
  telemetry: "Back to metrics",
  about: "Back to about",
  experience: "Back to experience",
  pipeline: "Back to journey",
  systems: "Back to systems",
  awards: "Back to awards",
  hackathon: "Back to hackathon",
  work: "Back to work",
  contact: "Back to contact",
};

export function backLabelForSection(section: string): string {
  return BACK_LABELS[section] ?? "Back to work";
}

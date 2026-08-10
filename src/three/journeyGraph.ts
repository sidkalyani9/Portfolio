/**
 * Background graph graphs.
 * Home: one node per page section.
 * Case study: essay flow (problem → outcome), driven by page scroll.
 */

export type GraphNode = {
  /** matches section element id on home; free-form on case studies */
  id: string;
  label: string;
  sub: string;
  position: [number, number, number];
};

export type GraphMode = "home" | "case-study";

/** Home page — scroll order of meaningful sections */
export const HOME_GRAPH_NODES: GraphNode[] = [
  { id: "home", label: "boot", sub: "intro", position: [-5.2, 0.9, -0.4] },
  { id: "telemetry", label: "metrics", sub: "signal", position: [-4.0, 1.5, 0.8] },
  { id: "about", label: "about", sub: "profile", position: [-2.6, 0.5, 1.4] },
  { id: "experience", label: "career", sub: "path", position: [-1.2, 1.3, 0.2] },
  { id: "pipeline", label: "runtime", sub: "agents", position: [0.2, 0.4, 1.2] },
  { id: "systems", label: "systems", sub: "owned", position: [1.5, 1.4, -0.3] },
  { id: "awards", label: "awards", sub: "proof", position: [2.8, 0.6, 1.0] },
  { id: "hackathon", label: "ship", sub: "hackathon", position: [4.0, 1.2, 0.1] },
  { id: "work", label: "work", sub: "products", position: [5.1, 0.5, -0.8] },
  { id: "contact", label: "contact", sub: "open", position: [6.0, 1.1, 0.5] },
];

/**
 * Case study / project pages — three beats only.
 * Fewer nodes = calmer camera + less label/packet jitter on short articles.
 */
export const CASE_STUDY_GRAPH_NODES: GraphNode[] = [
  { id: "cs-context", label: "context", sub: "problem · role", position: [-2.2, 0.85, 0.3] },
  { id: "cs-build", label: "build", sub: "system · design", position: [0.2, 1.05, 0.6] },
  { id: "cs-impact", label: "impact", sub: "outcome · next", position: [2.6, 0.7, 0.15] },
];

/** @deprecated use HOME_GRAPH_NODES — kept as alias for any older imports */
export const GRAPH_NODES = HOME_GRAPH_NODES;
export const GRAPH_SECTION_IDS = HOME_GRAPH_NODES.map((n) => n.id);

export function graphModeFromPath(pathname: string): GraphMode {
  return pathname.startsWith("/work/") ? "case-study" : "home";
}

export function nodesForMode(mode: GraphMode): GraphNode[] {
  return mode === "case-study" ? CASE_STUDY_GRAPH_NODES : HOME_GRAPH_NODES;
}

/**
 * Continuous journey 0→1 from real section geometry (home page).
 * Within section i, local 0→1 maps to journey [i/(n-1), (i+1)/(n-1)].
 */
export function measureSectionJourney(
  sectionIds: readonly string[] = GRAPH_SECTION_IDS,
  focusY = 0.4,
): { journey: number; section: string | null; sectionIndex: number; local: number } {
  const n = sectionIds.length;
  if (n === 0) {
    return { journey: 0, section: null, sectionIndex: 0, local: 0 };
  }

  // If none of the section nodes exist in the DOM, caller should use page progress.
  const present = sectionIds.some((id) => document.getElementById(id));
  if (!present) {
    return { journey: 0, section: null, sectionIndex: 0, local: 0 };
  }

  const vh = window.innerHeight;
  const focus = vh * focusY;
  const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

  const tops: number[] = [];
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) {
      tops.push(tops.length === 0 ? 0 : tops[tops.length - 1] + vh);
      continue;
    }
    tops.push(el.getBoundingClientRect().top + scrollY);
  }

  const docH = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  );
  const bottoms = tops.map((t, i) =>
    i < n - 1 ? tops[i + 1] : Math.max(docH, t + vh),
  );

  const cursor = scrollY + focus;

  if (cursor <= tops[0]) {
    return { journey: 0, section: sectionIds[0], sectionIndex: 0, local: 0 };
  }

  if (cursor >= bottoms[n - 1]) {
    return {
      journey: 1,
      section: sectionIds[n - 1],
      sectionIndex: n - 1,
      local: 1,
    };
  }

  let i = 0;
  for (; i < n; i++) {
    if (cursor >= tops[i] && cursor < bottoms[i]) break;
  }
  i = Math.min(n - 1, Math.max(0, i));

  const span = Math.max(1, bottoms[i] - tops[i]);
  const local = Math.min(1, Math.max(0, (cursor - tops[i]) / span));

  const journey =
    n === 1 ? local : Math.min(1, Math.max(0, (i + local) / (n - 1)));

  return {
    journey,
    section: sectionIds[i],
    sectionIndex: i,
    local,
  };
}

/** Case-study journey: pure page scroll 0→1 (article has no section graph ids). */
export function measurePageJourney(nodeCount: number): {
  journey: number;
  section: string;
  sectionIndex: number;
  local: number;
} {
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);
  const y = window.scrollY || doc.scrollTop || 0;
  const journey = Math.min(1, Math.max(0, y / max));
  const n = Math.max(1, nodeCount);
  const edgeT = journey * Math.max(1, n - 1);
  const sectionIndex = Math.min(n - 1, Math.floor(edgeT));
  const local = edgeT - sectionIndex;
  return {
    journey,
    section: "case-study",
    sectionIndex,
    local,
  };
}

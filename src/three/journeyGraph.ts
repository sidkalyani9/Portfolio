/**
 * Background graph = page story.
 * One node per meaningful home section, in scroll order.
 * Positions form a gentle S-curve the camera flies along.
 */
export type GraphNode = {
  /** matches section element id */
  id: string;
  label: string;
  sub: string;
  position: [number, number, number];
};

export const GRAPH_NODES: GraphNode[] = [
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

export const GRAPH_SECTION_IDS = GRAPH_NODES.map((n) => n.id);

/**
 * Continuous journey 0→1 from real section geometry.
 * Within section i, local 0→1 maps to journey [i/(n-1), (i+1)/(n-1)].
 * Monotonic — no jumps when the active section flips.
 */
export function measureSectionJourney(
  sectionIds: readonly string[] = GRAPH_SECTION_IDS,
  focusY = 0.4,
): { journey: number; section: string | null; sectionIndex: number; local: number } {
  const n = sectionIds.length;
  if (n === 0) {
    return { journey: 0, section: null, sectionIndex: 0, local: 0 };
  }

  const vh = window.innerHeight;
  const focus = vh * focusY;
  const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

  // Absolute tops of each section (document space)
  const tops: number[] = [];
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) {
      tops.push(tops.length === 0 ? 0 : tops[tops.length - 1] + vh);
      continue;
    }
    tops.push(el.getBoundingClientRect().top + scrollY);
  }

  // End of last section = doc bottom
  const docH = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  );
  const bottoms = tops.map((t, i) =>
    i < n - 1 ? tops[i + 1] : Math.max(docH, t + vh),
  );

  const cursor = scrollY + focus;

  // Before first section
  if (cursor <= tops[0]) {
    return { journey: 0, section: sectionIds[0], sectionIndex: 0, local: 0 };
  }

  // After last
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

  // Map to continuous journey across n nodes → (n-1) edges
  const journey =
    n === 1 ? local : Math.min(1, Math.max(0, (i + local) / (n - 1)));

  return {
    journey,
    section: sectionIds[i],
    sectionIndex: i,
    local,
  };
}

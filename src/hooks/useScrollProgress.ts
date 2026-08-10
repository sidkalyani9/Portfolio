import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import {
  CASE_STUDY_GRAPH_NODES,
  GRAPH_SECTION_IDS,
  graphModeFromPath,
  measurePageJourney,
  measureSectionJourney,
  nodesForMode,
  type GraphMode,
  type GraphNode,
} from "@/three/journeyGraph";

export type ScrollProgressValue = {
  /** 0–1 document scroll (smoothed) */
  progress: number;
  /** pixels scrolled (smoothed) */
  y: number;
  /** active section id (or "case-study") */
  section: string | null;
  /**
   * Continuous 0–1 graph journey.
   * Home: section geometry. Case study: page scroll.
   */
  journey: number;
  sectionIndex: number;
  sectionLocal: number;
  /** which graph topology is active */
  mode: GraphMode;
  /** nodes the constellation / camera should use */
  nodes: GraphNode[];
};

const defaultNodes = nodesForMode("home");

const ScrollProgressContext = createContext<ScrollProgressValue>({
  progress: 0,
  y: 0,
  section: "home",
  journey: 0,
  sectionIndex: 0,
  sectionLocal: 0,
  mode: "home",
  nodes: defaultNodes,
});

/**
 * Scroll metrics for the cinematic world.
 * Switches topology when leaving the home page for a case study.
 */
export function ScrollProgressProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const mode = graphModeFromPath(pathname);
  const nodes = useMemo(() => nodesForMode(mode), [mode]);

  const [value, setValue] = useState<ScrollProgressValue>({
    progress: 0,
    y: 0,
    section: mode === "home" ? "home" : "case-study",
    journey: 0,
    sectionIndex: 0,
    sectionLocal: 0,
    mode,
    nodes,
  });

  const target = useRef({
    progress: 0,
    y: 0,
    section: "home" as string | null,
    journey: 0,
    sectionIndex: 0,
    sectionLocal: 0,
  });
  const smooth = useRef({ progress: 0, y: 0, journey: 0 });
  const modeRef = useRef(mode);
  modeRef.current = mode;

  // Reset smoothing when route changes so we don't fly the home graph on a case study
  useEffect(() => {
    smooth.current = { progress: 0, y: 0, journey: 0 };
    target.current = {
      progress: 0,
      y: 0,
      section: mode === "home" ? "home" : "case-study",
      journey: 0,
      sectionIndex: 0,
      sectionLocal: 0,
    };
    setValue((v) => ({
      ...v,
      progress: 0,
      y: 0,
      journey: 0,
      sectionIndex: 0,
      sectionLocal: 0,
      section: mode === "home" ? "home" : "case-study",
      mode,
      nodes,
    }));
  }, [mode, nodes, pathname]);

  useEffect(() => {
    let raf = 0;
    let alive = true;

    const measure = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const y = window.scrollY || doc.scrollTop || 0;
      const progress = Math.min(1, Math.max(0, y / max));

      const m = modeRef.current;
      const j =
        m === "case-study"
          ? measurePageJourney(CASE_STUDY_GRAPH_NODES.length)
          : measureSectionJourney(GRAPH_SECTION_IDS, 0.38);

      target.current = {
        progress,
        y,
        section: j.section,
        journey: j.journey,
        sectionIndex: j.sectionIndex,
        sectionLocal: j.local,
      };
    };

    const tick = () => {
      if (!alive) return;
      const t = target.current;
      const s = smooth.current;

      s.progress += (t.progress - s.progress) * 0.08;
      s.y += (t.y - s.y) * 0.08;
      s.journey += (t.journey - s.journey) * 0.1;

      const maxLead = 0.04;
      if (s.journey > t.journey + maxLead) s.journey = t.journey + maxLead;
      if (s.journey < t.journey - maxLead) s.journey = t.journey - maxLead;

      setValue({
        progress: s.progress,
        y: s.y,
        section: t.section,
        journey: Math.min(1, Math.max(0, s.journey)),
        sectionIndex: t.sectionIndex,
        sectionLocal: t.sectionLocal,
        mode: modeRef.current,
        nodes: nodesForMode(modeRef.current),
      });
      raf = requestAnimationFrame(tick);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    const t1 = window.setTimeout(measure, 200);
    const t2 = window.setTimeout(measure, 800);
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [pathname, mode]);

  const memo = useMemo(() => value, [value]);
  return createElement(ScrollProgressContext.Provider, { value: memo }, children);
}

export function useScrollProgress() {
  return useContext(ScrollProgressContext);
}

export function useScrollProgressRef() {
  const value = useScrollProgress();
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

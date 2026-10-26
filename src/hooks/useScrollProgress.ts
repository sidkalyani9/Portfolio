import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { useBooted } from "@/components/Boot";
import {
  CASE_STUDY_GRAPH_NODES,
  GRAPH_SECTION_IDS,
  graphModeFromPath,
  measurePageJourney,
  measureSectionJourney,
  nodesForMode,
} from "@/three/journeyGraph";

import { createScrollProgressStore, type ScrollProgressValue } from "@/lib/scrollProgressStore";
export type { ScrollProgressValue } from "@/lib/scrollProgressStore";

const ScrollProgressContext = createContext(createScrollProgressStore({
  progress: 0, y: 0, section: "home", journey: 0,
  sectionIndex: 0, sectionLocal: 0, mode: "home", nodes: nodesForMode("home"),
}));

/**
 * Scroll metrics for the cinematic world.
 * Switches topology when leaving the home page for a case study.
 */
export function ScrollProgressProvider({ children }: { children: ReactNode }) {
  const booted = useBooted();
  const { pathname } = useLocation();
  const mode = graphModeFromPath(pathname);
  const nodes = useMemo(() => nodesForMode(mode), [mode]);

  const store = useMemo(() => createScrollProgressStore({
    progress: 0, y: 0, section: mode === "home" ? "home" : "case-study",
    journey: 0, sectionIndex: 0, sectionLocal: 0, mode, nodes,
  }), []);

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
    store.publish({
      progress: 0,
      y: 0,
      journey: 0,
      sectionIndex: 0,
      sectionLocal: 0,
      section: mode === "home" ? "home" : "case-study",
      mode,
      nodes,
    });
  }, [mode, nodes, pathname, store]);

  useEffect(() => {
    // Scrolling is locked behind the loader. Avoid publishing identical scroll
    // state every frame and repeatedly rendering the covered hero and 3D scene.
    if (!booted) return;
    let raf: number | null = null;
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
      if (raf === null) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      raf = null;
      if (!alive) return;
      const t = target.current;
      const s = smooth.current;

      s.progress += (t.progress - s.progress) * 0.08;
      s.y += (t.y - s.y) * 0.08;
      s.journey += (t.journey - s.journey) * 0.12;

      const maxLead = 0.04;
      if (s.journey > t.journey + maxLead) s.journey = t.journey + maxLead;
      if (s.journey < t.journey - maxLead) s.journey = t.journey - maxLead;

      // Snap to end so the last graph node can fully activate
      let journeyOut = Math.min(1, Math.max(0, s.journey));
      if (t.journey >= 0.995 || t.progress >= 0.995) {
        journeyOut = 1;
        s.journey = 1;
      }

      const changed = store.publish({
        progress: s.progress,
        y: s.y,
        section: t.section,
        journey: journeyOut,
        sectionIndex: t.sectionIndex,
        sectionLocal: t.sectionLocal,
        mode: modeRef.current,
        nodes: nodesForMode(modeRef.current),
      });
      // Stop only once the exact numbers stop changing: no epsilon, rounding,
      // reduced frame rate or shortened smoothing tail. Measurement wakes it.
      if (changed) raf = requestAnimationFrame(tick);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    const t1 = window.setTimeout(measure, 200);
    const t2 = window.setTimeout(measure, 800);
    return () => {
      alive = false;
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [pathname, mode, booted, store]);

  return createElement(ScrollProgressContext.Provider, { value: store }, children);
}

export function useScrollProgress() {
  const store = useContext(ScrollProgressContext);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

/** Select stable primitives or canonical objects to avoid unrelated renders. */
export function useScrollProgressSelector<T>(select: (value: ScrollProgressValue) => T) {
  const store = useContext(ScrollProgressContext);
  const snapshot = () => select(store.ref.current);
  return useSyncExternalStore(store.subscribe, snapshot, snapshot);
}

/** Frame consumers read current data without subscribing React to every frame. */
export function useScrollProgressRef() {
  return useContext(ScrollProgressContext).ref;
}

/** Apply identical continuous values to DOM styles without rebuilding JSX. */
export function useScrollProgressEffect(effect: (value: ScrollProgressValue) => void) {
  const store = useContext(ScrollProgressContext);
  const callback = useRef(effect);
  callback.current = effect;
  useLayoutEffect(() => {
    const update = () => callback.current(store.ref.current);
    update();
    return store.subscribe(update);
  }, [store]);
}

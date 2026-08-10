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
import {
  GRAPH_SECTION_IDS,
  measureSectionJourney,
} from "@/three/journeyGraph";

export type ScrollProgressValue = {
  /** 0–1 document scroll (smoothed) */
  progress: number;
  /** pixels scrolled (smoothed) */
  y: number;
  /** active section id */
  section: string | null;
  /**
   * Continuous 0–1 graph journey tied to section geometry.
   * Monotonic — no jumps when section flips.
   */
  journey: number;
  /** index into GRAPH_NODES / page sections */
  sectionIndex: number;
  /** 0–1 progress within the active section */
  sectionLocal: number;
};

const ScrollProgressContext = createContext<ScrollProgressValue>({
  progress: 0,
  y: 0,
  section: "home",
  journey: 0,
  sectionIndex: 0,
  sectionLocal: 0,
});

/**
 * Scroll metrics for the cinematic world.
 * journey is derived from section tops (not remapped page %), then lightly smoothed.
 */
export function ScrollProgressProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<ScrollProgressValue>({
    progress: 0,
    y: 0,
    section: "home",
    journey: 0,
    sectionIndex: 0,
    sectionLocal: 0,
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

  useEffect(() => {
    let raf = 0;
    let alive = true;

    const measure = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const y = window.scrollY || doc.scrollTop || 0;
      const progress = Math.min(1, Math.max(0, y / max));

      const j = measureSectionJourney(GRAPH_SECTION_IDS, 0.38);

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

      // Soft follow — journey must stay continuous (no section remap snap)
      // Slightly tighter than progress so the graph feels locked to scroll
      s.progress += (t.progress - s.progress) * 0.08;
      s.y += (t.y - s.y) * 0.08;
      s.journey += (t.journey - s.journey) * 0.1;

      // Never let smoothed journey run ahead of target when scrolling down slowly,
      // or lag so far it appears to skip nodes. Clamp overshoot.
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
      });
      raf = requestAnimationFrame(tick);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    // remeasure after layout (boot, fonts, images)
    const t1 = window.setTimeout(measure, 400);
    const t2 = window.setTimeout(measure, 1200);
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const memo = useMemo(() => value, [value]);
  return createElement(ScrollProgressContext.Provider, { value: memo }, children);
}

export function useScrollProgress() {
  return useContext(ScrollProgressContext);
}

/** Mutable ref bridge so R3F scenes can read progress without React re-renders. */
export function useScrollProgressRef() {
  const value = useScrollProgress();
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

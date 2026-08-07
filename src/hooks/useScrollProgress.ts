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

export type ScrollProgressValue = {
  /** 0–1 page scroll progress */
  progress: number;
  /** pixels scrolled */
  y: number;
  /** active section id when known */
  section: string | null;
};

const ScrollProgressContext = createContext<ScrollProgressValue>({
  progress: 0,
  y: 0,
  section: null,
});

const SECTION_IDS = [
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
] as const;

/**
 * Provides smoothed page scroll progress for the cinematic WebGL camera.
 * Uses rAF sampling so Lenis smooth scroll stays in sync with the 3D world.
 */
export function ScrollProgressProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<ScrollProgressValue>({
    progress: 0,
    y: 0,
    section: "home",
  });
  const target = useRef({ progress: 0, y: 0, section: "home" as string | null });
  const smooth = useRef({ progress: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    let alive = true;

    const measure = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const y = window.scrollY || doc.scrollTop || 0;
      const progress = Math.min(1, Math.max(0, y / max));

      let section: string | null = SECTION_IDS[0];
      const mid = window.innerHeight * 0.35;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) {
          section = id;
          break;
        }
      }

      target.current = { progress, y, section };
    };

    const tick = () => {
      if (!alive) return;
      const t = target.current;
      const s = smooth.current;
      // Motion B: softer camera fuel — more lag, silkier fly-through
      s.progress += (t.progress - s.progress) * 0.06;
      s.y += (t.y - s.y) * 0.06;
      setValue({
        progress: s.progress,
        y: s.y,
        section: t.section,
      });
      raf = requestAnimationFrame(tick);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
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

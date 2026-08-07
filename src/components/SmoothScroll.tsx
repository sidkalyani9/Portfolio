import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HEADER_OFFSET } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Constant scroll speed (px/s) — lower = slower for long jumps.
 * Duration scales with distance so far sections don't feel like a snap.
 */
const SCROLL_SPEED_PX_S = 520;
const SCROLL_DUR_MIN = 1.2;
const SCROLL_DUR_MAX = 5.5;

function durationForDistance(px: number) {
  const d = Math.abs(px) / SCROLL_SPEED_PX_S;
  return Math.min(SCROLL_DUR_MAX, Math.max(SCROLL_DUR_MIN, d));
}

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

type SmoothScrollContextValue = {
  scrollToId: (id: string) => void;
  scrollToY: (y: number) => void;
  headerOffset: number;
  lenis: Lenis | null;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function useScrollTo() {
  const ctx = useContext(SmoothScrollContext);
  return (
    ctx ?? {
      scrollToId: (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
      scrollToY: (y: number) => window.scrollTo({ top: y, behavior: "smooth" }),
      headerOffset: HEADER_OFFSET,
      lenis: null as Lenis | null,
    }
  );
}

type Props = { children: ReactNode };

export function SmoothScroll({ children }: Props) {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced || !isDesktop) {
      lenisRef.current = null;
      setLenis(null);
      ScrollTrigger.refresh();
      return;
    }

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = instance;
    setLenis(instance);

    instance.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(ticker);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
      ScrollTrigger.refresh();
    };
  }, [reduced, isDesktop]);

  const scrollToId = useCallback(
    (rawId: string) => {
      const map: Record<string, string> = {
        bidstream: "systems",
        proof: "about",
        home: "home",
      };
      const id = map[rawId] ?? rawId;
      const el = document.getElementById(id);
      if (!el) return;

      const instance = lenisRef.current;
      const targetTop =
        el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      const distance = targetTop - window.scrollY;
      const duration = durationForDistance(distance);

      if (instance && isDesktop && !reduced) {
        instance.scrollTo(el, {
          offset: -HEADER_OFFSET,
          duration,
          easing: easeOutQuint,
        });
      } else {
        // native smooth: approximate constant feel via CSS is limited; still better than jump
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [isDesktop, reduced],
  );

  const scrollToY = useCallback(
    (y: number) => {
      const instance = lenisRef.current;
      const distance = y - window.scrollY;
      const duration = durationForDistance(distance);

      if (instance && isDesktop && !reduced) {
        instance.scrollTo(y, { duration, easing: easeOutQuint });
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    [isDesktop, reduced],
  );

  const value = useMemo(
    () => ({
      scrollToId,
      scrollToY,
      headerOffset: HEADER_OFFSET,
      lenis,
    }),
    [scrollToId, scrollToY, lenis],
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

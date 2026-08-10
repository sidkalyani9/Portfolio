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
 * Constant scroll speed (px/s). Long jumps get more time so they finish.
 */
const SCROLL_SPEED_PX_S = 520;
const SCROLL_DUR_MIN = 1.2;
const SCROLL_DUR_MAX = 8.5;

function durationForDistance(px: number) {
  const d = Math.abs(px) / SCROLL_SPEED_PX_S;
  return Math.min(SCROLL_DUR_MAX, Math.max(SCROLL_DUR_MIN, d));
}

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

function currentScrollY(lenis: Lenis | null): number {
  if (lenis) {
    // Lenis 1.x exposes animated scroll; prefer animated value
    return (lenis as unknown as { animatedScroll?: number }).animatedScroll ??
      lenis.scroll ??
      window.scrollY;
  }
  return window.scrollY || document.documentElement.scrollTop || 0;
}

function measureTargetY(el: HTMLElement): number {
  // Mobile header is h-14 (~56px); desktop is taller with more padding
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 899px)").matches;
  const offset = isMobile
    ? Math.max(72, 56 + 16) // header + breathing room
    : HEADER_OFFSET;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  return Math.max(0, y);
}

type SmoothScrollContextValue = {
  scrollToId: (id: string) => void;
  scrollToY: (y: number) => void;
  /** Refresh Lenis + ScrollTrigger after big layout changes (route restore). */
  refreshLayout: () => void;
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
      refreshLayout: () => {},
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

    const onResize = () => {
      instance.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    requestAnimationFrame(() => {
      instance.resize();
      ScrollTrigger.refresh();
    });

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(ticker);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
      ScrollTrigger.refresh();
    };
  }, [reduced, isDesktop]);

  const refreshLayout = useCallback(() => {
    const instance = lenisRef.current;
    // force reflow so sticky / tall tracks report real heights
    void document.body.offsetHeight;
    instance?.resize();
    ScrollTrigger.refresh();
  }, []);

  const scrollToY = useCallback(
    (y: number) => {
      const instance = lenisRef.current;
      refreshLayout();
      const from = currentScrollY(instance);
      const target = Math.max(0, y);
      const duration = durationForDistance(target - from);

      if (instance && isDesktop && !reduced) {
        instance.scrollTo(target, {
          duration,
          easing: easeOutQuint,
          force: true,
        });
      } else {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    },
    [isDesktop, reduced, refreshLayout],
  );

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

      refreshLayout();

      const instance = lenisRef.current;
      const target = measureTargetY(el);
      const from = currentScrollY(instance);
      const duration = durationForDistance(target - from);

      if (instance && isDesktop && !reduced) {
        // Numeric target after resize — more reliable than element target
        // when sticky journey tracks change document height on mount.
        instance.scrollTo(target, {
          duration,
          easing: easeOutQuint,
          force: true,
        });
      } else {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    },
    [isDesktop, reduced, refreshLayout],
  );

  const value = useMemo(
    () => ({
      scrollToId,
      scrollToY,
      refreshLayout,
      headerOffset: HEADER_OFFSET,
      lenis,
    }),
    [scrollToId, scrollToY, refreshLayout, lenis],
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

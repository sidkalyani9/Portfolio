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
import { DUR, HEADER_OFFSET } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

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
      duration: 1.1,
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
      };
      const id = map[rawId] ?? rawId;
      const el = document.getElementById(id);
      if (!el) return;

      const instance = lenisRef.current;
      if (instance && isDesktop && !reduced) {
        instance.scrollTo(el, {
          offset: -HEADER_OFFSET,
          duration: DUR.scroll,
          easing: (t) => 1 - Math.pow(1 - t, 4),
        });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [isDesktop, reduced],
  );

  const scrollToY = useCallback(
    (y: number) => {
      const instance = lenisRef.current;
      if (instance && isDesktop && !reduced) {
        instance.scrollTo(y, { duration: 0.9 });
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

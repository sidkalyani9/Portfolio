import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

type Props = { children: ReactNode };

export function SmoothScroll({ children }: Props) {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (reduced || !isDesktop) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    // Allow reveal triggers created in child effects to bind
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      // Do NOT kill all ScrollTriggers — useReveal owns its own contexts
      ScrollTrigger.refresh();
    };
  }, [reduced, isDesktop]);

  return children;
}

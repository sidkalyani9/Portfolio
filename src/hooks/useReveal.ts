import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DUR, EASE_OUT_EXPO } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Premium reveals — clip-path / soft opacity.
 * Opt out with data-reveal="none". Prefer data-reveal="clip" for images.
 */
export function useReveal(rootSelector = "main") {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const els = root.querySelectorAll<HTMLElement>(".reveal");

    if (reduced) {
      els.forEach((el) => {
        el.style.opacity = "1";
        el.style.clipPath = "none";
        el.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      els.forEach((el) => {
        const mode = el.dataset.reveal ?? "soft";
        if (mode === "none") {
          el.style.opacity = "1";
          return;
        }

        if (mode === "clip") {
          gsap.fromTo(
            el,
            { autoAlpha: 1, clipPath: "inset(100% 0 0 0)" },
            {
              clipPath: "inset(0% 0 0 0)",
              duration: DUR.reveal,
              ease: EASE_OUT_EXPO,
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            },
          );
          return;
        }

        // soft: opacity + micro rise — premium weight without slop
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: EASE_OUT_EXPO,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reduced, rootSelector]);
}

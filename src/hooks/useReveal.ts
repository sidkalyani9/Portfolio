import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function useReveal(rootSelector = "main") {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const els = root.querySelectorAll<HTMLElement>(".reveal");
    if (reduced) {
      els.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      els.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
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

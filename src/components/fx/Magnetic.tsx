import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DUR, EASE_OUT_EXPO } from "@/lib/motion";

type Props = {
  children: ReactNode;
  /** 0–1, fraction of the element's size it may travel toward the pointer */
  strength?: number;
  className?: string;
};

/**
 * Magnetic wrapper — Motion B: softer follow, expo return (no elastic bounce).
 */
export function Magnetic({ children, strength = 0.32, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !fine) return;

    const xTo = gsap.quickTo(el, "x", {
      duration: DUR.magnetic,
      ease: EASE_OUT_EXPO,
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: DUR.magnetic,
      ease: EASE_OUT_EXPO,
    });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };
    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: DUR.magneticReturn,
        ease: EASE_OUT_EXPO,
      });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [reduced, fine, strength]);

  return (
    <div ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}

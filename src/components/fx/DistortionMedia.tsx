import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Subtle cinematic hover distortion on media frames —
 * scale + slight skew + brightness pulse (no WebGL per-image cost).
 */
export function DistortionMedia({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");

  const onMove = (e: React.PointerEvent) => {
    if (reduced || !fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(ref.current, {
      rotateX: -y * 4,
      rotateY: x * 5,
      scale: 1.02,
      duration: 0.45,
      ease: "expo.out",
      transformPerspective: 900,
    });
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.7,
      ease: "expo.out",
    });
  };

  return (
    <div
      className={cn("relative overflow-hidden [perspective:900px]", className)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div ref={ref} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}

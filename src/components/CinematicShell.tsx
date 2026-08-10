import { lazy, Suspense } from "react";
import { ScrollProgressProvider } from "@/hooks/useScrollProgress";
import { CinematicFallback } from "@/components/CinematicFallback";
import { MobileWorld } from "@/components/MobileWorld";
import { SectionRail } from "@/components/SectionRail";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const CinematicWorld = lazy(() =>
  import("@/three/CinematicWorld").then((m) => ({ default: m.CinematicWorld })),
);

/**
 * Option C shell — fixed cinematic layer behind all pages.
 * Desktop + fine pointer: WebGL world.
 * Mobile / touch / reduced-motion: CSS atmosphere + lightweight 2D canvas.
 */
export function CinematicShell({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const fine = useMediaQuery("(pointer: fine)");
  const useWebGL = !reduced && isDesktop && fine;
  // Mobile cinematic canvas whenever WebGL is off (still animate if reduced = static frame)
  const useMobileWorld = !useWebGL;

  return (
    <ScrollProgressProvider>
      {/* base violet atmosphere always present */}
      <CinematicFallback />
      {useWebGL ? (
        <Suspense fallback={null}>
          <CinematicWorld />
        </Suspense>
      ) : null}
      {useMobileWorld ? <MobileWorld /> : null}
      {/* content above cinematic layers; journey HUD is fixed z-40 */}
      <div className="relative z-10">{children}</div>
      <SectionRail />
    </ScrollProgressProvider>
  );
}

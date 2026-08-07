import { lazy, Suspense } from "react";
import { ScrollProgressProvider } from "@/hooks/useScrollProgress";
import { CinematicFallback } from "@/components/CinematicFallback";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const CinematicWorld = lazy(() =>
  import("@/three/CinematicWorld").then((m) => ({ default: m.CinematicWorld })),
);

/**
 * Option C shell — fixed cinematic WebGL (or CSS fallback) behind all pages.
 */
export function CinematicShell({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const fine = useMediaQuery("(pointer: fine)");
  const useWebGL = !reduced && isDesktop && fine;

  return (
    <ScrollProgressProvider>
      {/* always show CSS atmosphere; WebGL composites on top when available */}
      <CinematicFallback />
      {useWebGL ? (
        <Suspense fallback={null}>
          <CinematicWorld />
        </Suspense>
      ) : null}
      <div className="relative z-10">{children}</div>
    </ScrollProgressProvider>
  );
}

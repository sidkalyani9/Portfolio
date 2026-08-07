import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * CSS ambient fallback for mobile / reduced-motion — still feels alive,
 * without WebGL cost.
 */
export function CinematicFallback() {
  const { progress, section } = useScrollProgress();
  const shift = progress * 40;
  const hue =
    section === "pipeline" || section === "systems"
      ? 160
      : section === "contact"
        ? 320
        : 150;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-[-20%] opacity-90 transition-colors duration-1000"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at ${30 + shift * 0.3}% ${40 - shift * 0.2}%, rgba(46,230,166,0.14), transparent 55%),
            radial-gradient(ellipse 50% 45% at ${70 - shift * 0.25}% ${60 + shift * 0.15}%, rgba(124,92,255,0.12), transparent 50%),
            radial-gradient(ellipse 40% 40% at 50% 100%, rgba(225,29,72,0.08), transparent 45%),
            #07080c
          `,
          filter: `hue-rotate(${(hue - 150) * 0.15}deg)`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,8,12,0.55)_70%,rgba(7,8,12,0.85)_100%)]" />
    </div>
  );
}

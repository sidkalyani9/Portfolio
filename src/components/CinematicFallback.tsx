import { useTheme } from "@/components/ThemeProvider";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * CSS ambient base — always present under WebGL or MobileWorld.
 * Scroll-reactive violet atmosphere in both palettes.
 */
export function CinematicFallback() {
  const { theme } = useTheme();
  const { progress, section, mode } = useScrollProgress();
  const shift = progress * 40;
  const hue =
    mode === "case-study"
      ? 290
      : section === "pipeline" || section === "systems"
        ? 280
        : section === "contact"
          ? 320
          : 270;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-[-20%] opacity-90 transition-colors duration-1000"
        style={{
          background: theme === "dark" ? `
            radial-gradient(ellipse 70% 55% at ${28 + shift * 0.35}% ${38 - shift * 0.22}%, rgba(199,125,255,0.18), transparent 55%),
            radial-gradient(ellipse 55% 48% at ${72 - shift * 0.28}% ${62 + shift * 0.16}%, rgba(139,92,246,0.14), transparent 50%),
            radial-gradient(ellipse 45% 40% at 50% 105%, rgba(232,160,191,0.1), transparent 45%),
            radial-gradient(ellipse 30% 28% at ${50 + shift * 0.1}% ${20 + shift * 0.08}%, rgba(199,125,255,0.06), transparent 60%),
            #0a0712
          ` : `
            radial-gradient(ellipse 45% 40% at ${24 + shift * 0.35}% ${30 - shift * 0.22}%, rgba(139,74,218,0.3), transparent 72%),
            radial-gradient(ellipse 40% 42% at ${85 - shift * 0.28}% ${62 + shift * 0.16}%, rgba(117,60,202,0.26), transparent 72%),
            radial-gradient(ellipse 55% 45% at 25% 95%, rgba(139,74,218,0.28), transparent 72%),
            radial-gradient(ellipse 35% 25% at ${62 + shift * 0.1}% ${15 + shift * 0.08}%, rgba(153,98,225,0.18), transparent 72%),
            #ffffff
          `,
          filter: `hue-rotate(${(hue - 270) * 0.12}deg)`,
        }}
      />
      {/* light veil — leave room for particles / orbs to read */}
      <div className="absolute inset-0" style={{ background: "var(--ambient-veil)" }} />
    </div>
  );
}

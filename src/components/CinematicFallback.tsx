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
            radial-gradient(ellipse 70% 55% at ${76 + shift * 0.2}% ${30 - shift * 0.15}%, rgba(167,116,224,0.13), transparent 55%),
            radial-gradient(ellipse 55% 48% at ${72 - shift * 0.28}% ${62 + shift * 0.16}%, rgba(139,92,246,0.08), transparent 50%),
            radial-gradient(ellipse 45% 40% at 50% 105%, rgba(204,175,223,0.06), transparent 45%),
            radial-gradient(ellipse 30% 28% at ${50 + shift * 0.1}% ${20 + shift * 0.08}%, rgba(167,116,224,0.04), transparent 60%),
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

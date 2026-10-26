import { useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useScrollProgressEffect, useScrollProgressRef, type ScrollProgressValue } from "@/hooks/useScrollProgress";

function atmosphereStyle(theme: string, { progress, section, mode }: ScrollProgressValue) {
  const shift = progress * 40;
  const hue =
    mode === "case-study"
      ? 290
      : section === "pipeline" || section === "systems"
        ? 280
        : section === "contact"
          ? 320
          : 270;

  return {
    background: theme === "dark" ? `
            radial-gradient(ellipse 70% 55% at ${28 + shift * 0.35}% ${38 - shift * 0.22}%, rgba(199,125,255,0.18), transparent 55%),
            radial-gradient(ellipse 55% 48% at ${72 - shift * 0.28}% ${62 + shift * 0.16}%, rgba(139,92,246,0.14), transparent 50%),
            radial-gradient(ellipse 45% 40% at 50% 105%, rgba(232,160,191,0.1), transparent 45%),
            radial-gradient(ellipse 30% 28% at ${50 + shift * 0.1}% ${20 + shift * 0.08}%, rgba(199,125,255,0.06), transparent 60%),
            #0a0712
          ` : `
            radial-gradient(ellipse 70% 55% at ${28 + shift * 0.35}% ${38 - shift * 0.22}%, rgba(148,112,218,0.24), transparent 75%),
            radial-gradient(ellipse 55% 48% at ${72 - shift * 0.28}% ${62 + shift * 0.16}%, rgba(139,92,224,0.20), transparent 75%),
            radial-gradient(ellipse 65% 55% at 35% 90%, rgba(167,116,224,0.18), transparent 75%),
            radial-gradient(ellipse 30% 28% at ${50 + shift * 0.1}% ${20 + shift * 0.08}%, rgba(167,116,224,0.08), transparent 75%),
            #ffffff
          `,
    filter: `hue-rotate(${(hue - 270) * 0.12}deg)`,
  };
}

/**
 * CSS ambient base — always present under WebGL or MobileWorld.
 * Scroll-reactive violet atmosphere in both palettes.
 */
export function CinematicFallback() {
  const { theme } = useTheme();
  const scroll = useScrollProgressRef();
  const atmosphere = useRef<HTMLDivElement>(null);
  const applied = useRef<ReturnType<typeof atmosphereStyle> | null>(null);
  useScrollProgressEffect((value) => {
    if (!atmosphere.current) return;
    const style = atmosphereStyle(theme, value);
    if (style.background !== applied.current?.background) atmosphere.current.style.background = style.background;
    if (style.filter !== applied.current?.filter) atmosphere.current.style.filter = style.filter;
    applied.current = style;
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-[-20%] opacity-90 transition-colors duration-1000"
        ref={atmosphere}
        style={atmosphereStyle(theme, scroll.current)}
      />
      {/* light veil — leave room for particles / orbs to read */}
      <div className="absolute inset-0" style={{ background: "var(--ambient-veil)" }} />
    </div>
  );
}

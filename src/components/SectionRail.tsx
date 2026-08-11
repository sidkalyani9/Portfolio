import { useMemo, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useScrollTo } from "@/components/SmoothScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { activeIndexFromJourney } from "@/three/journeyGraph";
import { cn } from "@/lib/cn";

/**
 * Mobile journey HUD — sits at the bottom, never steals horizontal space.
 * Thin progress + current node only. No right-edge sticky rail.
 */
export function SectionRail() {
  const isMobileLayout = useMediaQuery("(max-width: 899px)");
  const { journey, nodes, mode } = useScrollProgress();
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollToId, scrollToY } = useScrollTo();

  const active = activeIndexFromJourney(journey, nodes.length);

  const items = useMemo(
    () =>
      nodes.map((n, i) => ({
        id: n.id,
        label: n.label,
        sub: n.sub,
        index: i,
      })),
    [nodes],
  );

  if (!isMobileLayout) return null;
  if (items.length < 2) return null;

  const current = items[active] ?? items[0];
  const pct = Math.round(Math.min(1, Math.max(0, journey)) * 100);

  const go = (e: MouseEvent, id: string, index: number) => {
    e.preventDefault();
    if (mode === "case-study") {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const t = items.length <= 1 ? 0 : index / (items.length - 1);
      scrollToY(max * t);
      return;
    }
    if (location.pathname === "/") {
      if (id === "home") {
        scrollToY(0);
        window.history.replaceState(null, "", "/");
      } else {
        scrollToId(id);
        window.history.replaceState(null, "", `/#${id}`);
      }
    } else {
      navigate(id === "home" ? "/" : `/#${id}`);
    }
  };

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] max-[899px]:flex min-[900px]:hidden"
      aria-hidden={false}
    >
      <nav
        className="pointer-events-auto w-full max-w-md"
        aria-label="Section progress"
      >
        <div className="rounded-2xl border border-border/70 bg-bg-0/75 px-3.5 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {/* progress track */}
          <div
            className="mb-2 h-[3px] overflow-hidden rounded-full bg-white/8"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Page journey"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet to-accent transition-[width] duration-300 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 font-mono text-[11px] leading-none">
              <span className="text-accent">{current.label}</span>
              <span className="text-fg-2/50"> · </span>
              <span className="text-fg-2">{current.sub}</span>
            </p>
            <span className="shrink-0 font-mono text-[10px] tabular-nums text-fg-2">
              {String(active + 1).padStart(2, "0")}
              <span className="text-fg-2/40">
                /{String(items.length).padStart(2, "0")}
              </span>
            </span>
          </div>

          {/* compact dots — no expanding labels */}
          <ol className="mt-2 flex items-center justify-between gap-0.5">
            {items.map((item) => {
              const isActive = item.index === active;
              const isPassed = item.index < active;
              return (
                <li key={item.id} className="flex-1">
                  <button
                    type="button"
                    onClick={(e) => go(e, item.id, item.index)}
                    className={cn(
                      "flex w-full touch-manipulation items-center justify-center py-1",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
                    )}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`Go to ${item.label}`}
                  >
                    <span
                      className={cn(
                        "block h-1.5 rounded-full transition-all duration-300",
                        isActive
                          ? "w-4 bg-accent shadow-[0_0_8px_rgba(199,125,255,0.7)]"
                          : isPassed
                            ? "w-1.5 bg-violet/70"
                            : "w-1.5 bg-fg-2/35",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </div>
  );
}

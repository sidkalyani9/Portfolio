import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DUR, EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { useIntroControls } from "@/components/Boot";

type CursorState = "default" | "link" | "view" | "text" | "control";

/**
 * Terminal-caret custom cursor — Motion B lag + violet heritage glow.
 */
export function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const { introVisible } = useIntroControls();
  const active = fine && !reduced && !introVisible;

  const rootRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      document.documentElement.classList.remove("fx-cursor");
      return;
    }
    document.documentElement.classList.add("fx-cursor");
    const el = rootRef.current;
    if (!el) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, x: innerWidth / 2, y: innerHeight / 2 });
    const xTo = gsap.quickTo(el, "x", {
      duration: DUR.cursorRing,
      ease: EASE_OUT_EXPO,
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: DUR.cursorRing,
      ease: EASE_OUT_EXPO,
    });

    const onMove = (e: PointerEvent) => {
      setVisible(true);
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const tagged = t.closest<HTMLElement>("[data-cursor]");
      if (tagged) {
        setState((tagged.dataset.cursor as CursorState) || "default");
        return;
      }
      if (t.closest("a, button, [role='button'], input, textarea, [role='tab']")) {
        setState("link");
        return;
      }
      setState("default");
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("fx-cursor");
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[200] transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className={cn(
          "grid place-items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          state === "default" &&
            "h-3.5 w-2 bg-accent shadow-[0_0_18px_rgba(var(--accent-rgb),0.45)]",
          state === "link" &&
            "h-9 w-9 rounded-full border border-accent/80 bg-accent/10 backdrop-blur-[2px]",
          state === "control" &&
            "h-11 w-11 rounded-full border border-accent/50",
          state === "view" &&
            "h-20 w-20 rounded-full bg-accent text-on-accent shadow-[0_0_50px_rgba(var(--accent-rgb),0.35)]",
          state === "text" && "h-6 w-[3px] bg-accent",
        )}
      >
        {state === "view" ? (
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em]">
            open ↗
          </span>
        ) : null}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

type CursorState = "default" | "link" | "view" | "text" | "menu";

const LABELS: Partial<Record<CursorState, string>> = {
  view: "View",
  link: "Open",
  menu: "Menu",
};

/**
 * Morphing dual-ring custom cursor — Awwwards craft.
 * Outer ring lags; core snaps; contextual labels on data-cursor.
 */
export function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const active = fine && !reduced;

  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!active) {
      document.documentElement.classList.remove("fx-cursor");
      return;
    }
    document.documentElement.classList.add("fx-cursor");
    const core = coreRef.current;
    const ring = ringRef.current;
    if (!core || !ring) return;

    gsap.set([core, ring], {
      xPercent: -50,
      yPercent: -50,
      x: innerWidth / 2,
      y: innerHeight / 2,
    });
    const coreX = gsap.quickTo(core, "x", { duration: 0.16, ease: "power3.out" });
    const coreY = gsap.quickTo(core, "y", { duration: 0.16, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "expo.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "expo.out" });

    const onMove = (e: PointerEvent) => {
      setVisible(true);
      coreX(e.clientX);
      coreY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const tagged = t.closest<HTMLElement>("[data-cursor]");
      if (tagged) {
        const s = (tagged.dataset.cursor as CursorState) || "default";
        setState(s);
        setLabel(tagged.dataset.cursorLabel || LABELS[s] || "");
        return;
      }
      if (t.closest("a, button, [role='button'], [role='tab']")) {
        setState("link");
        setLabel("Open");
        return;
      }
      if (t.closest("input, textarea, [contenteditable]")) {
        setState("text");
        setLabel("");
        return;
      }
      setState("default");
      setLabel("");
    };

    const onDown = () => {
      gsap.to(ring, { scale: 0.75, duration: 0.25, ease: "power2.out" });
    };
    const onUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.45, ease: "expo.out" });
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("fx-cursor");
    };
  }, [active]);

  if (!active) return null;

  const big = state === "view" || state === "menu";
  const ring = state === "link" || big;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[201] grid place-items-center rounded-full border transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
          visible ? "opacity-100" : "opacity-0",
          state === "default" && "h-8 w-8 border-fg-0/25",
          state === "link" && "h-12 w-12 border-accent/70 bg-accent/5",
          big &&
            "h-[5.5rem] w-[5.5rem] border-transparent bg-accent text-bg-0 shadow-[0_0_60px_rgba(46,230,166,0.35)]",
          state === "text" && "h-6 w-6 border-accent/40 opacity-40",
        )}
      >
        {big && label ? (
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em]">
            {label}
          </span>
        ) : null}
      </div>
      <div
        ref={coreRef}
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[202] rounded-full bg-accent mix-blend-difference transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          visible ? "opacity-100" : "opacity-0",
          state === "default" && "h-2 w-2",
          state === "link" && "h-1.5 w-1.5",
          big && "h-0 w-0 opacity-0",
          state === "text" && "h-5 w-[2px] rounded-sm",
          ring && !big && "bg-fg-0",
        )}
      />
    </>
  );
}

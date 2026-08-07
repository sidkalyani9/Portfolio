import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

type Props = {
  /** Project rows that may show a floating cover on hover */
  items: { id: string; src: string | null; title: string }[];
  className?: string;
};

/**
 * Dennis Snellenberg pattern — image follows the cursor while hovering a list.
 * Parent should wrap list items that set data-preview-id.
 */
export function HoverPreview({ items, className }: Props) {
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const enabled = fine && !reduced;
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const map = useRef(new Map(items.map((i) => [i.id, i])));
  map.current = new Map(items.map((i) => [i.id, i]));

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    gsap.set(el, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "expo.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "expo.out" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-preview-id]");
      if (!t) {
        setVisible(false);
        setActive(null);
        return;
      }
      const id = t.dataset.previewId || null;
      const item = id ? map.current.get(id) : null;
      if (!item?.src) {
        setVisible(false);
        setActive(null);
        return;
      }
      setActive(id);
      setVisible(true);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  const current = active ? map.current.get(active) : null;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[90] w-[min(22rem,40vw)] overflow-hidden rounded-2xl border border-border bg-bg-1 shadow-[0_30px_80px_rgba(0,0,0,0.55)] transition-opacity duration-300",
        visible && current?.src ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {items.map((item) =>
        item.src ? (
          <img
            key={item.id}
            src={item.src}
            alt=""
            className={cn(
              "absolute inset-0 aspect-[16/11] h-full w-full object-cover transition-opacity duration-300",
              active === item.id ? "opacity-100" : "opacity-0",
            )}
          />
        ) : null,
      )}
      {/* size box */}
      <div className="aspect-[16/11] w-full" />
    </div>
  );
}

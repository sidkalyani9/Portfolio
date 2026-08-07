import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function Preloader() {
  const [done, setDone] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const preferReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const max = preferReduce ? 200 : 900;
    const t = window.setTimeout(() => setDone(true), max);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setHide(true), 500);
    return () => window.clearTimeout(t);
  }, [done]);

  if (hide) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[80] grid place-items-center bg-bg-0 transition-opacity duration-500",
        done ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      aria-hidden={done}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-accent/30 bg-bg-2 font-sans text-lg font-bold text-accent shadow-[0_0_40px_rgba(199,125,255,0.15)]">
          SK
        </div>
        <div className="h-0.5 w-28 overflow-hidden rounded-full bg-bg-2">
          <div className="h-full w-full origin-left animate-pulse bg-accent" />
        </div>
      </div>
    </div>
  );
}

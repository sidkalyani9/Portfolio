import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useBootComplete } from "@/components/Boot";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

const BOOT_LINES = [
  "initializing runtime v2.6.0",
  "mounting /dev/skills · /dev/systems",
  "loading glyph atlas [OK]",
  "warming kv-cache …",
  "serving 1B+ tokens of experience",
  "ready",
] as const;

const MIN_MS = 1750;

/**
 * Cinematic boot sequence — log lines with timestamps, an epoch-style
 * progress bar synced to *real* page readiness, then a curtain lift.
 */
export function BootPreloader() {
  const complete = useBootComplete();
  const reduced = usePrefersReducedMotion();
  const [lines, setLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  // Reduced motion: skip the theater entirely.
  useEffect(() => {
    if (reduced) {
      setGone(true);
      complete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const t0 = performance.now();
    let pageReady = document.readyState === "complete";
    const onLoad = () => (pageReady = true);
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(() => (pageReady = true)).catch(() => {});

    // Line + progress schedule
    const timers: number[] = [];
    BOOT_LINES.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setLines(i + 1), 180 + i * 260),
      );
    });

    // Smooth progress toward ~92%, holding until the page is truly ready
    const progressTimer = window.setInterval(() => {
      setProgress((p) => {
        const target = pageReady ? 100 : 92;
        if (p >= target) return p;
        return Math.min(target, p + Math.random() * 7 + 2.5);
      });
    }, 90);

    const finish = window.setInterval(() => {
      const elapsed = performance.now() - t0;
      if (elapsed > MIN_MS && pageReady && !doneRef.current) {
        doneRef.current = true;
        window.clearInterval(progressTimer);
        setProgress(100);
        setLines(BOOT_LINES.length);
        timers.push(
          window.setTimeout(() => setExiting(true), 320),
          window.setTimeout(() => {
            setGone(true);
            complete();
          }, 320 + 900),
        );
        window.clearInterval(finish);
      }
      // hard cap — never hold the page hostage
      if (elapsed > 3400 && !doneRef.current) {
        doneRef.current = true;
        window.clearInterval(progressTimer);
        setProgress(100);
        setExiting(true);
        timers.push(
          window.setTimeout(() => {
            setGone(true);
            complete();
          }, 900),
        );
        window.clearInterval(finish);
      }
    }, 120);

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearInterval(progressTimer);
      window.clearInterval(finish);
      timers.forEach((t) => window.clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Curtain lift
  useEffect(() => {
    if (!exiting || !rootRef.current) return;
    gsap.to(rootRef.current, {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.9,
      ease: "expo.inOut",
    });
  }, [exiting]);

  if (gone) return null;

  const shown = BOOT_LINES.slice(0, lines);
  const blocks = 22;
  const filled = Math.round((progress / 100) * blocks);

  return (
    <div
      ref={rootRef}
      className={cn("fixed inset-0 z-[120] bg-bg-0", exiting && "pointer-events-none")}
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-hidden={exiting}
      role="status"
      aria-label="Loading"
    >
      <div className="flex h-full flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          <p className="font-mono text-xs text-fg-2">
            <span className="text-accent">siddharth</span>@portfolio:~${" "}
            <span className="text-fg-0">./boot</span>
          </p>

          <div className="mt-6 min-h-[9.5rem] font-mono text-[13px] leading-6">
            {shown.map((line, i) => (
              <p key={line} className="flex gap-3 text-fg-1">
                <span className="shrink-0 text-fg-2/70">
                  [{(0.2 + i * 0.31).toFixed(4).padStart(7, "0")}s]
                </span>
                <span className={cn(i === shown.length - 1 && line === "ready" && "text-accent")}>
                  {line}
                  {line === "ready" ? " ✓" : ""}
                </span>
              </p>
            ))}
            {lines < BOOT_LINES.length ? (
              <span className="caret-blink mt-1 inline-block h-3.5 w-2 bg-accent" />
            ) : null}
          </div>

          <div className="mt-8 font-mono text-xs text-fg-2">
            <div className="flex items-center justify-between">
              <span>epoch 1/1</span>
              <span className="tabular-nums text-fg-1">{Math.floor(progress)}%</span>
            </div>
            <div className="mt-2 tracking-tight text-accent" aria-hidden>
              {"█".repeat(filled)}
              <span className="text-fg-2/40">{"░".repeat(blocks - filled)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

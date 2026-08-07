import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useBootComplete } from "@/components/Boot";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/** Multilingual greetings — Gujarati included for home. */
const GREETINGS = [
  "Hello",
  "નમસ્તે",
  "Bonjour",
  "こんにちは",
  "Hola",
  "Ciao",
  "السلام عليكم",
  "Welcome",
] as const;

const MIN_MS = 2200;

/**
 * Option B preloader — rotating multilingual greeting + counter,
 * then a soft curtain lift. Dennis Snellenberg school.
 */
export function BootPreloader() {
  const complete = useBootComplete();
  const reduced = usePrefersReducedMotion();
  const [greetIdx, setGreetIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (reduced) {
      setGone(true);
      complete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // rotate greetings
  useEffect(() => {
    if (reduced || exiting || gone) return;
    const id = window.setInterval(() => {
      setGreetIdx((i) => (i + 1) % GREETINGS.length);
    }, 280);
    return () => window.clearInterval(id);
  }, [reduced, exiting, gone]);

  // word flash
  useEffect(() => {
    if (!wordRef.current || reduced) return;
    gsap.fromTo(
      wordRef.current,
      { autoAlpha: 0.3, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" },
    );
  }, [greetIdx, reduced]);

  useEffect(() => {
    if (reduced) return;
    const t0 = performance.now();
    let pageReady = document.readyState === "complete";
    const onLoad = () => (pageReady = true);
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(() => (pageReady = true)).catch(() => {});

    const progressTimer = window.setInterval(() => {
      setProgress((p) => {
        const target = pageReady ? 100 : 90;
        if (p >= target) return p;
        return Math.min(target, p + Math.random() * 6 + 2);
      });
    }, 70);

    const timers: number[] = [];
    const finish = window.setInterval(() => {
      const elapsed = performance.now() - t0;
      if (elapsed > MIN_MS && pageReady && !doneRef.current) {
        doneRef.current = true;
        window.clearInterval(progressTimer);
        setProgress(100);
        timers.push(
          window.setTimeout(() => setExiting(true), 280),
          window.setTimeout(() => {
            setGone(true);
            complete();
          }, 280 + 950),
        );
        window.clearInterval(finish);
      }
      if (elapsed > 3800 && !doneRef.current) {
        doneRef.current = true;
        window.clearInterval(progressTimer);
        setProgress(100);
        setExiting(true);
        timers.push(
          window.setTimeout(() => {
            setGone(true);
            complete();
          }, 950),
        );
        window.clearInterval(finish);
      }
    }, 100);

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearInterval(progressTimer);
      window.clearInterval(finish);
      timers.forEach((t) => window.clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => {
    if (!exiting || !rootRef.current) return;
    gsap.to(rootRef.current, {
      yPercent: -100,
      duration: 1.05,
      ease: "expo.inOut",
    });
  }, [exiting]);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className={cn(
        "fixed inset-0 z-[120] flex flex-col items-center justify-center bg-bg-0",
        exiting && "pointer-events-none",
      )}
      role="status"
      aria-label="Loading"
      aria-hidden={exiting}
    >
      <p
        ref={wordRef}
        className="font-display text-[clamp(2.8rem,10vw,7rem)] italic leading-none text-fg-0"
      >
        {GREETINGS[greetIdx]}
      </p>
      <div className="mt-10 flex w-[min(18rem,70vw)] flex-col gap-2">
        <div className="flex items-center justify-between font-sans text-[11px] uppercase tracking-[0.22em] text-fg-2">
          <span>Loading</span>
          <span className="tabular-nums text-fg-0">
            {String(Math.floor(progress)).padStart(3, "0")}
          </span>
        </div>
        <div className="h-px w-full overflow-hidden bg-border">
          <div
            className="h-full bg-accent transition-[width] duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <p className="mt-8 font-sans text-[11px] uppercase tracking-[0.28em] text-fg-2">
        Siddharth Kalyani
      </p>
    </div>
  );
}

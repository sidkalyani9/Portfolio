import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useIntroControls } from "@/components/Boot";

export type IntroAnimation = (
  timeline: gsap.core.Timeline,
  root: HTMLDivElement,
  reveal: () => void,
) => void | (() => void);

/** Shared lifecycle: font readiness, cancellation, input locking and a bounded wait. */
export function useIntroAnimation(animate: IntroAnimation) {
  const { introVisible: visible, reveal, finish } = useIntroControls();
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!visible || !root) return;

    let cancelled = false;
    let fontTimeout: number | undefined;
    let disposeAnimation: void | (() => void);
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const context = gsap.context(() => {}, root);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const finishNow = () => {
      if (!cancelled) finish();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finishNow();
    };
    const onMotionChange = () => {
      if (reduced.matches) finishNow();
    };
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", finishNow);
    reduced.addEventListener("change", onMotionChange);
    // Even failed fonts or a paused animation must release the content.
    const deadline = window.setTimeout(finishNow, 4200);

    const fonts = Promise.allSettled([
      document.fonts.load('400 64px "Instrument Serif"'),
      document.fonts.load('italic 400 64px "Instrument Serif"'),
      document.fonts.load('400 16px "Inter"'),
      document.fonts.load('400 14px "IBM Plex Mono"'),
      document.fonts.load('600 14px "Syne"'),
      document.fonts.ready,
    ]).then(() => true);
    const boundedWait = new Promise<boolean>((resolve) => {
      fontTimeout = window.setTimeout(() => resolve(false), 900);
    });
    void Promise.race([fonts, boundedWait]).then((fontsReady) => {
      window.clearTimeout(fontTimeout);
      if (cancelled) return;
      // A late font swap would move the destination after it was measured.
      // On an unusually slow connection, release the page instead.
      if (!fontsReady || reduced.matches) {
        finishNow();
        return;
      }
      context.add(() => {
        const timeline = gsap.timeline({ onComplete: finishNow });
        disposeAnimation = animate(timeline, root, reveal);
      });
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fontTimeout);
      window.clearTimeout(deadline);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", finishNow);
      reduced.removeEventListener("change", onMotionChange);
      context.revert();
      disposeAnimation?.();
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [visible, reveal, finish, animate]);

  return { rootRef, visible };
}

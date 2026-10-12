import { useLayoutEffect, useRef } from "react";
import { useIntroControls } from "@/components/Boot";

export type IntroAnimation = (
  root: HTMLDivElement,
  reveal: () => void,
  finish: () => void,
) => () => void;

/** Shared lifecycle: font readiness, cancellation, input locking and a bounded wait. */
export function useIntroAnimation(animate: IntroAnimation) {
  const { introVisible: visible, reveal, finish } = useIntroControls();
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!visible || !root) return;

    let cancelled = false;
    let fontTimeout: number | undefined;
    let disposeAnimation: (() => void) | undefined;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
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
    const deadline = window.setTimeout(finishNow, 3400);

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
      // A late font swap would move the measured hero destination. Release the
      // page instead of animating toward unstable text on a slow connection.
      if (!fontsReady || reduced.matches) {
        finishNow();
        return;
      }
      disposeAnimation = animate(root, reveal, finishNow);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fontTimeout);
      window.clearTimeout(deadline);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", finishNow);
      reduced.removeEventListener("change", onMotionChange);
      disposeAnimation?.();
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [visible, reveal, finish, animate]);

  return { rootRef, visible };
}

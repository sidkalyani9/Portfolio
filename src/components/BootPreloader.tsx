import { profile } from "@/content/profile";
import { useIntroAnimation, type IntroAnimation } from "@/hooks/useIntroAnimation";
import "./intro.css";

const OPEN_AT = 650;
const OPEN_DURATION = 900;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_OPEN = "cubic-bezier(0.76, 0, 0.24, 1)";

const animateAperture: IntroAnimation = (root, reveal, finish) => {
  const name = root.querySelector<HTMLElement>(".intro-aperture-name")!;
  const seam = root.querySelector<HTMLElement>(".intro-aperture-seam")!;
  const top = root.querySelector<HTMLElement>(".intro-curtain--top")!;
  const bottom = root.querySelector<HTMLElement>(".intro-curtain--bottom")!;

  // A shared native clock keeps the whole opening on the compositor, even
  // while the page's initial JavaScript and WebGL setup occupy the main thread.
  const startTime = document.timeline.currentTime;
  const nameAnimation = name.animate([
    { offset: 0, opacity: 0, transform: "translate3d(0, 8px, 0)", easing: EASE_OUT },
    { offset: 480 / 820, opacity: 1, transform: "translate3d(0, 0, 0)" },
    { offset: 600 / 820, opacity: 1, transform: "translate3d(0, 0, 0)", easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" },
    { offset: 1, opacity: 0, transform: "translate3d(0, 0, 0)" },
  ], { duration: 820, delay: 30, fill: "both" });

  const seamAnimation = seam.animate([
    { offset: 0, opacity: 0, transform: "scaleX(0)", easing: EASE_OUT },
    { offset: 560 / 1110, opacity: 0.6, transform: "scaleX(0.16)" },
    { offset: 590 / 1110, opacity: 0.6, transform: "scaleX(0.16)", easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
    { offset: 1, opacity: 0, transform: "scaleX(1)" },
  ], { duration: 1110, delay: 60, fill: "both" });

  const curtainOptions: KeyframeAnimationOptions = {
    duration: OPEN_DURATION,
    delay: OPEN_AT,
    easing: EASE_OPEN,
    fill: "both",
  };
  const topAnimation = top.animate([
    { transform: "translate3d(0, 0, 0)" },
    { transform: "translate3d(0, -100%, 0)" },
  ], curtainOptions);
  const bottomAnimation = bottom.animate([
    { transform: "translate3d(0, 0, 0)" },
    { transform: "translate3d(0, 100%, 0)" },
  ], curtainOptions);

  const animations = [nameAnimation, seamAnimation, topAnimation, bottomAnimation];
  animations.forEach((animation) => { animation.startTime = startTime; });
  const revealTimer = window.setTimeout(reveal, OPEN_AT);
  bottomAnimation.onfinish = finish;

  return () => {
    window.clearTimeout(revealTimer);
    bottomAnimation.onfinish = null;
    animations.forEach((animation) => animation.cancel());
  };
};

/** A fine seam becomes an opening onto the atmospheric homepage. */
export function BootPreloader() {
  const { rootRef, visible } = useIntroAnimation(animateAperture);
  if (!visible) return null;

  return (
    <div ref={rootRef} className="intro-overlay intro-aperture" data-intro="aperture" data-lenis-prevent role="status" aria-label="Loading portfolio">
      <div className="intro-curtain intro-curtain--top" aria-hidden="true" />
      <div className="intro-curtain intro-curtain--bottom" aria-hidden="true" />
      <p className="intro-aperture-name" aria-hidden="true">{profile.name}</p>
      <div className="intro-aperture-seam" aria-hidden="true" />
    </div>
  );
}

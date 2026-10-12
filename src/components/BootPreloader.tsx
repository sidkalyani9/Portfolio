import { useIntroAnimation, type IntroAnimation } from "@/hooks/useIntroAnimation";
import { CSS_EASE_OUT_EXPO } from "@/lib/motion";
import "./intro.css";

const OPEN_AT = 1550;
const OPEN_DURATION = 1100;
const EASE_LINE = "cubic-bezier(0.45, 0, 0.55, 1)";
const EASE_OPEN = "cubic-bezier(0.76, 0, 0.24, 1)";

const animateAperture: IntroAnimation = (root, reveal, finish) => {
  const stage = root.querySelector<HTMLElement>("[data-intro-stage]")!;
  const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-intro-title] > span"));
  const seam = root.querySelector<HTMLElement>(".intro-aperture-seam")!;
  const top = root.querySelector<HTMLElement>(".intro-curtain--top")!;
  const bottom = root.querySelector<HTMLElement>(".intro-curtain--bottom")!;

  if (targets.length !== 2) {
    finish();
    return () => {};
  }

  // Read the final layout once, with fonts loaded and the role line reserved.
  // The actual hero markup supplies identical glyphs, spacing and italic masks.
  const metrics = targets.map((target) => ({
    rect: target.getBoundingClientRect(),
    textWidth: target.firstElementChild!.getBoundingClientRect().width,
    style: getComputedStyle(target),
  }));
  const { width, height } = root.getBoundingClientRect();
  const fontSize = parseFloat(metrics[0].style.fontSize);
  const gap = fontSize * 0.28;
  const textWidth = metrics[0].textWidth + gap + metrics[1].textWidth;
  const compactSize = Math.min(56, Math.max(24, width * 0.035));
  const scale = Math.min(compactSize / fontSize, (width - 48) / textWidth);
  const startX = (width - textWidth * scale) / 2;
  const startY = height / 2 - Math.min(80, Math.max(44, height * 0.07))
    - Math.max(...metrics.map(({ rect }) => rect.height)) * scale;

  const words = targets.map((target, index) => {
    const { rect, style } = metrics[index];
    const word = target.cloneNode(true) as HTMLElement;
    word.removeAttribute("aria-label");
    word.setAttribute("data-intro-word", String(index));
    word.classList.add("intro-aperture-word");
    Object.assign(word.style, {
      position: "absolute", left: "0", top: "0", margin: "0",
      width: `${rect.width}px`, height: `${rect.height}px`,
      visibility: "visible", fontFamily: style.fontFamily,
      fontSize: style.fontSize, fontWeight: style.fontWeight,
      fontStyle: style.fontStyle, lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing, textTransform: style.textTransform,
      color: style.color, filter: "none", transformOrigin: "0 0",
      willChange: "transform",
    });
    word.querySelectorAll<HTMLElement>("[data-char]").forEach((char) => {
      char.style.transform = "translate3d(0, 112%, 0)";
    });
    return word;
  });
  stage.replaceChildren(...words);

  // Both the letter rise and the word travel run on the browser's clock.
  // Build the path once; no per-frame JavaScript or layout reads are needed.
  const startTime = document.timeline.currentTime;
  const letterAnimations: Animation[] = [];
  const nameAnimations = words.map((word, index) => {
    const x = startX + (index === 0 ? 0 : (metrics[0].textWidth + gap) * scale);
    const compact = `translate3d(${x}px, ${startY}px, 0) scale(${scale})`;
    word.style.transform = compact;
    word.querySelectorAll<HTMLElement>("[data-char]").forEach((char, charIndex) => {
      const rise = char.animate([
        { transform: "translate3d(0, 112%, 0)" },
        { transform: "translate3d(0, 0, 0)" },
      ], {
        duration: 1050,
        delay: (index === 0 ? 50 : 210) + charIndex * 45,
        easing: CSS_EASE_OUT_EXPO,
        fill: "both",
      });
      rise.id = `intro-letter-${index}-${charIndex}`;
      letterAnimations.push(rise);
    });

    const { rect } = metrics[index];
    // Overlap the gentle row separation with travel, instead of stopping at a
    // waypoint. The rows clear each other before scaling or moving together.
    const separation = (index === 0 ? -0.5 : 0.5) * (metrics[0].rect.height + 4) * scale;
    const path = Array.from({ length: 61 }, (_, frame): Keyframe => {
      const t = frame / 60;
      const unfold = 1 - (1 - Math.min(t / 0.3, 1)) ** 3;
      const p = Math.max(0, (t - 0.16) / 0.84);
      // Quintic ease: zero velocity and acceleration at either end.
      const travel = p * p * p * (p * (p * 6 - 15) + 10);
      const fromY = startY + separation * unfold;
      return {
        offset: t,
        transform: `translate3d(${x + (rect.left - x) * travel}px, ${fromY + (rect.top - fromY) * travel}px, 0) scale(${scale + (1 - scale) * travel})`,
      };
    });
    const animation = word.animate(path, { delay: OPEN_AT, duration: OPEN_DURATION, fill: "both" });
    animation.id = `intro-word-${index}`;
    return animation;
  });

  const seamAnimation = seam.animate([
    { offset: 0, opacity: 0, transform: "scaleX(0)", easing: EASE_LINE },
    { offset: 1150 / 2150, opacity: 0.6, transform: "scaleX(0.22)", easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
    { offset: 1, opacity: 0, transform: "scaleX(1)" },
  ], { duration: 2150, delay: 120, fill: "both" });

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

  const animations = [...letterAnimations, ...nameAnimations, seamAnimation, topAnimation, bottomAnimation];
  animations.forEach((animation) => { animation.startTime = startTime; });
  const revealTimer = window.setTimeout(reveal, OPEN_AT);
  bottomAnimation.onfinish = finish;

  return () => {
    window.clearTimeout(revealTimer);
    bottomAnimation.onfinish = null;
    animations.forEach((animation) => animation.cancel());
    stage.replaceChildren();
  };
};

/** The aperture opens while its compact title becomes the hero title. */
export function BootPreloader() {
  const { rootRef, visible } = useIntroAnimation(animateAperture);
  if (!visible) return null;

  return (
    <div ref={rootRef} className="intro-overlay intro-aperture" data-intro="aperture-title" data-lenis-prevent role="status" aria-label="Loading portfolio">
      <div className="intro-curtain intro-curtain--top" aria-hidden="true" />
      <div className="intro-curtain intro-curtain--bottom" aria-hidden="true" />
      <div className="intro-aperture-seam" aria-hidden="true" />
      <div className="intro-aperture-title" data-intro-stage aria-hidden="true" />
    </div>
  );
}

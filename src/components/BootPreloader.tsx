import { useIntroAnimation, type IntroAnimation } from "@/hooks/useIntroAnimation";
import "./intro.css";

const OPEN_AT = 650;
const OPEN_DURATION = 900;
const UNFOLD_AT = OPEN_AT + 180;
const COMPLETE_AT = OPEN_AT + OPEN_DURATION;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
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
      willChange: "transform, opacity",
    });
    word.querySelectorAll<HTMLElement>("[data-char]").forEach((char) => {
      // One composited layer per word; individual letters are static here.
      char.style.transform = "none";
      char.style.willChange = "auto";
    });
    return word;
  });
  stage.replaceChildren(...words);

  // All five animations share the browser's clock. No per-frame JavaScript or
  // layout reads compete with initial page/scene work during the handoff.
  const startTime = document.timeline.currentTime;
  const nameAnimations = words.map((word, index) => {
    const x = startX + (index === 0 ? 0 : (metrics[0].textWidth + gap) * scale);
    const compact = `translate3d(${x}px, ${startY}px, 0) scale(${scale})`;
    // Give the words their own rows before they grow and converge horizontally.
    // This keeps the final H and first K from crossing during the single-line
    // to two-line transition, while the aperture begins to open beneath them.
    const unfoldY = startY + (index === 0 ? -0.5 : 0.5)
      * (metrics[0].rect.height + 4) * scale;
    const { rect } = metrics[index];
    const animation = word.animate([
      { offset: 0, opacity: 0, transform: `translate3d(${x}px, ${startY + 8}px, 0) scale(${scale})` },
      { offset: 30 / COMPLETE_AT, opacity: 0, transform: `translate3d(${x}px, ${startY + 8}px, 0) scale(${scale})`, easing: EASE_OUT },
      { offset: 510 / COMPLETE_AT, opacity: 1, transform: compact },
      { offset: OPEN_AT / COMPLETE_AT, opacity: 1, transform: compact, easing: EASE_OUT },
      { offset: UNFOLD_AT / COMPLETE_AT, opacity: 1, transform: `translate3d(${x}px, ${unfoldY}px, 0) scale(${scale})`, easing: EASE_OPEN },
      { offset: 1, opacity: 1, transform: `translate3d(${rect.left}px, ${rect.top}px, 0) scale(1)` },
    ], { duration: COMPLETE_AT, fill: "both" });
    animation.id = `intro-word-${index}`;
    return animation;
  });

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

  const animations = [...nameAnimations, seamAnimation, topAnimation, bottomAnimation];
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

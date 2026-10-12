import gsap from "gsap";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { useIntroAnimation, type IntroAnimation } from "@/hooks/useIntroAnimation";
import "./intro.css";

const TRAVEL_START = 1.5;
const TRAVEL_DURATION = 1.05;

const animateSignature: IntroAnimation = (timeline, root, reveal) => {
  const stage = root.querySelector<HTMLElement>("[data-intro-stage]")!;
  const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-intro-title] > span"));
  const backdrop = root.querySelector(".intro-backdrop");
  if (targets.length !== 2) {
    timeline.call(reveal).to(backdrop, { opacity: 0, duration: 0.35 });
    return;
  }

  // Read the final layout once, after fonts settle. All frames afterward use
  // transforms and opacity; the moving text has the hero's actual letter markup.
  const metrics = targets.map((target) => ({
    rect: target.getBoundingClientRect(),
    style: getComputedStyle(target),
  }));
  const [first, second] = metrics;
  const width = Math.max(first.rect.width, second.rect.width);
  const scale = Math.min(root.clientWidth * 0.76, 480) / width;
  const gap = Math.max(0, second.rect.top - first.rect.bottom);
  const groupHeight = (first.rect.height + gap + second.rect.height) * scale;
  const startX = (root.clientWidth - width * scale) / 2;
  const startY = (root.clientHeight - groupHeight) / 2 - root.clientHeight * 0.02;

  stage.replaceChildren();
  targets.forEach((target, index) => {
    const { rect, style } = metrics[index];
    const word = target.cloneNode(true) as HTMLElement;
    word.removeAttribute("aria-label");
    word.setAttribute("data-intro-word", String(index));
    // The hero's h1 supplies some inherited styles. Freeze those on each clone
    // so its size, italic, spacing, mask and baseline match at the handoff.
    Object.assign(word.style, {
      position: "absolute",
      left: "0",
      top: "0",
      margin: "0",
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      visibility: "visible",
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      textTransform: style.textTransform,
      color: style.color,
      filter: "none",
      transformOrigin: "0 0",
      willChange: "transform",
    });
    stage.append(word);
    const chars = word.querySelectorAll<HTMLElement>("[data-char]");
    gsap.set(word, {
      x: startX,
      y: startY + (index === 0 ? 0 : (first.rect.height + gap) * scale),
      scale,
    });
    timeline
      .fromTo(chars,
        { y: 0, yPercent: 112 },
        { yPercent: 0, duration: 1.05, stagger: 0.045, ease: EASE_OUT_EXPO },
        index === 0 ? 0.05 : 0.21)
      .to(word, {
        x: rect.left,
        y: rect.top,
        scale: 1,
        duration: TRAVEL_DURATION,
        ease: "power3.inOut",
      }, TRAVEL_START);
  });

  timeline
    .call(reveal, [], TRAVEL_START + 0.65)
    .to(backdrop, { opacity: 0, duration: 0.87, ease: "power2.inOut" }, TRAVEL_START + 0.18);

  return () => stage.replaceChildren();
};

/** The opening title becomes the hero title in one continuous motion. */
export function BootPreloader() {
  const { rootRef, visible } = useIntroAnimation(animateSignature);
  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="intro-overlay intro-signature"
      data-intro="signature"
      data-lenis-prevent
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="intro-backdrop" aria-hidden="true" />
      <div data-intro-stage aria-hidden="true" />
    </div>
  );
}

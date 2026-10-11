import { profile } from "@/content/profile";
import { useIntroAnimation, type IntroAnimation } from "@/hooks/useIntroAnimation";
import "./intro.css";

const animateAperture: IntroAnimation = (timeline, root, reveal) => {
  const name = root.querySelector(".intro-aperture-name");
  const seam = root.querySelector(".intro-aperture-seam");

  timeline
    .fromTo(name, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.48, ease: "power3.out" }, 0.03)
    .fromTo(seam, { scaleX: 0, opacity: 0 }, { scaleX: 0.16, opacity: 0.6, duration: 0.56, ease: "power3.out" }, 0.06)
    .to(name, { opacity: 0, duration: 0.22 }, 0.63)
    .to(seam, { scaleX: 1, opacity: 0, duration: 0.52, ease: "power2.inOut" }, 0.65)
    .call(reveal, [], 0.65)
    .to(root.querySelector(".intro-curtain--top"), { yPercent: -100, duration: 0.9, ease: "power3.inOut" }, 0.65)
    .to(root.querySelector(".intro-curtain--bottom"), { yPercent: 100, duration: 0.9, ease: "power3.inOut" }, 0.65);
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

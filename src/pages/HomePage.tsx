import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSection } from "@/sections/HeroSection";
import { TelemetrySection } from "@/sections/TelemetrySection";
import { AboutSection } from "@/sections/AboutSection";
import { ExperienceSection } from "@/sections/ExperienceSection";
import { PipelineSection } from "@/sections/PipelineSection";
import { SystemsSection } from "@/sections/SystemsSection";
import { AwardsSection } from "@/sections/AwardsSection";
import { HackathonSection } from "@/sections/HackathonSection";
import { WorkSection } from "@/sections/WorkSection";
import { ContactSection } from "@/sections/ContactSection";
import { useReveal } from "@/hooks/useReveal";
import { useScrollTo } from "@/components/SmoothScroll";
import { HEADER_OFFSET, HEADER_OFFSET_MOBILE } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Restore hash targets after remounting home (e.g. back from case study).
 * The journey sticky track is very tall — Lenis must resize after layout
 * or scroll stops short (often around Experience).
 */
function useHashRestore() {
  const { hash, pathname } = useLocation();
  const { scrollToId, refreshLayout, lenis } = useScrollTo();
  const lastHash = useRef<string>("");

  useEffect(() => {
    if (pathname !== "/") return;
    if (!hash) {
      lastHash.current = "";
      return;
    }

    const id = hash.replace("#", "");
    if (!id) return;

    // Always re-run when landing with a hash from another route
    lastHash.current = hash;
    let cancelled = false;

    const targetY = () => {
      const el = document.getElementById(id);
      if (!el) return null;
      const offset =
        window.matchMedia("(max-width: 899px)").matches
          ? HEADER_OFFSET_MOBILE
          : HEADER_OFFSET;
      return Math.max(
        0,
        el.getBoundingClientRect().top + window.scrollY - offset,
      );
    };

    const go = () => {
      if (cancelled) return;
      refreshLayout();
      ScrollTrigger.refresh();
      // Prefer scrollToId (handles duration / Lenis)
      scrollToId(id);
    };

    // Correct again after tall sticky tracks + images settle.
    // If we're still short of the target, re-issue scroll.
    const correct = () => {
      if (cancelled) return;
      refreshLayout();
      const y = targetY();
      if (y == null) return;
      const current =
        (lenis as unknown as { animatedScroll?: number } | null)?.animatedScroll ??
        lenis?.scroll ??
        window.scrollY;
      // if more than ~120px short of target, fix
      if (Math.abs(current - y) > 120) {
        scrollToId(id);
      }
    };

    // wipe finishes ~1s; first attempt after paint + short delay
    const t0 = window.setTimeout(go, 80);
    const t1 = window.setTimeout(go, 350);
    const t2 = window.setTimeout(correct, 700);
    const t3 = window.setTimeout(correct, 1200);
    const t4 = window.setTimeout(correct, 2000);

    return () => {
      cancelled = true;
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [hash, pathname, scrollToId, refreshLayout, lenis]);
}

export function HomePage() {
  useReveal();
  useHashRestore();

  return (
    <>
      <HeroSection />
      <TelemetrySection />
      <AboutSection />
      <ExperienceSection />
      <PipelineSection />
      <SystemsSection />
      <AwardsSection />
      <HackathonSection />
      <WorkSection />
      <ContactSection />
    </>
  );
}

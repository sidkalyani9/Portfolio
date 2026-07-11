import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HeroSection } from "@/sections/HeroSection";
import { AboutSection } from "@/sections/AboutSection";
import { ExperienceSection } from "@/sections/ExperienceSection";
import { SystemsSection } from "@/sections/SystemsSection";
import { HackathonSection } from "@/sections/HackathonSection";
import { WorkSection } from "@/sections/WorkSection";
import { ContactSection } from "@/sections/ContactSection";
import { useReveal } from "@/hooks/useReveal";
import { useScrollTo } from "@/components/SmoothScroll";

export function HomePage() {
  useReveal();
  const { hash } = useLocation();
  const { scrollToId } = useScrollTo();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const t = window.setTimeout(() => scrollToId(id), 80);
    return () => window.clearTimeout(t);
  }, [hash, scrollToId]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SystemsSection />
      <HackathonSection />
      <WorkSection />
      <ContactSection />
    </>
  );
}

import { HeroSection } from "@/sections/HeroSection";
import { ProofSection } from "@/sections/ProofSection";
import { BidStreamSection } from "@/sections/BidStreamSection";
import { HackathonSection } from "@/sections/HackathonSection";
import { WorkSection } from "@/sections/WorkSection";
import { ExperienceSection } from "@/sections/ExperienceSection";
import { AboutSection } from "@/sections/AboutSection";
import { ContactSection } from "@/sections/ContactSection";
import { useReveal } from "@/hooks/useReveal";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function HomePage() {
  useReveal();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      // allow layout + lenis to settle
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [hash]);

  return (
    <>
      <HeroSection />
      <ProofSection />
      <BidStreamSection />
      <HackathonSection />
      <WorkSection />
      <ExperienceSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}

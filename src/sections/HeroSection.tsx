import { lazy, Suspense } from "react";
import { ArrowDownRight } from "lucide-react";
import { profile } from "@/content/profile";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/fx/Magnetic";
import { SplitText } from "@/components/fx/SplitText";
import { Marquee } from "@/components/fx/Marquee";
import { TextRoll } from "@/components/fx/TextRoll";
import { useResumeHref } from "@/hooks/useResumeHref";
import { useBooted } from "@/components/Boot";
import { useScrollTo } from "@/components/SmoothScroll";

const GlyphField = lazy(() =>
  import("@/three/GlyphField").then((m) => ({ default: m.GlyphField })),
);

const HERO_MARQUEE = [
  "Multi-agent systems",
  "GraphRAG",
  "Vertex AI",
  "1B+ tokens",
  "80% cost cut",
  "Forward-Deployed",
  "Production GenAI",
] as const;

export function HeroSection() {
  const resume = useResumeHref();
  const booted = useBooted();
  const { scrollToId } = useScrollTo();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-24"
      aria-label="Introduction"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_10%,rgba(199,125,255,0.12),transparent_45%),radial-gradient(ellipse_at_15%_85%,rgba(139,92,246,0.08),transparent_40%)]" />

      <Suspense fallback={null}>
        <GlyphField className="pointer-events-none absolute inset-0 z-0 opacity-70" />
      </Suspense>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(7,8,12,0.2)_0%,rgba(7,8,12,0.55)_55%,rgba(7,8,12,0.92)_100%)]" />

      <div className="container-page relative z-10 pb-10 pt-16 md:pb-14">
        <div
          className="flex flex-wrap items-center gap-3 text-sm text-fg-2 transition-opacity duration-700"
          style={{ opacity: booted ? 1 : 0 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-1/50 px-3 py-1 font-sans text-[11px] uppercase tracking-[0.18em]">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-accent" />
            Open to remote · {profile.location}
          </span>
        </div>

        <h1 className="mt-8 max-w-[18ch] font-display leading-[0.9] text-fg-0">
          <SplitText
            text="Siddharth"
            start={booted}
            delay={0.06}
            className="block text-[clamp(3.8rem,13vw,10rem)]"
          />
          <SplitText
            text="Kalyani"
            start={booted}
            delay={0.32}
            className="block text-[clamp(3.8rem,13vw,10rem)] italic text-accent"
          />
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
          <div>
            <p className="max-w-[22ch] font-display text-[clamp(1.55rem,3vw,2.35rem)] italic leading-[1.15] text-fg-0">
              AI/GenAI & Forward-Deployed Engineer crafting production LLM systems.
            </p>
            <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-fg-1 md:text-lg">
              {profile.oneLiner}
            </p>
          </div>

          <div
            className="flex flex-wrap items-center gap-3 transition-all duration-700 lg:justify-end"
            style={{
              opacity: booted ? 1 : 0,
              transform: booted ? "none" : "translateY(12px)",
            }}
          >
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToId("work")}
                data-cursor="view"
                data-cursor-label="Work"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-sans text-sm font-semibold text-bg-0 shadow-[0_10px_40px_rgba(199,125,255,0.22)] transition hover:brightness-110"
              >
                <TextRoll text="Selected work" />
                <ArrowDownRight size={16} aria-hidden />
              </button>
            </Magnetic>
            <Magnetic strength={0.28}>
              <ButtonLink to={resume.href} variant="outline" data-cursor="link">
                {resume.label}
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.28}>
              <ButtonLink
                to="https://www.linkedin.com/in/siddharth-kalyani/"
                variant="ghost"
                data-cursor="link"
              >
                LinkedIn
              </ButtonLink>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-y border-border bg-bg-0/40 py-4 backdrop-blur-sm">
        <Marquee items={HERO_MARQUEE} speed={40} />
      </div>
    </section>
  );
}

import { lazy, Suspense } from "react";
import { ArrowDownRight, MapPin } from "lucide-react";
import { profile } from "@/content/profile";
import { ButtonLink } from "@/components/ui/Button";
import { useResumeHref } from "@/hooks/useResumeHref";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const MicroOrb = lazy(() =>
  import("@/three/MicroOrb").then((m) => ({ default: m.MicroOrb })),
);

export function HeroSection() {
  const resume = useResumeHref();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduced = usePrefersReducedMotion();
  const showOrb = isDesktop && !reduced;

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-20"
      aria-label="Introduction"
    >
      {/* Quiet editorial void — restrained glow only */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgba(46,230,166,0.07),transparent_42%),radial-gradient(ellipse_at_10%_90%,rgba(225,29,72,0.05),transparent_40%)]" />

      {showOrb ? (
        <Suspense fallback={null}>
          <MicroOrb className="pointer-events-none absolute -right-4 top-1/2 z-0 h-[min(52vh,420px)] w-[min(46vw,420px)] -translate-y-1/2 opacity-90 md:right-[4%] lg:right-[8%]" />
        </Suspense>
      ) : null}

      <div className="container-page relative z-10 grid gap-12 py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:py-28">
        <div className="reveal max-w-xl">
          <div className="mb-8 inline-flex items-center gap-2 text-xs text-fg-2">
            <MapPin size={13} className="text-accent" aria-hidden />
            <span className="font-sans tracking-wide">
              {profile.location} · Open to remote
            </span>
          </div>

          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] text-fg-0">
            {profile.name}
          </h1>

          <p className="mt-4 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {profile.roleLine}
          </p>

          <div className="rule my-8 max-w-xs" />

          <p className="max-w-[18ch] font-display text-[clamp(1.75rem,3.5vw,2.65rem)] italic leading-[1.15] text-fg-0">
            Building end-to-end GenAI systems for high-stakes bidding.
          </p>

          <p className="mt-6 max-w-[38rem] text-base leading-relaxed text-fg-1 md:text-lg">
            {profile.oneLiner} Currently shipping on{" "}
            <strong className="font-medium text-fg-0">BidStreamAI</strong> at{" "}
            {profile.company}.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink to="/#bidstream">
              View BidStreamAI work
              <ArrowDownRight size={16} aria-hidden />
            </ButtonLink>
            <ButtonLink to={resume.href} variant="outline">
              {resume.label}
            </ButtonLink>
            <ButtonLink
              to="https://www.linkedin.com/in/siddharth-kalyani/"
              variant="ghost"
            >
              LinkedIn
            </ButtonLink>
          </div>
        </div>

        <aside className="reveal hidden lg:block" aria-label="Now">
          <div className="ml-auto max-w-sm border border-border bg-bg-1/40 p-7 backdrop-blur-sm">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-fg-2">
              Now
            </p>
            <p className="mt-4 font-display text-3xl text-fg-0">BidStreamAI</p>
            <p className="mt-3 text-sm leading-relaxed text-fg-1">
              Multi-agent proposal scoring, long-context RFP insights, catalog-grounded
              validation, and knowledge-base CV generation.
            </p>
            <ul className="mt-6 space-y-2 border-t border-border pt-5 text-sm text-fg-1">
              <li className="flex gap-2">
                <span className="text-ink">—</span> 6-agent scoring workflow
              </li>
              <li className="flex gap-2">
                <span className="text-ink">—</span> Persona classifier + DB cache
              </li>
              <li className="flex gap-2">
                <span className="text-ink">—</span> Org hackathon winner
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <a
        href="#proof"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 font-sans text-[10px] uppercase tracking-[0.28em] text-fg-2 transition hover:text-accent md:block"
      >
        Scroll
      </a>
    </section>
  );
}

import { lazy, Suspense } from "react";
import { ArrowDownRight, MapPin } from "lucide-react";
import { profile } from "@/content/profile";
import { ButtonLink } from "@/components/ui/Button";
import { useResumeHref } from "@/hooks/useResumeHref";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const HeroScene = lazy(() =>
  import("@/three/HeroScene").then((m) => ({ default: m.HeroScene })),
);

export function HeroSection() {
  const resume = useResumeHref();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduced = usePrefersReducedMotion();
  const show3d = isDesktop && !reduced;

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-20"
      aria-label="Introduction"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(46,230,166,0.12),transparent_50%),radial-gradient(ellipse_at_20%_80%,rgba(124,92,255,0.1),transparent_45%)]" />

      {show3d ? (
        <Suspense
          fallback={
            <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_70%_40%,rgba(46,230,166,0.08),transparent_40%)]" />
          }
        >
          <HeroScene />
        </Suspense>
      ) : (
        <div
          className="absolute inset-0 -z-0 opacity-60"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 75% 35%, rgba(46,230,166,0.14), transparent 28%), radial-gradient(circle at 60% 60%, rgba(124,92,255,0.1), transparent 32%)",
          }}
        />
      )}

      <div className="container-page relative z-10 grid gap-10 py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
        <div className="reveal max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-bg-1/70 px-3 py-1.5 text-xs text-fg-1 backdrop-blur">
            <MapPin size={14} className="text-accent" aria-hidden />
            {profile.location} · Open to remote
          </div>

          <p className="mb-2 font-display text-xl font-bold text-fg-0 sm:text-2xl">
            {profile.name}
          </p>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {profile.roleLine}
          </p>

          <h1 className="font-display text-[clamp(2.4rem,6vw,4.75rem)] font-extrabold text-fg-0">
            Building end-to-end{" "}
            <span className="bg-gradient-to-r from-accent to-[#7c5cff] bg-clip-text text-transparent">
              GenAI systems
            </span>{" "}
            for high-stakes bidding.
          </h1>

          <p className="mt-6 max-w-xl text-base text-fg-1 md:text-lg">
            {profile.oneLiner} Currently shipping on{" "}
            <strong className="font-semibold text-fg-0">BidStreamAI</strong> at{" "}
            {profile.company}.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
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

        <div className="reveal relative hidden lg:block" aria-hidden>
          <div className="ml-auto max-w-md rounded-3xl border border-border bg-bg-1/50 p-6 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-2">
              Now
            </p>
            <p className="mt-3 font-display text-2xl font-bold text-fg-0">
              BidStreamAI
            </p>
            <p className="mt-2 text-sm text-fg-1">
              Multi-agent proposal scoring · RFP insights · catalog-grounded
              validation · KB-powered CV generation
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["6 agents", "Persona cache", "Long-context", "Hackathon win"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-accent/20 bg-accent-dim px-2.5 py-1 text-[11px] font-medium text-accent"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      <a
        href="#proof"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-xs uppercase tracking-[0.25em] text-fg-2 transition hover:text-accent md:block"
      >
        Scroll
      </a>
    </section>
  );
}

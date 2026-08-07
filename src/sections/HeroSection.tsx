import { lazy, Suspense } from "react";
import { ArrowDownRight, MapPin } from "lucide-react";
import { profile } from "@/content/profile";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/fx/Magnetic";
import { SplitText } from "@/components/fx/SplitText";
import { TokenStream } from "@/components/fx/TokenStream";
import { useResumeHref } from "@/hooks/useResumeHref";
import { useBooted } from "@/components/Boot";
import { openPalette } from "@/components/CommandPalette";
import { useScrollTo } from "@/components/SmoothScroll";

const GlyphField = lazy(() =>
  import("@/three/GlyphField").then((m) => ({ default: m.GlyphField })),
);

const STATUS_ROWS: [string, string][] = [
  ["role", "AI/GenAI & Forward-Deployed Engineer"],
  ["org", "Argusoft · Bidstream"],
  ["focus", "multi-agent systems · GraphRAG · caching"],
  ["scale", "1B+ tokens · 1M+ pages in production"],
];

export function HeroSection() {
  const resume = useResumeHref();
  const booted = useBooted();
  const { scrollToId } = useScrollTo();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-20"
      aria-label="Introduction"
    >
      {/* ambient glows under the glyph field */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgba(46,230,166,0.07),transparent_42%),radial-gradient(ellipse_at_10%_90%,rgba(225,29,72,0.05),transparent_40%)]" />

      <Suspense fallback={null}>
        <GlyphField className="pointer-events-none absolute inset-0 z-0 opacity-90" />
      </Suspense>

      {/* readability vignette */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(7,8,12,0.72)_0%,rgba(7,8,12,0.25)_45%,transparent_75%)]" />

      <div className="container-page relative z-10 grid gap-12 py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:py-24">
        <div>
          <p
            className="font-mono text-xs text-fg-2 transition-opacity duration-700"
            style={{ opacity: booted ? 1 : 0 }}
          >
            <span className="text-accent">~</span>/siddharth-kalyani —{" "}
            {profile.location.toLowerCase()} · open to remote
            <MapPin size={12} className="ml-2 inline text-accent" aria-hidden />
          </p>

          <h1 className="mt-6 font-display uppercase leading-[0.92] text-fg-0">
            <SplitText
              text="Siddharth"
              start={booted}
              delay={0.05}
              className="block text-[clamp(3.4rem,11vw,9rem)]"
            />
            <SplitText
              text="Kalyani"
              start={booted}
              delay={0.28}
              className="block text-[clamp(3.4rem,11vw,9rem)] italic text-accent"
            />
          </h1>

          <p className="mt-7 min-h-[1.5em] font-mono text-sm text-accent md:text-base">
            <TokenStream
              text={`${profile.roleLine} — ${profile.roleSub}`}
              start={booted}
              speed={1.35}
            />
          </p>

          <div className="rule my-8 max-w-xs" />

          <p className="max-w-[24ch] font-display text-[clamp(1.6rem,3.2vw,2.4rem)] italic leading-[1.15] text-fg-0">
            LLM systems that survive production — and prove it in tokens and
            dollars.
          </p>

          <p className="mt-6 max-w-[38rem] text-base leading-relaxed text-fg-1 md:text-lg">
            {profile.oneLiner} Currently at {profile.company}.
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-3 transition-all duration-700"
            style={{
              opacity: booted ? 1 : 0,
              transform: booted ? "none" : "translateY(10px)",
            }}
          >
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToId("pipeline")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-bg-0 shadow-[0_0_0_1px_rgba(46,230,166,0.25),0_10px_40px_rgba(46,230,166,0.12)] transition hover:brightness-110"
              >
                Trace the runtime
                <ArrowDownRight size={16} aria-hidden />
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <ButtonLink to={resume.href} variant="outline">
                {resume.label}
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.25}>
              <ButtonLink
                to="https://www.linkedin.com/in/siddharth-kalyani/"
                variant="ghost"
              >
                LinkedIn
              </ButtonLink>
            </Magnetic>
            <button
              type="button"
              onClick={openPalette}
              className="ml-1 hidden items-center gap-1.5 rounded-lg border border-border bg-bg-1/60 px-2.5 py-1.5 font-mono text-[11px] text-fg-2 transition hover:border-accent/40 hover:text-accent md:inline-flex"
            >
              <span className="text-fg-1">⌘K</span> to command
            </button>
          </div>
        </div>

        <aside
          className="hidden transition-all delay-300 duration-1000 lg:block"
          aria-label="Runtime status"
          style={{
            opacity: booted ? 1 : 0,
            transform: booted ? "none" : "translateY(14px)",
          }}
        >
          <div className="ml-auto max-w-sm border border-border bg-bg-0/55 p-6 font-mono text-[13px] leading-7 backdrop-blur-md">
            <p className="text-fg-2">
              <span className="text-accent">$</span> status --now
            </p>
            <dl className="mt-3 space-y-1.5">
              {STATUS_ROWS.map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <dt className="w-14 shrink-0 text-fg-2/70">{k}</dt>
                  <dd className="text-fg-1">{v}</dd>
                </div>
              ))}
              <div className="flex gap-3">
                <dt className="w-14 shrink-0 text-fg-2/70">state</dt>
                <dd className="flex items-center gap-2 text-fg-0">
                  <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                  open to GenAI / FDE roles
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <button
        type="button"
        onClick={() => scrollToId("about")}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.28em] text-fg-2 transition hover:text-accent md:block"
      >
        scroll ↓
      </button>
    </section>
  );
}

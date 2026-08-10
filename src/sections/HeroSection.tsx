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
import { useScrollProgress } from "@/hooks/useScrollProgress";

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
  const { progress } = useScrollProgress();

  // slight parallax on the copy as you leave hero
  const lift = Math.min(1, progress * 4) * 24;

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-20"
      aria-label="Introduction"
    >
      {/* left readability veil · world shows through the right */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(105deg,rgba(10,7,18,0.78)_0%,rgba(10,7,18,0.35)_48%,transparent_72%)]" />

      <div
        className="container-page relative z-10 grid gap-12 py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:py-24"
        style={{
          transform: `translate3d(0, ${lift}px, 0)`,
          opacity: 1 - Math.min(0.35, progress * 1.2),
        }}
      >
        <div>
          <p
            className="font-mono text-xs text-fg-2 transition-opacity duration-700"
            style={{ opacity: booted ? 1 : 0 }}
          >
            <span className="text-accent">//</span> cinematic runtime ·{" "}
            {profile.location.toLowerCase()} · open to remote
            <MapPin size={12} className="ml-2 inline text-accent" aria-hidden />
          </p>

          <h1 className="mt-6 font-display uppercase leading-[0.95] text-fg-0">
            <SplitText
              text="Siddharth"
              start={booted}
              delay={0.05}
              className="block text-[clamp(3.4rem,11vw,9rem)] drop-shadow-[0_8px_40px_rgba(0,0,0,0.55)]"
            />
            <SplitText
              text="Kalyani"
              start={booted}
              delay={0.28}
              className="mt-1 block text-[clamp(3.4rem,11vw,9rem)] italic text-accent drop-shadow-[0_0_40px_rgba(199,125,255,0.25)]"
            />
          </h1>

          <p className="mt-7 min-h-[1.5em] font-mono text-sm text-accent md:text-base">
            <TokenStream
              text={`${profile.roleLine} · ${profile.roleSub}`}
              start={booted}
              speed={0.72}
            />
          </p>

          <div className="rule my-8 max-w-xs" />

          <p className="max-w-[22ch] font-display text-[clamp(1.7rem,3.4vw,2.6rem)] italic leading-[1.12] text-fg-0">
            A production agent system, rendered as a world you can fly through.
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
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-bg-0 shadow-[0_0_0_1px_rgba(199,125,255,0.25),0_10px_40px_rgba(199,125,255,0.12)] transition hover:brightness-110"
              >
                Enter the journey
                <ArrowDownRight size={16} aria-hidden />
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <ButtonLink
                to={resume.href}
                variant="outline"
                {...(resume.download ? { download: resume.download } : {})}
              >
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
              className="ml-1 hidden items-center gap-1.5 rounded-lg border border-border bg-bg-0/40 px-2.5 py-1.5 font-mono text-[11px] text-fg-2 backdrop-blur-md transition hover:border-accent/40 hover:text-accent md:inline-flex"
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
          <div className="glass ml-auto max-w-sm p-6 font-mono text-[13px] leading-7">
            <p className="text-fg-2">
              <span className="text-accent">$</span> status --cinematic
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
              <div className="flex gap-3">
                <dt className="w-14 shrink-0 text-fg-2/70">world</dt>
                <dd className="text-fg-1">scroll to fly the agent graph</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <button
        type="button"
        onClick={() => scrollToId("pipeline")}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.28em] text-fg-2 transition hover:text-accent md:block"
      >
        scroll to enter ↓
      </button>
    </section>
  );
}

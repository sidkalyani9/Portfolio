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
import { activeIndexFromJourney } from "@/three/journeyGraph";

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
  const { progress, journey, nodes } = useScrollProgress();
  const active = activeIndexFromJourney(journey, nodes.length);
  const activeNode = nodes[active];

  // slight parallax on the copy as you leave hero
  const lift = Math.min(1, progress * 4) * 24;

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] min-h-[100dvh] items-center overflow-hidden pt-[max(5rem,calc(env(safe-area-inset-top)+4.5rem))] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
      aria-label="Introduction"
    >
      {/* readability veil — lighter on mobile so particles stay visible */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(105deg,rgba(10,7,18,0.78)_0%,rgba(10,7,18,0.4)_52%,transparent_78%)] max-[899px]:bg-[linear-gradient(180deg,rgba(10,7,18,0.35)_0%,rgba(10,7,18,0.5)_50%,rgba(10,7,18,0.25)_100%)]" />

      <div
        className="container-page relative z-10 grid gap-10 py-12 sm:gap-12 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:py-24"
        style={{
          transform: `translate3d(0, ${lift}px, 0)`,
          opacity: 1 - Math.min(0.35, progress * 1.2),
        }}
      >
        <div>
          <p
            className="font-mono text-[11px] text-fg-2 transition-opacity duration-700 sm:text-xs"
            style={{ opacity: booted ? 1 : 0 }}
          >
            <span className="text-accent">//</span> cinematic runtime ·{" "}
            {profile.location.toLowerCase()} · open to remote
            <MapPin size={12} className="ml-2 inline text-accent" aria-hidden />
          </p>

          <h1 className="mt-5 font-display uppercase leading-[0.92] text-fg-0 sm:mt-6 sm:leading-[0.95]">
            <SplitText
              text="Siddharth"
              start={booted}
              delay={0.05}
              className="block text-[clamp(2.85rem,12.5vw,9rem)] drop-shadow-[0_8px_40px_rgba(0,0,0,0.55)]"
            />
            <SplitText
              text="Kalyani"
              start={booted}
              delay={0.28}
              className="mt-0.5 block text-[clamp(2.85rem,12.5vw,9rem)] italic text-accent drop-shadow-[0_0_40px_rgba(199,125,255,0.25)] sm:mt-1"
            />
          </h1>

          <p className="mt-5 min-h-[1.5em] font-mono text-[13px] leading-relaxed text-accent sm:mt-7 sm:text-sm md:text-base">
            <TokenStream
              text={`${profile.roleLine} · ${profile.roleSub}`}
              start={booted}
              speed={0.72}
            />
          </p>

          <div className="rule my-6 max-w-xs sm:my-8" />

          <p className="max-w-[18ch] font-display text-[clamp(1.45rem,5.5vw,2.6rem)] italic leading-[1.12] text-fg-0 sm:max-w-[22ch]">
            A production agent system, rendered as a world you can fly through.
          </p>

          <p className="mt-5 max-w-[38rem] text-[0.98rem] leading-relaxed text-fg-1 sm:mt-6 sm:text-base md:text-lg">
            {profile.oneLiner} Currently at {profile.company}.
          </p>

          {/* mobile journey chip — mirrors desktop status world line */}
          <div
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/80 bg-bg-0/50 px-3 py-1.5 font-mono text-[10px] text-fg-2 backdrop-blur-md transition-opacity duration-700 max-[899px]:inline-flex min-[900px]:hidden"
            style={{ opacity: booted ? 1 : 0 }}
            aria-live="polite"
          >
            <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-fg-1">node</span>
            <span className="text-accent">{activeNode?.label ?? "boot"}</span>
            <span className="text-fg-2/50">·</span>
            <span>{activeNode?.sub ?? "intro"}</span>
          </div>

          <div
            className="mt-8 flex flex-wrap items-center gap-2.5 transition-all duration-700 sm:mt-10 sm:gap-3"
            style={{
              opacity: booted ? 1 : 0,
              transform: booted ? "none" : "translateY(10px)",
            }}
          >
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToId("pipeline")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-bg-0 shadow-[0_0_0_1px_rgba(199,125,255,0.25),0_10px_40px_rgba(199,125,255,0.12)] transition hover:brightness-110 active:scale-[0.98]"
              >
                Enter the journey
                <ArrowDownRight size={16} aria-hidden />
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <ButtonLink
                to={resume.href}
                variant="outline"
                className="min-h-11"
                {...(resume.download ? { download: resume.download } : {})}
              >
                {resume.label}
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.25}>
              <ButtonLink
                to="https://www.linkedin.com/in/siddharth-kalyani/"
                variant="ghost"
                className="min-h-11"
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

        {/* compact mobile status card */}
        <aside
          className="reveal-none max-[899px]:block min-[900px]:hidden"
          aria-label="Runtime status"
          style={{
            opacity: booted ? 1 : 0,
            transform: booted ? "none" : "translateY(10px)",
            transition: "opacity 0.7s, transform 0.7s",
          }}
        >
          <div className="glass grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-2xl p-4 font-mono text-[11px] leading-snug">
            <div>
              <p className="text-fg-2/70">org</p>
              <p className="mt-0.5 text-fg-1">Argusoft · Bidstream</p>
            </div>
            <div>
              <p className="text-fg-2/70">scale</p>
              <p className="mt-0.5 text-fg-1">1B+ tokens · 1M+ pages</p>
            </div>
            <div className="col-span-2 flex items-center gap-2 border-t border-border/60 pt-2.5">
              <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-fg-0">open to GenAI / FDE roles</span>
            </div>
          </div>
        </aside>
      </div>

      <button
        type="button"
        onClick={() => scrollToId("pipeline")}
        className="absolute bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-fg-2 transition hover:text-accent min-[900px]:bottom-8"
      >
        <span className="scroll-cue-line block h-8 w-px bg-gradient-to-b from-accent/80 to-transparent" />
        <span>scroll</span>
      </button>
    </section>
  );
}

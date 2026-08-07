import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, Database, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  systemPanels,
  systemsPipeline,
  type SystemPanel,
} from "@/content/systems";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Chip } from "@/components/ui/Chip";
import { PullQuote } from "@/components/ui/PullQuote";
import { WipeLink } from "@/components/PageWipe";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollTo } from "@/components/SmoothScroll";
import { DUR } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const N = systemPanels.length;

function PanelBody({ panel }: { panel: SystemPanel }) {
  return (
      <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-accent">
          <Sparkles size={18} aria-hidden />
          <p className="font-sans text-sm font-semibold">{panel.title}</p>
        </div>
        <span className="rounded-full border border-accent/30 bg-accent-dim px-3 py-1 font-mono text-[11px] text-accent">
          {panel.metric}
        </span>
      </div>
      <p className="mt-1 text-sm text-fg-2">{panel.short}</p>
      <ul className="mt-5 space-y-3">
        {panel.bullets.map((b) => (
          <li key={b} className="flex gap-3 text-fg-1">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-2">
        {panel.stack.map((s) => (
          <Chip key={s}>{s}</Chip>
        ))}
      </div>

      {panel.id === "scoring" ? (
        <div className="mt-6 rounded-2xl border border-violet/25 bg-violet/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#cfc0ff]">
            <Database size={16} aria-hidden />
            Flagship: specialised persona classifier
          </div>
          <p className="mt-2 text-sm text-fg-1">
            Section → persona (e.g.{" "}
            <code className="text-accent">technical:fastapi/python</code>) → DB
            lookup → on miss write & cache → section scoring agent.
          </p>
          <ol className="mt-4 grid gap-2 sm:grid-cols-4">
            {["Read section", "DB lookup", "Cache / write", "Score"].map(
              (s, i) => (
                <li
                  key={s}
                  className="rounded-xl border border-border bg-bg-0/60 px-3 py-2 text-center text-xs text-fg-0"
                >
                  <span className="block text-[10px] text-fg-2">0{i + 1}</span>
                  {s}
                </li>
              ),
            )}
          </ol>
        </div>
      ) : null}

      {panel.kind === "anonymous" ? (
        <p className="mt-4 text-xs text-fg-2">
          Confidential client work — product name and UI redacted. Architecture and
          ownership only.
        </p>
      ) : null}

      <div className="mt-auto pt-6">
        <WipeLink
          to={`/work/${panel.caseSlug}`}
          data-cursor="view"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-transparent px-5 py-2.5 font-sans text-sm font-semibold text-fg-0 transition hover:border-accent/40 hover:bg-accent-dim"
        >
          Case study
          <ArrowUpRight size={16} aria-hidden />
        </WipeLink>
      </div>
    </div>
  );
}

export function SystemsSection() {
  const baseId = useId();
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const fadeTween = useRef<gsap.core.Tween | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { scrollToId, scrollToY } = useScrollTo();

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const panel = systemPanels[active];

  const setActiveWithFade = (i: number) => {
    if (i === activeRef.current) return;
    activeRef.current = i;
    fadeTween.current?.kill();
    const el = panelRef.current;
    if (el && !reduced) {
      fadeTween.current = gsap.fromTo(
        el,
        { autoAlpha: 0.15, clipPath: "inset(0 0 8% 0)" },
        {
          autoAlpha: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: DUR.panel,
          ease: "power2.out",
        },
      );
    }
    setActive(i);
  };

  const scrollToPanel = (i: number) => {
    const st = stRef.current;
    if (!st || !isDesktop || reduced) {
      setActiveWithFade(i);
      return;
    }
    const p = (i + 0.5) / N;
    const y = st.start + p * (st.end - st.start);
    scrollToY(y);
    setActiveWithFade(i);
  };

  useEffect(() => {
    if (!pinRef.current || !stageRef.current || reduced || !isDesktop) {
      stRef.current = null;
      return;
    }

    const ctx = gsap.context(() => {
      const segment = window.innerHeight * 0.55;
      const st = ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top+=88",
        end: `+=${N * segment}`,
        pin: stageRef.current,
        pinSpacing: true,
        scrub: 0.65,
        anticipatePin: 1,
        onUpdate: (self) => {
          const t = Math.min(1, Math.max(0, self.progress));
          const i = Math.min(N - 1, Math.floor(t * N + 1e-6));
          if (i !== activeRef.current) setActiveWithFade(i);
        },
      });
      stRef.current = st;
    }, pinRef);

    return () => {
      stRef.current = null;
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, isDesktop]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mod = params.get("module");
    if (!mod) return;
    const i = systemPanels.findIndex((p) => p.id === mod);
    if (i >= 0) {
      requestAnimationFrame(() => scrollToPanel(i));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, reduced]);

  return (
    <section id="systems" className="section-y relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(124,92,255,0.06),transparent_40%)]" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow="Featured systems"
          title="Systems I own end-to-end"
          description="Production GenAI on Bidstream — multi-agent generation, agentic scoring, GraphRAG retrieval, caching infrastructure, batch validation and observability. Confidential UIs redacted."
          className="reveal"
        />

        <div className="reveal max-w-2xl">
          <PullQuote attribution="Specialised persona classifier · multi-agent scoring">
            For each proposal section, choose a specialised scoring persona, reuse it
            from the database when it exists, otherwise write it, cache it, then score.
          </PullQuote>
        </div>

        <ol
          className={cn(
            "reveal mt-2 flex min-h-[2.75rem] flex-wrap gap-2 md:gap-3",
            panel.kind !== "bidstream" && "invisible",
          )}
          aria-label="Product pipeline"
          aria-hidden={panel.kind !== "bidstream"}
        >
          {systemsPipeline.map((step, i) => (
            <li key={step} className="flex items-center gap-2 text-sm text-fg-1">
              <span className="rounded-full border border-border bg-bg-2 px-3 py-1.5 text-fg-0">
                {step}
              </span>
              {i < systemsPipeline.length - 1 ? (
                <span className="text-fg-2" aria-hidden>
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        <div ref={pinRef} className="mt-12" data-reveal="none">
          <div
            ref={stageRef}
            className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
          >
            <div
              role="tablist"
              aria-label="Systems"
              aria-orientation="vertical"
              className="flex flex-col gap-2"
            >
              {systemPanels.map((m, idx) => {
                const selected = idx === active;
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${m.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => scrollToPanel(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                        e.preventDefault();
                        scrollToPanel((idx + 1) % N);
                        document
                          .getElementById(
                            `${baseId}-tab-${systemPanels[(idx + 1) % N].id}`,
                          )
                          ?.focus();
                      }
                      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        const next = (idx - 1 + N) % N;
                        scrollToPanel(next);
                        document
                          .getElementById(
                            `${baseId}-tab-${systemPanels[next].id}`,
                          )
                          ?.focus();
                      }
                    }}
                    className={cn(
                      "rounded-2xl border px-4 py-4 text-left transition",
                      selected
                        ? "border-accent/40 bg-accent-dim shadow-[0_0_0_1px_rgba(46,230,166,0.12)]"
                        : "border-border bg-bg-1/40 hover:border-white/10",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-lg text-fg-0">{m.title}</p>
                        <p className="mt-1 text-sm text-fg-1">{m.short}</p>
                        <p className="mt-1.5 font-mono text-[11px] text-accent/90">
                          {m.metric}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          m.badge === "Owned"
                            ? "bg-violet/15 text-[#b9a7ff]"
                            : "bg-ink-dim text-ink",
                        )}
                      >
                        {m.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              ref={panelRef}
              className="min-h-[320px] rounded-3xl border border-border bg-bg-1/50 p-6 md:p-8"
              role="tabpanel"
              id={`${baseId}-panel`}
              aria-labelledby={`${baseId}-tab-${panel.id}`}
            >
              <PanelBody panel={panel} />
            </div>
          </div>
        </div>

        <p className="reveal mt-10 text-sm text-fg-2">
          Scroll the section on desktop to move through systems.{" "}
          <button
            type="button"
            className="text-accent underline-offset-4 hover:underline"
            onClick={() => scrollToId("work")}
          >
            All selected work
          </button>
          {" · "}
          <WipeLink
            to="/work/bidstream-ai"
            data-cursor="view"
            className="text-accent hover:underline"
          >
            Scoring deep dive
          </WipeLink>
        </p>
      </div>
    </section>
  );
}

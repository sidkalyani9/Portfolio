import { useEffect, useId, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowUpRight, Database, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  bidstreamCaseStudy,
  bidstreamModules,
  bidstreamStack,
  type BidStreamModuleId,
} from "@/content/bidstream";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Chip } from "@/components/ui/Chip";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

const ids = bidstreamModules.map((m) => m.id);

export function BidStreamSection() {
  const baseId = useId();
  const pinRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [params, setParams] = useSearchParams();
  const fromUrl = params.get("module") as BidStreamModuleId | null;
  const initial =
    fromUrl && ids.includes(fromUrl) ? fromUrl : ("scoring" as BidStreamModuleId);
  const [active, setActive] = useState<BidStreamModuleId>(initial);

  useEffect(() => {
    if (fromUrl && ids.includes(fromUrl) && fromUrl !== active) {
      setActive(fromUrl);
    }
  }, [fromUrl, active]);

  useEffect(() => {
    if (!pinRef.current || reduced || !isDesktop) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top+=72",
        end: "+=90%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });
    }, pinRef);
    return () => ctx.revert();
  }, [reduced, isDesktop]);

  const module = bidstreamModules.find((m) => m.id === active)!;

  const select = (id: BidStreamModuleId, focus = false) => {
    setActive(id);
    const next = new URLSearchParams(params);
    next.set("module", id);
    setParams(next, { replace: true });
    if (focus) {
      requestAnimationFrame(() => {
        document.getElementById(`${baseId}-tab-${id}`)?.focus();
      });
    }
  };

  return (
    <section id="bidstream" className="section-y relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(124,92,255,0.08),transparent_40%)]" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow="Featured product work"
          title="BidStreamAI — modules I own"
          description={bidstreamCaseStudy.problem}
          className="reveal"
        />

        <div className="mt-6 flex flex-wrap gap-2 reveal">
          {bidstreamStack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>

        {/* Pipeline */}
        <ol className="reveal mt-10 flex flex-wrap gap-2 md:gap-3" aria-label="BidStreamAI pipeline">
          {bidstreamCaseStudy.pipeline.map((step, i) => (
            <li key={step} className="flex items-center gap-2 text-sm text-fg-1">
              <span className="rounded-full border border-border bg-bg-2 px-3 py-1.5 text-fg-0">
                {step}
              </span>
              {i < bidstreamCaseStudy.pipeline.length - 1 ? (
                <span className="text-fg-2" aria-hidden>
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        <div
          ref={pinRef}
          className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
        >
          {/* Module switcher */}
          <div className="reveal">
            <div
              role="tablist"
              aria-label="BidStreamAI modules"
              aria-orientation="vertical"
              className="flex flex-col gap-2"
            >
              {bidstreamModules.map((m) => {
                const selected = m.id === active;
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${m.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel-${m.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(m.id)}
                    onKeyDown={(e) => {
                      const idx = ids.indexOf(m.id);
                      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                        e.preventDefault();
                        select(ids[(idx + 1) % ids.length], true);
                      }
                      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        select(ids[(idx - 1 + ids.length) % ids.length], true);
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
                        <p className="font-display text-lg font-bold text-fg-0">
                          {m.title}
                        </p>
                        <p className="mt-1 text-sm text-fg-1">{m.short}</p>
                      </div>
                      {m.owned ? (
                        <span className="shrink-0 rounded-full bg-violet/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#b9a7ff]">
                          Owned
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel */}
          <div
            className="reveal rounded-3xl border border-border bg-bg-1/50 p-6 md:p-8"
            role="tabpanel"
            id={`${baseId}-panel-${module.id}`}
            aria-labelledby={`${baseId}-tab-${module.id}`}
          >
            <div className="flex items-center gap-2 text-accent">
              <Sparkles size={18} aria-hidden />
              <p className="text-sm font-semibold">{module.title}</p>
            </div>
            <ul className="mt-5 space-y-3">
              {module.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-fg-1">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {module.id === "scoring" ? (
              <div className="mt-6 rounded-2xl border border-violet/25 bg-violet/10 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#cfc0ff]">
                  <Database size={16} aria-hidden />
                  Flagship: specialised persona classifier
                </div>
                <p className="mt-2 text-sm text-fg-1">
                  Section → choose persona (e.g.{" "}
                  <code className="text-accent">technical:fastapi/python</code>) →
                  DB lookup → on miss write & cache prompt → section scoring agent.
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

            <div className="mt-6">
              <MediaFrame
                src={bidstreamCaseStudy.media[0]}
                alt="BidStreamAI proposal scoring interface screenshot"
                imgClassName="max-h-[320px] object-top"
              />
              <p className="mt-2 text-xs text-fg-2">
                UI from BidStreamAI proposal scoring — sensitive details avoided in copy.
              </p>
            </div>

            <div className="mt-6">
              <ButtonLink to="/work/bidstream-ai" variant="outline">
                Full case study
                <ArrowUpRight size={16} aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </div>

        <p className="reveal mt-8 text-sm text-fg-2">
          Team product · I owned scoring, insights, CV generation, and L2 validation
          while contributing across the broader pipeline.{" "}
          <Link to="/work/bidstream-ai" className="text-accent hover:underline">
            Read the deep dive
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

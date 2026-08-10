import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FileInput,
  ListTree,
  Network,
  FilePenLine,
  ShieldCheck,
  Gauge,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { HEADER_OFFSET } from "@/lib/motion";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

type Node = {
  id: string;
  label: string;
  sub: string;
  icon: LucideIcon;
  log: string;
};

const NODES: Node[] = [
  {
    id: "intake",
    label: "intake",
    sub: "multimodal ingest",
    icon: FileInput,
    log: "intake    ← rfp_pack.pdf · 412 pages · 1.1M tokens · native multimodal",
  },
  {
    id: "planner",
    label: "planner",
    sub: "task decomposition",
    icon: ListTree,
    log: "planner   → 6 evaluation tasks · rubric drafted · 214 tok · 38ms",
  },
  {
    id: "retriever",
    label: "retriever",
    sub: "GraphRAG lookup",
    icon: Network,
    log: "retriever → graphrag · 14 insights over 100K+ nodes · 96ms",
  },
  {
    id: "writer",
    label: "writer",
    sub: "grounded drafting",
    icon: FilePenLine,
    log: "writer    → 3 sections grounded · cache hit 64% · 1.9s",
  },
  {
    id: "reviewer",
    label: "reviewer",
    sub: "persona audit",
    icon: ShieldCheck,
    log: "reviewer  → persona[technical:fastapi/python] · 2 flags · 340ms",
  },
  {
    id: "score",
    label: "score",
    sub: "compliance matrix",
    icon: Gauge,
    log: "score     → 87/100 · cost $0.012 · manual review −95%",
  },
];

const N = NODES.length;

/**
 * Journey set-piece.
 * Desktop: sticky horizontal HUD + ScrollTrigger scrub.
 * Mobile: sticky vertical line + native scroll (no nested scroll traps).
 */
export function PipelineSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { section } = useScrollProgress();

  const [progress, setProgress] = useState(0);

  // Desktop: GSAP ScrollTrigger
  useEffect(() => {
    if (reduced || !isDesktop) return;
    const el = trackRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.95,
        onUpdate: (self) => setProgress(self.progress),
      });
    }, trackRef);

    return () => ctx.revert();
  }, [reduced, isDesktop]);

  // Mobile: native scroll → progress (reliable + no Lenis on phone)
  useEffect(() => {
    if (reduced || isDesktop) return;
    const track = mobileTrackRef.current;
    if (!track) return;

    let raf = 0;
    const measure = () => {
      const rect = track.getBoundingClientRect();
      const trackH = track.offsetHeight;
      const vh = window.innerHeight || 1;
      const scrollRange = Math.max(1, trackH - vh);
      const scrolled = Math.min(scrollRange, Math.max(0, -rect.top));
      setProgress(scrolled / scrollRange);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const t1 = window.setTimeout(measure, 120);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, isDesktop]);

  // Reduced motion: show full path
  useEffect(() => {
    if (reduced) setProgress(1);
  }, [reduced]);

  const activeFloat = progress * (N - 0.001);
  const activeIndex = Math.min(N - 1, Math.floor(activeFloat));
  const packetPct = Math.min(100, progress * 100);
  const inFocus = section === "pipeline";

  const stickyTopDesktop = HEADER_OFFSET + 16;
  const stageHDesktop = `calc(100svh - ${stickyTopDesktop + 24}px)`;

  const stickyTopMobile = 56;
  const stageHMobile =
    "calc(100svh - 56px - 5.75rem - env(safe-area-inset-bottom, 0px) - env(safe-area-inset-top, 0px))";

  return (
    <section id="pipeline" className="section-y relative">
      <div className="container-page relative">
        <SectionHeading
          eyebrow="The journey"
          title="Fly a request through the system"
          description="Scroll to pilot the camera through Bidstream's multi-agent loop, the same architecture that cut proposal rework from ~50% of sections to ~5% minor edits."
          className="reveal"
        />

        {reduced ? (
          <div
            className="glass-strong relative mt-10 rounded-2xl p-5 sm:mt-14 sm:rounded-3xl sm:p-6 md:p-10"
            data-reveal="none"
          >
            <JourneyHud
              progress={1}
              packetPct={100}
              activeIndex={N - 1}
              staticTimeline
            />
          </div>
        ) : isDesktop ? (
          <div
            ref={trackRef}
            className="relative mt-14"
            style={{ height: `${N * 90}vh` }}
            data-reveal="none"
          >
            <div
              className={cn(
                "glass-strong sticky flex flex-col justify-center overflow-hidden rounded-3xl",
                inFocus && "ring-1 ring-accent/20",
              )}
              style={{
                top: stickyTopDesktop,
                height: stageHDesktop,
                minHeight: stageHDesktop,
              }}
            >
              <div className="flex h-full min-h-0 flex-col justify-center px-6 py-8 md:px-10 md:py-10 lg:px-12">
                <JourneyHud
                  progress={progress}
                  packetPct={packetPct}
                  activeIndex={activeIndex}
                />
              </div>
            </div>
          </div>
        ) : (
          /* —— Mobile animated journey —— */
          <div
            ref={mobileTrackRef}
            className="relative mt-8"
            style={{ height: `${Math.max(N * 80, 320)}vh` }}
            data-reveal="none"
          >
            <div
              className={cn(
                "glass-strong sticky z-[1] flex flex-col overflow-hidden rounded-2xl border border-border/70",
                inFocus && "ring-1 ring-accent/20",
              )}
              style={{
                top: `calc(${stickyTopMobile}px + env(safe-area-inset-top, 0px))`,
                height: stageHMobile,
                maxHeight: stageHMobile,
                touchAction: "pan-y",
              }}
            >
              <MobileJourneyHud
                progress={progress}
                packetPct={packetPct}
                activeIndex={activeIndex}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** Mobile: vertical line that fills + packet that rides + nodes that light up */
function MobileJourneyHud({
  progress,
  packetPct,
  activeIndex,
}: {
  progress: number;
  packetPct: number;
  activeIndex: number;
}) {
  const active = NODES[activeIndex] ?? NODES[0];
  // Packet position along vertical rail (0–100% of rail height)
  const packetTop = Math.min(100, Math.max(0, packetPct));

  return (
    <div
      className="flex h-full min-h-0 flex-col"
      style={{ touchAction: "pan-y" }}
    >
      {/* header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/50 px-4 py-2.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-2">
          <span className="text-accent">$</span> cam --track
        </p>
        <p className="font-mono text-[11px] tabular-nums text-fg-2">
          journey{" "}
          <span className="text-accent">
            {String(Math.round(packetPct)).padStart(3, "0")}%
          </span>
        </p>
      </div>

      {/* progress bar under header */}
      <div className="h-[2px] shrink-0 bg-white/6">
        <div
          className="h-full bg-gradient-to-r from-violet to-accent transition-[width] duration-150 ease-out"
          style={{ width: `${packetPct}%` }}
        />
      </div>

      {/* main stage: vertical rail + active detail */}
      <div className="flex min-h-0 flex-1 gap-0 px-3 py-3">
        {/* vertical line + nodes */}
        <div className="relative w-11 shrink-0 self-stretch py-1">
          {/* track */}
          <div
            className="absolute left-1/2 top-3 bottom-3 w-px -translate-x-1/2 bg-border/80"
            aria-hidden
          />
          {/* lit fill */}
          <div
            className="absolute left-1/2 top-3 w-px -translate-x-1/2 bg-gradient-to-b from-accent via-accent to-violet shadow-[0_0_10px_rgba(199,125,255,0.55)] transition-[height] duration-150 ease-out"
            style={{
              height: `calc((100% - 1.5rem) * ${packetTop / 100})`,
            }}
            aria-hidden
          />
          {/* moving packet */}
          <div
            className="absolute left-1/2 z-20 -translate-x-1/2 transition-[top] duration-150 ease-out"
            style={{
              top: `calc(0.75rem + (100% - 1.5rem) * ${packetTop / 100} - 5px)`,
            }}
            aria-hidden
          >
            <span className="journey-packet block h-2.5 w-2.5 rounded-full bg-[#f0e4ff] shadow-[0_0_14px_rgba(199,125,255,0.9)]" />
          </div>

          {/* node dots */}
          <ol className="relative z-10 flex h-full flex-col justify-between py-1">
            {NODES.map((node, i) => {
              const passed = i < activeIndex || (i === activeIndex && progress > 0.02);
              const isActive = i === activeIndex && progress > 0.01;
              return (
                <li
                  key={node.id}
                  className="flex items-center justify-center"
                >
                  <span
                    className={cn(
                      "block rounded-full border transition-all duration-300",
                      isActive
                        ? "h-3 w-3 border-accent bg-accent shadow-[0_0_12px_rgba(199,125,255,0.75)] scale-110"
                        : passed
                          ? "h-2 w-2 border-violet/70 bg-violet/60"
                          : "h-2 w-2 border-fg-2/40 bg-bg-1",
                    )}
                    aria-label={node.label}
                  />
                </li>
              );
            })}
          </ol>
        </div>

        {/* right: icons strip + active card + log */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col pl-1">
          {/* node labels rail — compact row of icons */}
          <ol className="flex shrink-0 items-center justify-between gap-0.5 pb-2">
            {NODES.map((node, i) => {
              const Icon = node.icon;
              const passed = i < activeIndex;
              const isActive = i === activeIndex && progress > 0.01;
              return (
                <li key={node.id} className="flex flex-col items-center gap-0.5">
                  <div
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-xl border transition-all duration-400",
                      isActive
                        ? "scale-105 border-accent bg-accent/20 text-accent shadow-[0_0_24px_rgba(199,125,255,0.35)]"
                        : passed
                          ? "border-accent/35 bg-bg-0/50 text-accent/80"
                          : "border-border bg-bg-0/35 text-fg-2",
                    )}
                  >
                    <Icon size={15} aria-hidden />
                  </div>
                  <span
                    className={cn(
                      "max-w-[2.75rem] truncate font-mono text-[8px] leading-none",
                      isActive || passed ? "text-fg-0" : "text-fg-2/70",
                    )}
                  >
                    {node.label}
                  </span>
                </li>
              );
            })}
          </ol>

          {/* active stage card */}
          <div
            key={active.id}
            className="journey-stage-card shrink-0 rounded-xl border border-accent/25 bg-accent/8 px-3 py-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[12px] text-accent">
                {active.label}
                <span className="ml-2 text-[10px] text-fg-2">{active.sub}</span>
              </p>
              <span className="font-mono text-[10px] tabular-nums text-fg-2">
                {String(activeIndex + 1).padStart(2, "0")}/{String(N).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* live log — only show last few lines so no nested scroll needed */}
          <div className="mt-2 min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-bg-0/55 p-3 font-mono text-[10px] leading-5 text-fg-1">
            {NODES.slice(0, activeIndex + (progress > 0.02 ? 1 : 0))
              .slice(-4)
              .map((node, idx, arr) => {
                const globalIdx = activeIndex - (arr.length - 1 - idx);
                const isLive = globalIdx === activeIndex;
                return (
                  <p
                    key={node.id}
                    className={cn(
                      "truncate transition-colors duration-300",
                      isLive ? "text-accent" : "text-fg-2",
                    )}
                  >
                    <span className="mr-2 text-fg-2/50">
                      {(0.04 + globalIdx * 0.61).toFixed(2)}s
                    </span>
                    {node.log}
                  </p>
                );
              })}
            {progress < 0.98 ? (
              <span className="caret-blink mt-0.5 inline-block h-2.5 w-1 bg-accent" />
            ) : (
              <p className="mt-0.5 text-accent">
                ✓ path complete · scored · cached · logged
              </p>
            )}
          </div>

          <p className="mt-2 shrink-0 font-mono text-[9px] text-fg-2/70">
            scroll · packet rides the line · stages unlock
          </p>
        </div>
      </div>
    </div>
  );
}

function JourneyHud({
  progress,
  packetPct,
  activeIndex,
  staticTimeline = false,
}: {
  progress: number;
  packetPct: number;
  activeIndex: number;
  staticTimeline?: boolean;
}) {
  if (staticTimeline) {
    return (
      <ol className="space-y-0">
        {NODES.map((node, i) => {
          const Icon = node.icon;
          return (
            <li
              key={node.id}
              className="relative flex gap-3.5 pb-7 sm:gap-5 sm:pb-8"
            >
              {i < N - 1 ? (
                <span className="absolute left-5 top-12 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-accent/50 to-border sm:left-7 sm:top-14 sm:h-[calc(100%-3.5rem)]" />
              ) : null}
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-accent/40 bg-bg-0/50 text-accent sm:h-14 sm:w-14 sm:rounded-2xl">
                <Icon size={18} className="sm:hidden" aria-hidden />
                <Icon size={20} className="hidden sm:block" aria-hidden />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="font-mono text-[13px] text-fg-0 sm:text-sm">
                  {node.label}
                  <span className="ml-2 text-[11px] text-fg-2 sm:ml-3 sm:text-xs">
                    {node.sub}
                  </span>
                </p>
                <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-fg-1 sm:mt-2 sm:text-xs">
                  {node.log}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between font-mono text-xs text-fg-2">
        <p>
          <span className="text-accent">$</span> cam --track bidstream/score
        </p>
        <p className="tabular-nums">
          journey {String(Math.round(packetPct)).padStart(3, "0")}%
        </p>
      </div>

      <div className="mt-10 flex min-h-0 flex-1 flex-col justify-center md:mt-12">
        <ol className="relative flex items-start justify-between gap-1">
          <div className="absolute left-0 right-0 top-7 h-px bg-border/80" />
          <div
            className="absolute left-0 top-7 h-px bg-accent shadow-[0_0_12px_rgba(199,125,255,0.55)]"
            style={{ width: `${packetPct}%` }}
          />
          {/* packet on horizontal line */}
          <div
            className="absolute top-7 z-20 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-150 ease-out"
            style={{ left: `${packetPct}%` }}
            aria-hidden
          >
            <span className="journey-packet block h-2.5 w-2.5 rounded-full bg-[#f0e4ff] shadow-[0_0_14px_rgba(199,125,255,0.9)]" />
          </div>
          {NODES.map((node, i) => {
            const Icon = node.icon;
            const passed = i < activeIndex;
            const activeNode = i === activeIndex && progress > 0.02;
            return (
              <li
                key={node.id}
                className="relative z-10 flex w-14 flex-col items-center gap-3 text-center sm:w-16"
              >
                <div
                  className={cn(
                    "grid h-14 w-14 place-items-center rounded-2xl border backdrop-blur-md transition-all duration-500",
                    activeNode
                      ? "scale-110 border-accent bg-accent/20 text-accent shadow-[0_0_40px_rgba(199,125,255,0.4)]"
                      : passed
                        ? "border-accent/40 bg-bg-0/50 text-accent/80"
                        : "border-border bg-bg-0/40 text-fg-2",
                  )}
                >
                  <Icon size={20} aria-hidden />
                </div>
                <div>
                  <p
                    className={cn(
                      "font-mono text-xs transition-colors duration-500",
                      activeNode || passed ? "text-fg-0" : "text-fg-2",
                    )}
                  >
                    {node.label}
                  </p>
                  <p className="mt-0.5 hidden text-[10px] text-fg-2 xl:block">
                    {node.sub}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 min-h-[11rem] flex-1 rounded-2xl border border-border bg-bg-0/55 p-5 font-mono text-[12px] leading-6 text-fg-1 backdrop-blur-md md:mt-14 md:min-h-[12.5rem] md:p-6 md:text-[13px]">
          {NODES.slice(0, activeIndex + (progress > 0.02 ? 1 : 0)).map(
            (node, i) => (
              <p
                key={node.id}
                className={cn(
                  "whitespace-pre-wrap",
                  i === activeIndex && "text-accent",
                )}
              >
                <span className="mr-3 text-fg-2/60">
                  {(0.04 + i * 0.61).toFixed(2)}s
                </span>
                {node.log}
              </p>
            ),
          )}
          {progress < 0.98 ? (
            <span className="caret-blink mt-1 inline-block h-3 w-1.5 bg-accent" />
          ) : (
            <p className="mt-1 text-accent">
              ✓ camera path complete · proposal scored, cached, logged
            </p>
          )}
        </div>

        <p className="mt-6 shrink-0 font-mono text-[11px] text-fg-2">
          tip: the 3D world behind this HUD is the same graph · scroll to fly
        </p>
      </div>
    </div>
  );
}

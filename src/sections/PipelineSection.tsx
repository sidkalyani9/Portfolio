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
 * Journey set-piece: CSS sticky HUD (no GSAP pin snap/clip under the header).
 * A tall scroll track drives progress while the stage stays fully on-screen.
 */
export function PipelineSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const animated = isDesktop && !reduced;
  const { section } = useScrollProgress();

  const [progress, setProgress] = useState(animated ? 0 : 1);

  useEffect(() => {
    if (!animated) {
      setProgress(1);
      return;
    }
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
  }, [animated]);

  const activeFloat = progress * (N - 0.001);
  const activeIndex = Math.min(N - 1, Math.floor(activeFloat));
  const packetPct = Math.min(100, progress * 100);
  const inFocus = section === "pipeline";

  // sticky under header; stage fills nearly the full remaining viewport
  const stickyTop = HEADER_OFFSET + 16;
  const stageH = `calc(100svh - ${stickyTop + 24}px)`;

  return (
    <section id="pipeline" className="section-y relative">
      <div className="container-page relative">
        <SectionHeading
          eyebrow="The journey"
          title="Fly a request through the system"
          description="Scroll to pilot the camera through Bidstream's multi-agent loop, the same architecture that cut proposal rework from ~50% of sections to ~5% minor edits."
          className="reveal"
        />

        {animated ? (
          /* tall track = scroll runway; sticky stage fills the viewport under the header */
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
                top: stickyTop,
                height: stageH,
                minHeight: stageH,
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
          <div
            className="glass-strong relative mt-14 rounded-3xl p-6 md:p-10"
            data-reveal="none"
          >
            <JourneyHud
              progress={1}
              packetPct={100}
              activeIndex={N - 1}
              staticTimeline
            />
          </div>
        )}
      </div>
    </section>
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
            <li key={node.id} className="relative flex gap-5 pb-8">
              {i < N - 1 ? (
                <span className="absolute left-7 top-14 h-[calc(100%-3.5rem)] w-px bg-border" />
              ) : null}
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-accent/40 bg-bg-0/50 text-accent">
                <Icon size={20} aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-sm text-fg-0">
                  {node.label}
                  <span className="ml-3 text-xs text-fg-2">{node.sub}</span>
                </p>
                <p className="mt-2 font-mono text-xs leading-relaxed text-fg-1">
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

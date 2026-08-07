import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Marquee } from "@/components/fx/Marquee";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DUR, EASE_OUT_EXPO } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

type Stat = {
  target: number;
  format: (v: number) => string;
  label: string;
  sub: string;
};

const STATS: Stat[] = [
  {
    target: 1000,
    format: (v) => (v >= 1000 ? "1B+" : `${Math.round(v)}M`),
    label: "LLM tokens processed",
    sub: "cached + uncached, tracked in prod",
  },
  {
    target: 80,
    format: (v) => `${Math.round(v)}%`,
    label: "inference cost cut",
    sub: "Vertex AI context caching platform",
  },
  {
    target: 95,
    format: (v) => `${Math.round(v)}%`,
    label: "review effort cut",
    sub: "6-stage agentic compliance pipeline",
  },
  {
    target: 1000,
    format: (v) => (v >= 1000 ? "1M+" : `${Math.round(v)}K`),
    label: "pages processed",
    sub: "RFPs & unstructured documents",
  },
  {
    target: 30,
    format: (v) => `${Math.round(v)}+`,
    label: "production scrapers",
    sub: "gov & enterprise portals kept alive",
  },
  {
    target: 100,
    format: (v) => `${Math.round(v)}K+`,
    label: "RFP insights indexed",
    sub: "GraphRAG structured search layer",
  },
];

const MARQUEE_ITEMS = [
  "multi-agent systems",
  "GraphRAG",
  "Vertex AI",
  "Gemini",
  "context caching",
  "LLMOps",
  "FastAPI",
  "PostgreSQL · pgvector",
  "Google ADK",
  "Playwright",
] as const;

function Counter({ stat, started }: { stat: Stat; started: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(reduced ? stat.target : 0);

  useEffect(() => {
    if (!started || reduced) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: stat.target,
      duration: DUR.counter,
      ease: EASE_OUT_EXPO,
      onUpdate: () => setValue(obj.v),
      onComplete: () => setValue(stat.target),
    });
    return () => {
      tween.kill();
    };
  }, [started, reduced, stat]);

  return (
    <span className="font-mono text-[clamp(2.2rem,4.5vw,3.6rem)] leading-none tabular-nums text-fg-0">
      {stat.format(value)}
    </span>
  );
}

/** Telemetry band — production numbers as design elements. */
export function TelemetrySection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (reduced) {
      setStarted(true);
      return;
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 82%",
      once: true,
      onEnter: () => setStarted(true),
    });
    return () => st.kill();
  }, [reduced]);

  return (
    <section id="telemetry" aria-label="Production metrics" className="section-y !py-10">
      <div className="py-4">
        <Marquee items={MARQUEE_ITEMS} />
      </div>
      <div ref={rootRef} className="container-page py-10">
        <div className="glass rounded-3xl p-6 md:p-10">
          <p className="font-mono text-xs text-fg-2">
            <span className="text-accent">$</span> query --production-metrics{" "}
            <span className="text-fg-2/60">// measured, not marketing</span>
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 xl:grid-cols-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="group">
                <dt className="order-2 mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-1">
                  {stat.label}
                </dt>
                <dd className="order-1">
                  <Counter stat={stat} started={started} />
                </dd>
                <dd className="order-3 mt-2 text-xs leading-relaxed text-fg-2">
                  {stat.sub}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

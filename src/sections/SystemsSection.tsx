import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, Database } from "lucide-react";
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

function PanelBody({
  panel,
  compact = false,
}: {
  panel: SystemPanel;
  compact?: boolean;
}) {
  return (
    <div
      className={cn("flex h-full flex-col", compact && "min-h-0")}
      /* keep page scroll when dragging over body copy */
      style={compact ? { touchAction: "pan-y" } : undefined}
    >
      {/* compact mobile: title lives in the sticky chrome — skip duplicate */}
      {!compact ? (
        <>
          <div className="flex items-start justify-between gap-3">
            <p className="font-sans text-sm font-semibold text-accent">
              {panel.title}
            </p>
            <span className="shrink-0 rounded-full border border-accent/30 bg-accent-dim px-3 py-1 font-mono text-[11px] text-accent">
              {panel.metric}
            </span>
          </div>
          <p className="mt-1 text-sm text-fg-2">{panel.short}</p>
        </>
      ) : (
        <p className="font-mono text-[11px] text-accent">{panel.metric}</p>
      )}
      <ul className={cn(compact ? "mt-2 space-y-1.5" : "mt-5 space-y-3")}>
        {panel.bullets.map((b) => (
          <li
            key={b}
            className={cn(
              "flex gap-2.5 text-fg-1",
              compact ? "text-xs leading-snug" : "",
            )}
          >
            <span
              className={cn(
                "shrink-0 rounded-full bg-accent",
                compact ? "mt-1.5 h-1 w-1" : "mt-2 h-1.5 w-1.5",
              )}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className={cn("flex flex-wrap gap-1.5", compact ? "mt-2.5" : "mt-5 gap-2")}>
        {panel.stack.map((s) => (
          <Chip key={s} className={compact ? "!px-2 !py-0.5 !text-[10px]" : undefined}>
            {s}
          </Chip>
        ))}
      </div>

      {!compact && panel.id === "scoring" ? (
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
        <p className={cn("text-fg-2", compact ? "mt-2 text-[11px]" : "mt-4 text-xs")}>
          Confidential client work · product name and UI redacted. Architecture and
          ownership only.
        </p>
      ) : null}

      <div className={cn("mt-auto", compact ? "pt-3" : "pt-6")}>
        <WipeLink
          to={`/work/${panel.caseSlug}`}
          fromSection="systems"
          data-cursor="view"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-transparent font-sans font-semibold text-fg-0 transition hover:border-accent/40 hover:bg-accent-dim",
            compact ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm",
          )}
        >
          Case study
          <ArrowUpRight size={compact ? 14 : 16} aria-hidden />
        </WipeLink>
      </div>
    </div>
  );
}

/**
 * Mobile systems: CSS sticky stage + native scroll progress.
 * (No GSAP pin — overflow/ancestors were breaking sticky + ScrollTrigger.)
 */
function MobileSystemsStage({
  active,
  setActiveWithFade,
  panelRef,
  baseId,
  panel,
}: {
  active: number;
  setActiveWithFade: (i: number) => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
  baseId: string;
  panel: SystemPanel;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const activeRef = useRef(active);
  activeRef.current = active;

  /**
   * Mobile header: h-14 (3.5rem) + safe-area-top on the header itself.
   * Sit the stage 10px under that — no awkward floating gap, no overlap.
   */
  const stickyTopCss =
    "calc(3.5rem + env(safe-area-inset-top, 0px) + 10px)";
  // Remaining viewport: header + gap + bottom journey HUD
  const stageH =
    "calc(100svh - 3.5rem - env(safe-area-inset-top, 0px) - 10px - 5.25rem - env(safe-area-inset-bottom, 0px))";

  // Native scroll → active index (works with mobile native scroll, no Lenis)
  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      const trackH = track.offsetHeight;
      const vh = window.innerHeight || 1;
      // Distance you can scroll while the track is the focus
      const scrollRange = Math.max(1, trackH - vh);
      // How far we've scrolled into the track
      // When track top is at 0, scrolled = 0; when track bottom hits viewport bottom, scrolled = scrollRange
      const scrolled = Math.min(
        scrollRange,
        Math.max(0, -rect.top),
      );
      const t = scrolled / scrollRange;
      const i = Math.min(N - 1, Math.floor(t * N + 1e-6));
      if (i !== activeRef.current) setActiveWithFade(i);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // layout settle
    const t1 = window.setTimeout(measure, 100);
    const t2 = window.setTimeout(measure, 400);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, setActiveWithFade]);

  const jumpTo = (idx: number) => {
    const track = trackRef.current;
    if (!track) {
      setActiveWithFade(idx);
      return;
    }
    const rect = track.getBoundingClientRect();
    const trackTop = rect.top + window.scrollY;
    const trackH = track.offsetHeight;
    const vh = window.innerHeight;
    const scrollRange = Math.max(1, trackH - vh);
    // Land mid-segment for that card
    const y = trackTop + ((idx + 0.35) / N) * scrollRange;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    setActiveWithFade(idx);
  };

  if (reduced) {
    return (
      <div className="mt-10 space-y-4" data-reveal="none">
        {systemPanels.map((m) => (
          <article key={m.id} className="glass rounded-2xl p-4">
            <PanelBody panel={m} compact />
          </article>
        ))}
      </div>
    );
  }

  // ~1 viewport of runway per card — enough to switch, not a void after
  const trackVh = Math.max(N * 85, 200);

  return (
    <div
      ref={trackRef}
      className="relative mt-6"
      style={{ height: `${trackVh}vh` }}
      data-reveal="none"
    >
      <div
        className="glass-strong sticky z-[1] flex flex-col overflow-hidden rounded-2xl border border-border/70"
        style={{
          top: stickyTopCss,
          height: stageH,
          maxHeight: stageH,
          /* vertical gestures must scroll the page (switch systems), not a nested box */
          touchAction: "pan-y",
        }}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/50 px-3.5 py-2 sm:px-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-2">
            <span className="text-accent">sys</span> · scroll to switch
          </p>
          <p className="font-mono text-[11px] tabular-nums text-fg-2">
            <span className="text-accent">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="text-fg-2/45">/{String(N).padStart(2, "0")}</span>
          </p>
        </div>

        <div className="h-[2px] shrink-0 bg-white/6">
          <div
            className="h-full bg-gradient-to-r from-violet to-accent transition-[width] duration-300 ease-out"
            style={{ width: `${((active + 1) / N) * 100}%` }}
          />
        </div>

        <div className="shrink-0 border-b border-border/40 px-3.5 py-2.5 sm:px-4 sm:py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-display text-base leading-tight text-fg-0 sm:text-lg">
                {panel.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-fg-1">{panel.short}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                panel.badge === "Owned"
                  ? "bg-violet/15 text-[#b9a7ff]"
                  : "bg-ink-dim text-ink",
              )}
            >
              {panel.badge}
            </span>
          </div>

          <ol className="mt-3 flex items-center gap-1" aria-label="Systems progress">
            {systemPanels.map((m, idx) => (
              <li key={m.id} className="flex-1">
                <button
                  type="button"
                  aria-label={`Show ${m.title}`}
                  aria-current={idx === active ? "true" : undefined}
                  className="flex w-full touch-manipulation items-center justify-center py-1"
                  onClick={() => jumpTo(idx)}
                >
                  <span
                    className={cn(
                      "block h-1 w-full rounded-full transition-all duration-300",
                      idx === active
                        ? "bg-accent shadow-[0_0_8px_rgba(199,125,255,0.55)]"
                        : idx < active
                          ? "bg-violet/55"
                          : "bg-fg-2/25",
                    )}
                  />
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/*
          No overflow-y-auto here — nested scroll traps touch and forces
          users to scroll from the sides to advance systems. Page scroll only.
        */}
        <div
          ref={panelRef}
          className="min-h-0 flex-1 overflow-hidden px-4 py-3"
          role="tabpanel"
          id={`${baseId}-panel-mobile`}
          aria-labelledby={`${baseId}-tab-${panel.id}`}
          style={{ touchAction: "pan-y" }}
        >
          <PanelBody panel={panel} compact />
        </div>
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
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { scrollToId, scrollToY } = useScrollTo();

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const isDesktopRef = useRef(isDesktop);
  isDesktopRef.current = isDesktop;
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const panel = systemPanels[active];

  const setActiveWithFade = useCallback((i: number) => {
    if (i === activeRef.current) return;
    activeRef.current = i;
    fadeTween.current?.kill();
    const el = (
      isDesktopRef.current ? panelRef.current : mobilePanelRef.current
    ) as HTMLDivElement | null;
    if (el && !reducedRef.current) {
      fadeTween.current = gsap.fromTo(
        el,
        { autoAlpha: 0.15, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: DUR.panel,
          ease: "power3.out",
        },
      );
    }
    setActive(i);
  }, []);

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
        scrub: 0.9,
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
    <section
      id="systems"
      /* overflow-hidden breaks position:sticky on mobile — only clip on desktop */
      className={cn(
        "section-y relative",
        isDesktop && "overflow-hidden",
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(124,92,255,0.06),transparent_40%)]" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow="Featured systems"
          title="Systems I own end-to-end"
          description="Production GenAI on Bidstream · multi-agent generation, agentic scoring, GraphRAG retrieval, caching infrastructure, batch validation and observability. Confidential UIs redacted."
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
            // hide pipeline chips on mobile to save space before the sticky stage
            "max-lg:hidden",
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

        {isDesktop ? (
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
                          ? "border-accent/40 bg-accent-dim shadow-[0_0_0_1px_rgba(199,125,255,0.12)]"
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
                className="glass min-h-[320px] rounded-3xl p-6 md:p-8"
                role="tabpanel"
                id={`${baseId}-panel`}
                aria-labelledby={`${baseId}-tab-${panel.id}`}
              >
                <PanelBody panel={panel} />
              </div>
            </div>
          </div>
        ) : (
          <MobileSystemsStage
            active={active}
            setActiveWithFade={setActiveWithFade}
            panelRef={mobilePanelRef}
            baseId={baseId}
            panel={panel}
          />
        )}

        <p className="reveal mt-8 text-sm text-fg-2 lg:mt-10">
          {isDesktop
            ? "Scroll the section on desktop to move through systems. "
            : "Keep scrolling while the card is pinned to switch systems. "}
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
            fromSection="systems"
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

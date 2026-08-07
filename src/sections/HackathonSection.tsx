import { Trophy } from "lucide-react";
import { grantflow } from "@/content/grantflow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Chip } from "@/components/ui/Chip";
import { PullQuote } from "@/components/ui/PullQuote";
import { WipeLink } from "@/components/PageWipe";
import { Magnetic } from "@/components/fx/Magnetic";

export function HackathonSection() {
  return (
    <section id="hackathon" className="section-y">
      <div className="container-page">
        <div className="reveal mb-4 inline-flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          <Trophy size={14} aria-hidden />
          {grantflow.result}
        </div>

        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left column: copy + quote fills bottom */}
          <div className="reveal flex flex-col lg:col-span-5">
            <SectionHeading
              eyebrow="Proof under pressure"
              title={grantflow.title}
              description={`${grantflow.team} · team of ${grantflow.teamSize} · ${grantflow.duration}`}
            />
            <p className="mt-6 max-w-[38rem] text-base leading-relaxed text-fg-1">
              {grantflow.problem}
            </p>
            <ul className="mt-8 space-y-3 text-fg-1">
              {grantflow.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-[0.98rem] leading-relaxed">
                  <span className="mt-2 h-px w-4 shrink-0 bg-ink" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-2">
              {grantflow.tech.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <div className="mt-10">
              <Magnetic strength={0.25}>
                <WipeLink
                  to="/work/grantflow"
                  data-cursor="view"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-transparent px-5 py-2.5 font-sans text-sm font-semibold text-fg-0 transition hover:border-accent/40 hover:bg-accent-dim"
                >
                  Full essay
                </WipeLink>
              </Magnetic>
            </div>

            <div className="mt-auto pt-10">
              <PullQuote tone="accent" attribution="Why we won">
                Strategically choose features under time pressure, then make the LLM
                path nearly perfect.
              </PullQuote>
            </div>
          </div>

          {/* Right column: media stack */}
          <div className="reveal space-y-6 lg:col-span-7">
            <figure className="w-full">
              <div className="overflow-hidden rounded-xl border border-border bg-bg-1">
                <img
                  src={grantflow.media[0]}
                  alt="VibelySane team at organisational hackathon"
                  className="aspect-[16/10] w-full object-cover object-center"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-sm text-fg-2 sm:flex-row sm:justify-between">
                <span className="text-fg-1">
                  VibelySane shipping GrantFlow under an eight-hour constraint.
                </span>
                <span className="font-sans text-[11px] uppercase tracking-[0.16em]">
                  Figure 01
                </span>
              </figcaption>
            </figure>

            <figure className="w-full">
              <div className="overflow-hidden rounded-xl border border-border bg-bg-1">
                <img
                  src={grantflow.media[1]}
                  alt="Hackathon celebration dinner, full team photo"
                  className="mx-auto max-h-[420px] w-full object-contain object-center"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-sm text-fg-2 sm:flex-row sm:justify-between">
                <span className="text-fg-1">
                  Celebration after the win · prioritisation over feature sprawl.
                </span>
                <span className="font-sans text-[11px] uppercase tracking-[0.16em]">
                  Figure 02
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Trophy } from "lucide-react";
import { grantflow } from "@/content/grantflow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FigureWithCaption } from "@/components/ui/FigureWithCaption";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { PullQuote } from "@/components/ui/PullQuote";

export function HackathonSection() {
  return (
    <section id="hackathon" className="section-y bg-bg-1/20">
      <div className="container-page">
        <div className="reveal mb-4 inline-flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          <Trophy size={14} aria-hidden />
          {grantflow.result}
        </div>

        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.05fr]">
          <div className="reveal">
            <SectionHeading
              eyebrow="Proof under pressure"
              title={`${grantflow.title}`}
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
              <ButtonLink to="/work/grantflow" variant="outline">
                Full essay
              </ButtonLink>
            </div>
          </div>

          <div className="reveal space-y-8">
            <FigureWithCaption
              wide
              src={grantflow.media[0]}
              alt="VibelySane team at organisational hackathon"
              caption="VibelySane at the organisational hackathon — shipping GrantFlow under an eight-hour constraint."
              credit="Figure 01"
              className="!w-full"
              imgClassName="aspect-[16/10] w-full object-cover"
            />
            <PullQuote tone="accent" attribution="Why we won">
              Strategically choose features under time pressure — then make the LLM
              path nearly perfect.
            </PullQuote>
            <FigureWithCaption
              wide
              src={grantflow.media[1]}
              alt="Hackathon celebration dinner"
              caption="Celebration after the win — craft under constraint, not feature sprawl."
              credit="Figure 02"
              className="!w-full max-w-md"
              imgClassName="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import { Trophy } from "lucide-react";
import { grantflow } from "@/content/grantflow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

export function HackathonSection() {
  return (
    <section id="hackathon" className="section-y bg-bg-1/30">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div className="reveal">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-dim px-3 py-1 text-xs font-semibold text-accent">
            <Trophy size={14} aria-hidden />
            {grantflow.result}
          </div>
          <SectionHeading
            eyebrow="Proof under pressure"
            title={`${grantflow.title} · ${grantflow.team}`}
            description={grantflow.problem}
          />
          <ul className="mt-6 space-y-3 text-fg-1">
            {grantflow.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <Chip>{grantflow.team} · team of {grantflow.teamSize}</Chip>
            <Chip>{grantflow.duration}</Chip>
            {grantflow.tech.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink to="/work/grantflow" variant="outline">
              Case study
            </ButtonLink>
          </div>
        </div>

        <div className="reveal grid gap-4 sm:grid-cols-2">
          <MediaFrame
            src={grantflow.media[0]}
            alt="VibelySane team at organisational hackathon"
            className="sm:col-span-2"
            imgClassName="aspect-[16/10] w-full object-cover"
          />
          <MediaFrame
            src={grantflow.media[1]}
            alt="Hackathon celebration dinner"
            imgClassName="aspect-[4/3] w-full object-cover"
          />
          <div className="flex flex-col justify-end rounded-2xl border border-border bg-bg-0/70 p-5">
            <p className="font-display text-3xl font-bold text-accent">8h</p>
            <p className="mt-2 text-sm text-fg-1">
              Strategically prioritised scope, red-team scoring prompts, and
              chatbot guardrails — then shipped.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

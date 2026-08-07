import { awards, certifications } from "@/content/awards";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Chip } from "@/components/ui/Chip";

/** Proof under pressure · awards + certs as a telemetry strip */
export function AwardsSection() {
  return (
    <section id="awards" className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Recognition"
          title="Proof under pressure"
          description="Hackathons, competitions, and credentials that back the production work · not the other way around."
          className="reveal"
        />

        <ol className="reveal mt-14 grid gap-4 md:grid-cols-3">
          {awards.map((a) => (
            <li
              key={a.title}
              className="group glass relative overflow-hidden rounded-3xl p-6 transition hover:border-accent/30"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-xs text-accent">{a.rank}</span>
                <span className="font-mono text-[11px] text-fg-2">{a.year}</span>
              </div>
              <h3 className="mt-4 font-display text-xl leading-snug text-fg-0 md:text-2xl">
                {a.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-1">{a.detail}</p>
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition group-hover:opacity-100"
                aria-hidden
              />
            </li>
          ))}
        </ol>

        <div className="reveal mt-10 flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-2">
            Certifications
          </p>
          {certifications.map((c) => (
            <Chip key={c.title} className="border-accent/20 bg-accent-dim text-accent">
              {c.title}
              <span className="text-fg-2"> · {c.detail}</span>
            </Chip>
          ))}
        </div>
      </div>
    </section>
  );
}

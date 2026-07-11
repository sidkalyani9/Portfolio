import { profile } from "@/content/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FigureWithCaption } from "@/components/ui/FigureWithCaption";

export function AboutSection() {
  return (
    <section id="about" className="section-y bg-bg-1/15">
      <div className="container-page grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="reveal">
          <FigureWithCaption
            wide
            src="/media/display-pic.webp"
            alt={`Portrait of ${profile.name}`}
            caption={`${profile.name} — GenAI Engineer / Forward Deployed Engineer.`}
            credit="Portrait"
            className="!w-full"
            imgClassName="aspect-[4/5] w-full object-cover object-top"
          />
        </div>
        <div className="reveal lg:pt-6">
          <SectionHeading
            eyebrow="About"
            title="Quiet systems, high stakes"
            description={`I'm ${profile.name} — a GenAI Engineer / Forward Deployed Engineer based in ${profile.location}, open to remote roles.`}
          />
          <div className="mt-8 max-w-[38rem] space-y-5 text-base leading-relaxed text-fg-1">
            <p>
              On <strong className="text-fg-0">BidStreamAI</strong> at Argusoft, I own
              multi-agent proposal scoring — including a specialised persona classifier
              with DB-backed prompt caching — long-context RFP insights, automatic
              proposal CV generation, and level-2 catalog-grounded validation.
            </p>
            <p>
              The work that holds up is specialised, cached, and inspectable — not a
              single chat prompt hoping for the best.
            </p>
            <p className="text-sm text-fg-2">
              Outside delivery: gym, Formula 1, travel, and occasional YouTube — secondary
              to shipping AI systems.
            </p>
          </div>
          <dl className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            <div className="bg-bg-0 p-5">
              <dt className="font-sans text-[11px] uppercase tracking-[0.16em] text-fg-2">
                Focus
              </dt>
              <dd className="mt-2 text-sm text-fg-0">
                AI / GenAI Developer · Forward Deployed Engineer
              </dd>
            </div>
            <div className="bg-bg-0 p-5">
              <dt className="font-sans text-[11px] uppercase tracking-[0.16em] text-fg-2">
                Base
              </dt>
              <dd className="mt-2 text-sm text-fg-0">Ahmedabad · Open to remote</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

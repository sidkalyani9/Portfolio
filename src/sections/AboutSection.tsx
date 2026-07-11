import { profile } from "@/content/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaFrame } from "@/components/ui/MediaFrame";

export function AboutSection() {
  return (
    <section id="about" className="section-y">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="reveal">
          <MediaFrame
            src="/media/display-pic.webp"
            alt={`Portrait of ${profile.name}`}
            imgClassName="aspect-[4/5] w-full object-cover object-top"
          />
        </div>
        <div className="reveal">
          <SectionHeading
            eyebrow="About"
            title="Forward-deployed GenAI engineer"
            description={`I'm ${profile.name} — a GenAI Engineer / Forward Deployed Engineer based in ${profile.location}, open to remote roles. I care about systems that survive messy documents, specialised evaluation, and real product constraints.`}
          />
          <div className="mt-6 space-y-4 text-fg-1">
            <p>
              On <strong className="text-fg-0">BidStreamAI</strong> at Argusoft, I
              own multi-agent proposal scoring (including a persona classifier with
              DB-backed prompt caching), long-context RFP insights, automatic
              proposal CV generation, and level-2 catalog-grounded validation.
            </p>
            <p>
              Outside core delivery I enjoy gym training, Formula 1, travel, and
              making YouTube content — secondary to the craft of shipping AI
              systems.
            </p>
          </div>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-bg-1/40 p-4">
              <dt className="text-xs uppercase tracking-wide text-fg-2">Focus</dt>
              <dd className="mt-1 text-sm text-fg-0">
                AI / GenAI Developer · Forward Deployed Engineer
              </dd>
            </div>
            <div className="rounded-2xl border border-border bg-bg-1/40 p-4">
              <dt className="text-xs uppercase tracking-wide text-fg-2">Base</dt>
              <dd className="mt-1 text-sm text-fg-0">
                Ahmedabad · Open to remote
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

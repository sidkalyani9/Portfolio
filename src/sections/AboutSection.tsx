import { profile } from "@/content/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FigureWithCaption } from "@/components/ui/FigureWithCaption";

const FACTS = [
  { k: "Focus", v: "AI/GenAI · Forward-Deployed Engineer" },
  { k: "Base", v: "Ahmedabad · Open to remote" },
  { k: "Stack", v: "Vertex AI · Gemini · Google ADK · FastAPI" },
  { k: "Scale", v: "1B+ tokens · 1M+ pages in production" },
] as const;

export function AboutSection() {
  return (
    <section id="about" className="section-y">
      <div className="container-page grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="reveal" data-reveal="clip">
          <FigureWithCaption
            wide
            src="/media/display-pic.webp"
            alt={`Portrait of ${profile.name}`}
            caption={`${profile.name} · AI/GenAI & Forward-Deployed Engineer.`}
            credit="Portrait"
            className="!w-full"
            imgClassName="aspect-[4/5] w-full object-cover object-top"
          />
        </div>
        <div className="reveal glass rounded-3xl p-6 md:p-8 lg:pt-8">
          <SectionHeading
            eyebrow="About"
            title="Quiet systems, high stakes"
            description={`I'm ${profile.name} · ${profile.roleLine} based in ${profile.location}, open to remote roles.`}
          />
          <div className="mt-8 max-w-[38rem] space-y-5 text-base leading-relaxed text-fg-1">
            <p>
              At Argusoft I own production GenAI systems end-to-end: multi-agent
              proposal generation on Google ADK, a 6-stage agentic scoring engine, a
              GraphRAG search layer over 100K+ RFP insights, and the Vertex AI caching
              platform that cut inference cost by 80%.
            </p>
            <p>
              The work that holds up is specialised, secured, and inspectable · not a
              single chat prompt hoping for the best. Observability, caching, and
              fail-safe LLM paths are first-class, not afterthoughts.
            </p>
            <p className="text-sm text-fg-2">
              Outside delivery: gym, Formula 1, travel, and occasional YouTube · 
              secondary to shipping AI systems.
            </p>
          </div>
          <dl className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {FACTS.map((f) => (
              <div key={f.k} className="bg-bg-0 p-5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-2">
                  {f.k}
                </dt>
                <dd className="mt-2 text-sm text-fg-0">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

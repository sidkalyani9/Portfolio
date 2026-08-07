import { experience } from "@/content/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Concept E — CV-like experience, sparse and scannable */
export function ExperienceSection() {
  return (
    <section id="experience" className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Experience"
          title="Curriculum"
          description="From internship foundations into production GenAI — multi-agent systems, GraphRAG, Vertex AI caching, and LLMOps at scale."
          className="reveal"
          kinetic
        />

        <div className="reveal mt-16 border-t border-border">
          {experience.map((item) => (
            <article
              key={`${item.title}-${item.date}`}
              className="group grid gap-4 border-b border-border py-8 transition hover:bg-bg-1/20 md:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] md:gap-10 md:px-4"
            >
              <div>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-fg-2">
                  {item.date}
                </p>
                <p className="mt-2 text-sm text-fg-1">{item.org}</p>
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt=""
                    width={36}
                    height={36}
                    className="mt-4 h-9 w-9 rounded-md border border-border bg-white object-contain p-1"
                  />
                ) : null}
              </div>
              <div>
                <h3 className="font-display text-2xl text-fg-0">{item.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {item.bullets.map((b) => (
                    <li
                      key={b}
                      className="max-w-[42rem] text-sm leading-relaxed text-fg-1 md:text-[0.95rem]"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

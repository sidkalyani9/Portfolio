import { experience } from "@/content/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ExperienceSection() {
  return (
    <section id="experience" className="section-y bg-bg-1/25">
      <div className="container-page">
        <SectionHeading
          eyebrow="Experience"
          title="Path into GenAI product engineering"
          description="From full-stack foundations at Argusoft to owning multi-agent workflows on BidStreamAI."
          className="reveal"
        />

        <ol className="reveal relative mt-12 space-y-6 border-l border-border pl-6 md:pl-8">
          {experience.map((item) => (
            <li key={`${item.title}-${item.date}`} className="relative">
              <span
                className="absolute -left-[1.9rem] top-2 h-3 w-3 rounded-full border-2 border-bg-0 bg-accent md:-left-[2.4rem]"
                aria-hidden
              />
              <article className="rounded-2xl border border-border bg-bg-0/50 p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt=""
                        className="mt-0.5 h-10 w-10 rounded-lg border border-border bg-white object-contain p-1"
                      />
                    ) : null}
                    <div>
                      <h3 className="font-display text-lg font-bold text-fg-0 md:text-xl">
                        {item.title}
                      </h3>
                      <p className="text-sm text-fg-1">{item.org}</p>
                    </div>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wide text-fg-2">
                    {item.date}
                  </p>
                </div>
                <ul className="mt-4 space-y-2">
                  {item.bullets.map((b) => (
                    <li key={b} className="text-sm text-fg-1 md:text-[0.95rem]">
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

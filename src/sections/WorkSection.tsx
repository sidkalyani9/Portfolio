import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { featuredProjects, projects } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

export function WorkSection() {
  return (
    <section id="work" className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Selected work"
          title="Systems that ship"
          description="P0 product depth on BidStreamAI and GrantFlow, plus full-stack and mobile builds that show engineering breadth."
          className="reveal"
        />

        <div
          className="reveal mt-12 grid gap-5 md:grid-cols-2"
          role="list"
          aria-label="Featured projects"
        >
          {featuredProjects.map((project, index) => {
            const isP0 = project.priority === "P0";
            return (
              <article
                key={project.slug}
                role="listitem"
                className={cn(
                  "group overflow-hidden rounded-3xl border border-border bg-bg-1/40 transition hover:border-accent/30 focus-within:border-accent/40",
                  isP0 && index === 0 && "md:col-span-2",
                )}
              >
                <Link
                  to={`/work/${project.slug}`}
                  className={cn(
                    "grid gap-0 outline-none",
                    isP0 && index === 0 && "lg:grid-cols-2",
                  )}
                >
                  <MediaFrame
                    src={project.cover}
                    alt={`${project.title} preview`}
                    className="rounded-none border-0 shadow-none"
                    imgClassName={cn(
                      "w-full object-cover transition duration-500 group-hover:scale-[1.02]",
                      isP0 && index === 0 ? "aspect-[16/10] lg:aspect-auto lg:min-h-[320px]" : "aspect-[16/10]",
                    )}
                  />
                  <div className="flex flex-col justify-center p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip
                        className={
                          isP0
                            ? "border-accent/30 bg-accent-dim text-accent"
                            : undefined
                        }
                      >
                        {project.priority}
                      </Chip>
                      {project.tech.slice(0, 3).map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                    <h3 className="mt-4 font-display text-2xl text-fg-0 md:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-sm text-fg-1 md:text-base">
                      {project.problem}
                    </p>
                    <p className="mt-3 text-sm text-fg-2">
                      <span className="text-fg-1">Role:</span> {project.role}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent">
                      View
                      <ArrowUpRight
                        size={16}
                        className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        <div className="reveal mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-2">
            Also
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {projects
              .filter((p) => p.priority === "P2")
              .map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/work/${p.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-1/50 px-4 py-2 text-sm text-fg-1 transition hover:border-accent/30 hover:text-fg-0"
                  >
                    {p.title}
                    <ArrowUpRight size={14} aria-hidden />
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

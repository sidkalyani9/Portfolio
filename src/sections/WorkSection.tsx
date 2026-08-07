import { ArrowUpRight } from "lucide-react";
import { alsoProjects, featuredProjects, type Project } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Chip } from "@/components/ui/Chip";
import { WipeLink } from "@/components/PageWipe";
import { DistortionMedia } from "@/components/fx/DistortionMedia";
import { cn } from "@/lib/cn";

function ProjectMeta({ project }: { project: Project }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Chip
          className={
            project.priority === "P0"
              ? "border-accent/30 bg-accent-dim text-accent"
              : undefined
          }
        >
          {project.confidential ? "Confidential" : project.priority}
        </Chip>
        {project.tech.slice(0, 4).map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
      <h3 className="mt-4 font-display text-2xl text-fg-0 md:text-3xl">
        {project.title}
      </h3>
      <p className="mt-3 text-sm text-fg-1 md:text-base">{project.problem}</p>
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
    </>
  );
}

function MediaCard({ project, full }: { project: Project; full?: boolean }) {
  return (
    <article
      className={cn(
        "group glass overflow-hidden rounded-3xl transition hover:border-accent/30 focus-within:border-accent/40",
        full && "md:col-span-2",
      )}
    >
      <WipeLink
        to={`/work/${project.slug}`}
        data-cursor="view"
        className={cn("grid gap-0 outline-none", full && "lg:grid-cols-2")}
      >
        {project.cover ? (
          <DistortionMedia>
            <MediaFrame
              src={project.cover}
              alt={`${project.title} preview`}
              className="rounded-none border-0 shadow-none"
              imgClassName={cn(
                "w-full object-cover transition duration-500 group-hover:scale-[1.03]",
                full ? "aspect-[16/10] lg:aspect-auto lg:min-h-[300px]" : "aspect-[16/10]",
              )}
            />
          </DistortionMedia>
        ) : null}
        <div className="flex flex-col justify-center p-6 md:p-8">
          <ProjectMeta project={project} />
        </div>
      </WipeLink>
    </article>
  );
}

function TextRow({ project }: { project: Project }) {
  return (
    <article className="group glass md:col-span-2 overflow-hidden rounded-3xl transition hover:border-accent/30 focus-within:border-accent/40">
      <WipeLink
        to={`/work/${project.slug}`}
        data-cursor="view"
        className="grid gap-6 p-6 outline-none md:grid-cols-[1fr_1.1fr] md:p-8"
      >
        <div>
          <ProjectMeta project={project} />
        </div>
        <ul className="space-y-3 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          {project.outcome
            .split(/(?<=\.)\s+/)
            .filter(Boolean)
            .slice(0, 4)
            .map((line) => (
              <li key={line} className="flex gap-3 text-sm text-fg-1">
                <span className="mt-2 h-px w-4 shrink-0 bg-ink" aria-hidden />
                {line}
              </li>
            ))}
          {project.confidential ? (
            <li className="text-xs text-fg-2">
              No product screenshots · confidential client work.
            </li>
          ) : null}
        </ul>
      </WipeLink>
    </article>
  );
}

export function WorkSection() {
  return (
    <section id="work" className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Selected work"
          title="Systems & products"
          description="Production GenAI ownership, confidential platform integrations, public apps, and a hackathon win · architecture and role first."
          className="reveal"
        />

        <div
          className="reveal mt-12 grid gap-5 md:grid-cols-2"
          role="list"
          aria-label="Featured projects"
        >
          {featuredProjects.map((project) => {
            const full = project.layout === "full" || project.layout === "text";
            if (project.layout === "text" || project.cover === null) {
              return (
                <div key={project.slug} role="listitem" className="contents">
                  <TextRow project={project} />
                </div>
              );
            }
            return (
              <div key={project.slug} role="listitem" className="contents">
                <MediaCard project={project} full={full} />
              </div>
            );
          })}
        </div>

        <div className="reveal mt-10">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-2">
            Also
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {alsoProjects.map((p) => (
              <li key={p.slug}>
                <WipeLink
                  to={`/work/${p.slug}`}
                  data-cursor="view"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-1/50 px-4 py-2 text-sm text-fg-1 transition hover:border-accent/30 hover:text-fg-0"
                >
                  {p.title}
                  <ArrowUpRight size={14} aria-hidden />
                </WipeLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

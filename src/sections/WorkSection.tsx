import { ArrowUpRight } from "lucide-react";
import {
  alsoProjects,
  featuredProjects,
  projects,
  type Project,
} from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Chip } from "@/components/ui/Chip";
import { WipeLink } from "@/components/PageWipe";
import { HoverPreview } from "@/components/fx/HoverPreview";
import { TextRoll } from "@/components/fx/TextRoll";
import { Magnetic } from "@/components/fx/Magnetic";
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
      <h3 className="mt-4 font-display text-2xl text-fg-0 transition group-hover:text-accent md:text-3xl">
        {project.title}
      </h3>
      <p className="mt-3 text-sm text-fg-1 md:text-base">{project.problem}</p>
      <p className="mt-3 text-sm text-fg-2">
        <span className="text-fg-1">Role:</span> {project.role}
      </p>
      <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent">
        <span className="group/view">
          <TextRoll text="View project" />
        </span>
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
      data-preview-id={project.slug}
      className={cn(
        "group overflow-hidden rounded-3xl border border-border bg-bg-1/40 transition hover:border-accent/30 focus-within:border-accent/40",
        full && "md:col-span-2",
      )}
    >
      <WipeLink
        to={`/work/${project.slug}`}
        data-cursor="view"
        data-cursor-label="View"
        className={cn("grid gap-0 outline-none", full && "lg:grid-cols-2")}
      >
        {project.cover ? (
          <MediaFrame
            src={project.cover}
            alt={`${project.title} preview`}
            className="rounded-none border-0 shadow-none"
            imgClassName={cn(
              "w-full object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]",
              full ? "aspect-[16/10] lg:aspect-auto lg:min-h-[300px]" : "aspect-[16/10]",
            )}
          />
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
    <article
      data-preview-id={project.slug}
      className="group md:col-span-2 overflow-hidden rounded-3xl border border-border bg-bg-1/30 transition hover:border-accent/30 hover:bg-bg-1/50 focus-within:border-accent/40"
    >
      <WipeLink
        to={`/work/${project.slug}`}
        data-cursor="view"
        data-cursor-label="View"
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
              No product screenshots — confidential client work.
            </li>
          ) : null}
        </ul>
      </WipeLink>
    </article>
  );
}

export function WorkSection() {
  const previewItems = projects.map((p) => ({
    id: p.slug,
    src: p.cover,
    title: p.title,
  }));

  return (
    <section id="work" className="section-y">
      <HoverPreview items={previewItems} />
      <div className="container-page">
        <SectionHeading
          eyebrow="Selected work"
          title="Systems & products"
          description="Production GenAI ownership, confidential platform integrations, public apps, and a hackathon win — architecture and role first."
          className="reveal"
          kinetic
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
                <Magnetic strength={0.22}>
                  <WipeLink
                    to={`/work/${p.slug}`}
                    data-cursor="view"
                    data-cursor-label="View"
                    data-preview-id={p.slug}
                    className="group inline-flex items-center gap-2 rounded-full border border-border bg-bg-1/50 px-4 py-2 text-sm text-fg-1 transition hover:border-accent/30 hover:text-fg-0"
                  >
                    <TextRoll text={p.title} />
                    <ArrowUpRight size={14} aria-hidden />
                  </WipeLink>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

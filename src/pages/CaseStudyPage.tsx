import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { bidstreamCaseStudy, bidstreamModules, bidstreamStack } from "@/content/bidstream";
import { grantflow } from "@/content/grantflow";
import { projects } from "@/content/projects";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Chip } from "@/components/ui/Chip";
import { ButtonLink } from "@/components/ui/Button";
import { useReveal } from "@/hooks/useReveal";

export function CaseStudyPage() {
  const { slug } = useParams();
  useReveal();

  if (slug === "bidstream-ai") {
    return (
      <article className="section-y pt-28">
        <div className="container-narrow reveal">
          <Link
            to="/#work"
            className="inline-flex items-center gap-2 text-sm text-fg-1 hover:text-accent"
          >
            <ArrowLeft size={16} aria-hidden /> Back to work
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Case study · P0
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-fg-0 md:text-6xl">
            {bidstreamCaseStudy.title}
          </h1>
          <p className="mt-4 text-lg text-fg-1">{bidstreamCaseStudy.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {bidstreamStack.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </div>

        <div className="container-page reveal mt-12">
          <MediaFrame
            src={bidstreamCaseStudy.media[0]}
            alt="BidStreamAI proposal scoring UI"
            imgClassName="max-h-[480px] w-full object-cover object-top"
          />
        </div>

        <div className="container-narrow reveal mt-12 space-y-10 text-fg-1">
          <section>
            <h2 className="font-display text-2xl font-bold text-fg-0">Problem</h2>
            <p className="mt-3">{bidstreamCaseStudy.problem}</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-fg-0">Role</h2>
            <p className="mt-3">{bidstreamCaseStudy.role}</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-fg-0">System map</h2>
            <ol className="mt-4 flex flex-wrap gap-2">
              {bidstreamCaseStudy.pipeline.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-border bg-bg-1 px-3 py-1.5 text-sm text-fg-0"
                >
                  {s}
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-fg-0">
              Owned modules
            </h2>
            <div className="mt-6 space-y-6">
              {bidstreamModules.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-border bg-bg-1/40 p-5"
                >
                  <h3 className="font-display text-xl font-bold text-fg-0">
                    {m.title}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {m.detail.map((d) => (
                      <li key={d} className="text-sm">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-fg-0">Outcome</h2>
            <p className="mt-3">{bidstreamCaseStudy.outcome}</p>
            <p className="mt-4 text-sm text-fg-2">
              Client specifics kept generic (medical-domain) — no invented metrics.
            </p>
          </section>
          <ButtonLink to="/#contact">Discuss GenAI / FDE roles</ButtonLink>
        </div>
      </article>
    );
  }

  if (slug === "grantflow") {
    return (
      <article className="section-y pt-28">
        <div className="container-narrow reveal">
          <Link
            to="/#work"
            className="inline-flex items-center gap-2 text-sm text-fg-1 hover:text-accent"
          >
            <ArrowLeft size={16} aria-hidden /> Back to work
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Hackathon win · {grantflow.team}
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-fg-0 md:text-6xl">
            {grantflow.title}
          </h1>
          <p className="mt-4 text-lg text-fg-1">
            {grantflow.result} · team of {grantflow.teamSize} · {grantflow.duration}
          </p>
        </div>
        <div className="container-page reveal mt-10 grid gap-4 md:grid-cols-2">
          {grantflow.media.map((src, i) => (
            <MediaFrame
              key={src}
              src={src}
              alt={i === 0 ? "Hackathon team photo" : "Hackathon dinner"}
              imgClassName="aspect-[4/3] w-full object-cover"
            />
          ))}
        </div>
        <div className="container-narrow reveal mt-12 space-y-8 text-fg-1">
          <section>
            <h2 className="font-display text-2xl font-bold text-fg-0">Problem</h2>
            <p className="mt-3">{grantflow.problem}</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-fg-0">Approach</h2>
            <p className="mt-3">{grantflow.approach}</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-fg-0">Outcome</h2>
            <p className="mt-3">{grantflow.outcome}</p>
          </section>
          <div className="flex flex-wrap gap-2">
            {grantflow.tech.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <ButtonLink to="/#contact">Get in touch</ButtonLink>
        </div>
      </article>
    );
  }

  const project = projects.find((p) => p.slug === slug);
  if (!project) return <Navigate to="/" replace />;

  return (
    <article className="section-y pt-28">
      <div className="container-narrow reveal">
        <Link
          to="/#work"
          className="inline-flex items-center gap-2 text-sm text-fg-1 hover:text-accent"
        >
          <ArrowLeft size={16} aria-hidden /> Back to work
        </Link>
        <h1 className="mt-8 font-display text-4xl font-extrabold text-fg-0 md:text-5xl">
          {project.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
        <MediaFrame
          src={project.cover}
          alt={`${project.title} cover`}
          className="mt-10"
          imgClassName="aspect-video w-full object-cover"
        />
        <div className="mt-10 space-y-6 text-fg-1">
          <p>
            <strong className="text-fg-0">Problem.</strong> {project.problem}
          </p>
          <p>
            <strong className="text-fg-0">Role.</strong> {project.role}
          </p>
          <p>
            <strong className="text-fg-0">Outcome.</strong> {project.outcome}
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {project.links.map((l) => (
            <ButtonLink
              key={l.href}
              to={l.href}
              variant={l.href.startsWith("http") ? "outline" : "primary"}
            >
              {l.label}
            </ButtonLink>
          ))}
        </div>
      </div>
    </article>
  );
}

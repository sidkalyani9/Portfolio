import { Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  bidstreamCaseStudy,
  bidstreamModules,
  bidstreamStack,
} from "@/content/bidstream";
import { grantflow } from "@/content/grantflow";
import { projects } from "@/content/projects";
import { systemPanels } from "@/content/systems";
import { Chip } from "@/components/ui/Chip";
import { ButtonLink } from "@/components/ui/Button";
import { PullQuote } from "@/components/ui/PullQuote";
import { LongreadSection } from "@/components/ui/LongreadSection";
import { FigureWithCaption } from "@/components/ui/FigureWithCaption";
import { SplitText } from "@/components/fx/SplitText";
import { Magnetic } from "@/components/fx/Magnetic";
import { WipeLink } from "@/components/PageWipe";
import { useReveal } from "@/hooks/useReveal";

function BackLink({ section = "work" }: { section?: string }) {
  return (
    <WipeLink
      to={`/#${section}`}
      className="inline-flex items-center gap-2 font-sans text-sm text-fg-1 transition hover:text-accent"
    >
      <ArrowLeft size={16} aria-hidden /> Back to work
    </WipeLink>
  );
}

function ConfidentialNote() {
  return (
    <p className="rounded-xl border border-border bg-bg-1/50 px-4 py-3 font-mono text-sm text-fg-2">
      <span className="text-accent">//</span> Confidential client engagement — product
      name and UI redacted. Facts below describe ownership and architecture only.
    </p>
  );
}

function CaseEyebrow({ children }: { children: string }) {
  return (
    <p className="mt-10 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
      {children}
    </p>
  );
}

export function CaseStudyPage() {
  const { slug } = useParams();
  useReveal();

  if (slug === "bidstream-ai") {
    return (
      <article className="section-y pt-28">
        <header className="container-measure reveal">
          <BackLink section="systems" />
          <CaseEyebrow>Case study · P0 · Internal product</CaseEyebrow>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.25rem)] text-fg-0">
            <SplitText text={bidstreamCaseStudy.title} start delay={0.05} />
          </h1>
          <p className="mt-2 font-mono text-sm text-fg-2">
            {bidstreamCaseStudy.productLine}
          </p>
          <p className="mt-4 font-display text-xl italic text-fg-1 md:text-2xl">
            {bidstreamCaseStudy.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {bidstreamStack.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </header>

        <div className="container-measure reveal mt-12">
          <ConfidentialNote />
        </div>

        <div className="container-measure reveal mt-12 space-y-14">
          <LongreadSection number="01" title="Problem">
            <p>{bidstreamCaseStudy.problem}</p>
          </LongreadSection>

          <LongreadSection number="02" title="Role">
            <p>{bidstreamCaseStudy.role}</p>
          </LongreadSection>

          <LongreadSection number="03" title="System map">
            <p>
              End-to-end pipeline from RFP intake through proposal scoring. I owned the
              modules below while contributing across the product.
            </p>
            <ol className="mt-4 flex flex-wrap gap-2">
              {bidstreamCaseStudy.pipeline.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-border bg-bg-1 px-3 py-1.5 font-mono text-xs font-medium text-fg-0"
                >
                  {s}
                </li>
              ))}
            </ol>
          </LongreadSection>

          <PullQuote attribution="Flagship design — specialised persona classifier">
            Read the section. Choose a persona such as technical:fastapi/python. Check
            the database. On a miss, write the prompt, cache it, then hand off to the
            section scoring agent.
          </PullQuote>

          <LongreadSection number="04" title="Owned modules">
            <div className="space-y-8 !max-w-none">
              {bidstreamModules.map((m, i) => (
                <div key={m.id} className="border-t border-border pt-6">
                  <h3 className="font-display text-xl text-fg-0">
                    <span className="mr-2 font-mono text-xs text-ink">
                      0{i + 1}
                    </span>
                    {m.title}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {m.detail.map((d) => (
                      <li key={d} className="flex gap-3 text-sm leading-relaxed">
                        <span className="mt-2 h-px w-3 shrink-0 bg-accent/60" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </LongreadSection>

          <LongreadSection number="05" title="Engineering notes">
            <p>
              Stack: <strong>LlamaIndex</strong>, <strong>Vertex AI</strong>,{" "}
              <strong>FastAPI</strong>, <strong>React</strong>, Gemini long-context
              (~1M). Caching is first-class for persona prompts and Level-2 validation
              against a medical-domain product catalog.
            </p>
          </LongreadSection>

          <LongreadSection number="06" title="Outcome">
            <p>{bidstreamCaseStudy.outcome}</p>
            <p className="text-sm text-fg-2">
              No company UI screenshots. No invented performance metrics.
            </p>
          </LongreadSection>

          <div className="rule" />
          <Magnetic>
            <ButtonLink to="/#contact">Discuss GenAI / FDE roles</ButtonLink>
          </Magnetic>
        </div>
      </article>
    );
  }

  if (slug === "grantflow") {
    return (
      <article className="section-y pt-28">
        <header className="container-measure reveal">
          <BackLink />
          <CaseEyebrow>
            {`Hackathon · ${grantflow.team}`}
          </CaseEyebrow>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.25rem)] text-fg-0">
            <SplitText text={grantflow.title} start delay={0.05} />
          </h1>
          <p className="mt-4 text-lg text-fg-1">
            {grantflow.result} · team of {grantflow.teamSize} · {grantflow.duration}
          </p>
        </header>

        <div className="reveal mt-12 grid gap-10">
          <FigureWithCaption
            wide
            src={grantflow.media[0]}
            alt="Hackathon team photo"
            caption="VibelySane shipping GrantFlow under an eight-hour constraint."
            credit="Figure 01"
            imgClassName="aspect-[16/10] w-full object-cover"
          />
          <FigureWithCaption
            src={grantflow.media[1]}
            alt="Hackathon dinner"
            caption="Celebration after the win — prioritisation over unfinished sprawl."
            credit="Figure 02"
            imgClassName="max-h-[420px] w-full object-contain"
          />
        </div>

        <div className="container-measure reveal mt-16 space-y-12">
          <LongreadSection number="01" title="Problem">
            <p>{grantflow.problem}</p>
          </LongreadSection>
          <LongreadSection number="02" title="Approach">
            <p>{grantflow.approach}</p>
          </LongreadSection>
          <PullQuote tone="accent" attribution="Red-team prompts · form-fill guardrails">
            Near-perfect LLM integration under time pressure: score rigorously, and
            never let free-form chat break the form.
          </PullQuote>
          <LongreadSection number="03" title="Outcome">
            <p>{grantflow.outcome}</p>
          </LongreadSection>
          <LongreadSection number="04" title="Skills transferred">
            <p>
              The same judgement shows up in production GenAI and platform work:
              prioritise under constraint, design LLM paths that fail safely, and treat
              scoring prompts as systems — not one-off messages.
            </p>
          </LongreadSection>
          <div className="flex flex-wrap gap-2">
            {grantflow.tech.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <Magnetic>
            <ButtonLink to="/#contact">Get in touch</ButtonLink>
          </Magnetic>
        </div>
      </article>
    );
  }

  // Anonymous systems from systems.ts
  const system = systemPanels.find((p) => p.caseSlug === slug && p.kind === "anonymous");
  if (system) {
    return (
      <article className="section-y pt-28">
        <header className="container-measure reveal">
          <BackLink section="systems" />
          <CaseEyebrow>Case study · Confidential</CaseEyebrow>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] text-fg-0">
            <SplitText text={system.title} start delay={0.05} />
          </h1>
          <p className="mt-4 text-lg text-fg-1">{system.short}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {system.stack.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </header>

        <div className="container-measure reveal mt-10 space-y-12">
          <ConfidentialNote />
          <LongreadSection number="01" title="Context">
            <p>
              {slug === "authenticated-scraping-automation"
                ? "Client scraping platform requiring reliable authenticated access for automated collection workflows."
                : "Client messaging platform with a video meeting feature that needed post-meeting intelligence in product."}
            </p>
          </LongreadSection>
          <LongreadSection number="02" title="Problem">
            <p>
              {slug === "authenticated-scraping-automation"
                ? "Automated login had to handle credentials securely and complete 2FA without hardcoding secrets or manual OTP entry each run."
                : "Video meetings produced speech that needed to become transcripts and actionable summaries inside the messaging experience."}
            </p>
          </LongreadSection>
          <LongreadSection number="03" title="Role">
            <p>Owned the end-to-end solution described below.</p>
          </LongreadSection>
          <LongreadSection number="04" title="Approach">
            <ul className="space-y-2">
              {system.detail.map((d) => (
                <li key={d} className="flex gap-3">
                  <span className="mt-2 h-px w-3 shrink-0 bg-accent/60" />
                  {d}
                </li>
              ))}
            </ul>
          </LongreadSection>
          <LongreadSection number="05" title="Stack">
            <p>
              {system.stack.join(" · ")}
              {slug === "meeting-intelligence-pipeline"
                ? ". Speech-to-text and summarization use cost-efficient production-style models (representative: Whisper-class STT + Flash/mini-class LLM) — exact production model names may vary."
                : "."}
            </p>
          </LongreadSection>
          <LongreadSection number="06" title="Outcome">
            <p>
              {projects.find((p) => p.slug === slug)?.outcome ??
                "Shipped as a reliable production path without exposing client UI."}
            </p>
          </LongreadSection>
          <Magnetic>
            <ButtonLink to="/#contact">Discuss similar systems</ButtonLink>
          </Magnetic>
        </div>
      </article>
    );
  }

  const project = projects.find((p) => p.slug === slug);
  if (!project) return <Navigate to="/" replace />;

  return (
    <article className="section-y pt-28">
      <div className="container-measure reveal">
        <BackLink />
        <h1 className="mt-10 font-display text-[clamp(2.25rem,5vw,3.5rem)] text-fg-0">
          <SplitText text={project.title} start delay={0.05} />
        </h1>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      </div>
      {project.cover ? (
        <div className="reveal mt-10" data-reveal="clip">
          <FigureWithCaption
            wide
            src={project.cover}
            alt={`${project.title} cover`}
            caption={project.outcome}
            credit={project.priority}
            imgClassName="aspect-video w-full object-cover"
          />
        </div>
      ) : (
        <div className="container-measure reveal mt-10">
          <ConfidentialNote />
        </div>
      )}
      <div className="container-measure reveal mt-12 space-y-8">
        <LongreadSection title="Problem">
          <p>{project.problem}</p>
        </LongreadSection>
        <LongreadSection title="Role">
          <p>{project.role}</p>
        </LongreadSection>
        <LongreadSection title="Outcome">
          <p>{project.outcome}</p>
        </LongreadSection>
        <div className="flex flex-wrap gap-3">
          {project.links.map((l) => (
            <Magnetic key={l.href} strength={0.25}>
              <ButtonLink
                to={l.href}
                variant={l.href.startsWith("http") ? "outline" : "primary"}
              >
                {l.label}
              </ButtonLink>
            </Magnetic>
          ))}
        </div>
      </div>
    </article>
  );
}

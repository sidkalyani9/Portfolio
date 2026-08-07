import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/fx/Magnetic";
import { TextRoll } from "@/components/fx/TextRoll";
import { SplitText } from "@/components/fx/SplitText";
import { useResumeHref } from "@/hooks/useResumeHref";
import { profile } from "@/content/profile";

export function ContactSection() {
  const resume = useResumeHref();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="section-y">
      <div className="container-page text-center">
        <div className="reveal">
          <SectionHeading
            align="center"
            eyebrow="Contact"
            title="Let's make something remarkable"
            description="Hiring for AI / GenAI Developer or Forward Deployed Engineer roles — especially end-to-end LLM systems in production."
            kinetic
          />

          <a
            href={`mailto:${profile.email}`}
            data-cursor="view"
            data-cursor-label="Email"
            className="mt-12 block font-display text-[clamp(1.6rem,5.5vw,4rem)] italic text-fg-0 transition hover:text-accent"
          >
            <SplitText text={profile.email} onScroll />
          </a>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <ButtonLink to={`mailto:${profile.email}`} data-cursor="link">
                <TextRoll text="Say hello" />
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.25}>
              <ButtonLink
                to="https://www.linkedin.com/in/siddharth-kalyani/"
                variant="outline"
                data-cursor="link"
              >
                LinkedIn
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.25}>
              <ButtonLink to={resume.href} variant="ghost" data-cursor="link">
                {resume.label}
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.2}>
              <button
                type="button"
                onClick={copyEmail}
                data-cursor="link"
                data-cursor-label="Copy"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-1/50 px-4 py-2.5 font-sans text-sm text-fg-1 transition hover:border-accent/40 hover:text-accent"
              >
                {copied ? (
                  <Check size={14} className="text-accent" aria-hidden />
                ) : (
                  <Copy size={14} aria-hidden />
                )}
                {copied ? "Copied" : "Copy email"}
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

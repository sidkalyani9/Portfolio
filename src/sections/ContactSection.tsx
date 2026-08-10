import { useState } from "react";
import { Mail, Linkedin, Github, Copy, Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/fx/Magnetic";
import { useResumeHref } from "@/hooks/useResumeHref";
import { primarySocials } from "@/content/socials";
import { profile } from "@/content/profile";
import { openPalette } from "@/components/CommandPalette";

const icons = {
  email: Mail,
  linkedin: Linkedin,
  github: Github,
} as const;

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
      <div className="container-measure text-center">
        <div className="reveal glass-strong rounded-3xl px-6 py-12 md:px-12">
          <SectionHeading
            align="center"
            eyebrow="Contact"
            title="Open to GenAI / FDE roles"
            description="Hiring for AI / GenAI Developer or Forward Deployed Engineer roles · especially end-to-end LLM systems in production · get in touch."
          />

          <p className="mt-8 font-mono text-sm text-fg-2">
            <span className="text-accent">$</span> connect --to siddharth
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <ButtonLink to={`mailto:${profile.email}`}>Email</ButtonLink>
            </Magnetic>
            <Magnetic strength={0.25}>
              <ButtonLink
                to="https://www.linkedin.com/in/siddharth-kalyani/"
                variant="outline"
              >
                LinkedIn
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.25}>
              <ButtonLink
                to={resume.href}
                variant="ghost"
                {...(resume.download ? { download: resume.download } : {})}
              >
                {resume.label}
              </ButtonLink>
            </Magnetic>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-1/50 px-4 py-2 font-mono text-xs text-fg-1 transition hover:border-accent/40 hover:text-accent"
            >
              {copied ? (
                <Check size={14} className="text-accent" aria-hidden />
              ) : (
                <Copy size={14} aria-hidden />
              )}
              {copied ? "copied ✓" : profile.email}
            </button>
            <button
              type="button"
              onClick={openPalette}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-1/50 px-4 py-2 font-mono text-xs text-fg-2 transition hover:border-accent/40 hover:text-accent"
            >
              or press <span className="text-fg-1">⌘K</span>
            </button>
          </div>

          <div className="rule mx-auto my-12 max-w-xs" />

          <ul className="flex flex-wrap items-center justify-center gap-8">
            {primarySocials.map((s) => {
              const Icon = icons[s.id as keyof typeof icons];
              return (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      s.href.startsWith("http") ? "noopener noreferrer" : undefined
                    }
                    className="inline-flex items-center gap-2 font-sans text-sm text-fg-2 transition hover:text-accent"
                    aria-label={s.label}
                  >
                    {Icon ? <Icon size={15} aria-hidden /> : null}
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

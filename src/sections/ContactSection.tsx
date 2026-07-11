import { Mail, Linkedin, Github } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { useResumeHref } from "@/hooks/useResumeHref";
import { primarySocials } from "@/content/socials";

const icons = {
  email: Mail,
  linkedin: Linkedin,
  github: Github,
} as const;

/** Concept E — sparse contact */
export function ContactSection() {
  const resume = useResumeHref();

  return (
    <section id="contact" className="section-y">
      <div className="container-measure text-center">
        <div className="reveal">
          <SectionHeading
            align="center"
            eyebrow="Contact"
            title="Open to GenAI / FDE roles"
            description="Hiring for AI / GenAI Developer or Forward Deployed Engineer roles — especially end-to-end LLM systems in production — get in touch."
          />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink to="mailto:sidkalyani9@gmail.com">Email</ButtonLink>
            <ButtonLink
              to="https://www.linkedin.com/in/siddharth-kalyani/"
              variant="outline"
            >
              LinkedIn
            </ButtonLink>
            <ButtonLink to={resume.href} variant="ghost">
              {resume.label}
            </ButtonLink>
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

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

export function ContactSection() {
  const resume = useResumeHref();

  return (
    <section id="contact" className="section-y relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(46,230,166,0.12),transparent_55%)]" />
      <div className="container-page relative">
        <div className="reveal rounded-[2rem] border border-border bg-bg-1/60 px-6 py-12 text-center md:px-12 md:py-16">
          <SectionHeading
            align="center"
            eyebrow="Contact"
            title="Open to GenAI / FDE roles"
            description="If you're hiring for AI / GenAI Developer or Forward Deployed Engineer roles — especially end-to-end LLM systems in production — let's talk."
            className="mx-auto"
          />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink to="mailto:sidkalyani9@gmail.com">Email me</ButtonLink>
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

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-6">
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
                    className="inline-flex items-center gap-2 text-sm text-fg-1 transition hover:text-accent"
                    aria-label={s.label}
                  >
                    {Icon ? <Icon size={16} aria-hidden /> : null}
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

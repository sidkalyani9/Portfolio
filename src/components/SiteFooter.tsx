import { primarySocials, secondarySocials } from "@/content/socials";
import { profile } from "@/content/profile";
import { useResumeHref } from "@/hooks/useResumeHref";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const resume = useResumeHref();

  return (
    <footer className="border-t border-border bg-bg-1">
      <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl text-fg-0">{profile.name}</p>
          <p className="mt-1 text-sm text-fg-1">{profile.roleLine}</p>
          <p className="mt-4 text-xs text-fg-2">
            © {year} · Portfolio for GenAI / Forward Deployed Engineer roles
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            {primarySocials.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-sm text-fg-1 transition hover:text-accent"
                aria-label={s.label}
              >
                {s.label}
              </a>
            ))}
            <a
              href={resume.href}
              className="text-sm text-fg-1 transition hover:text-accent"
            >
              {resume.label}
            </a>
          </div>
          <div className="flex flex-wrap gap-4">
            {secondarySocials.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-fg-2 transition hover:text-fg-1"
                aria-label={s.label}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

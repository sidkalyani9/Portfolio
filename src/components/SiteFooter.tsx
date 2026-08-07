import { useEffect, useState } from "react";
import { primarySocials, secondarySocials } from "@/content/socials";
import { profile } from "@/content/profile";
import { useResumeHref } from "@/hooks/useResumeHref";

function useLocalClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function useLoadMs() {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav) {
      setMs(Math.round(nav.domContentLoadedEventEnd));
      return;
    }
    setMs(Math.round(performance.now()));
  }, []);
  return ms;
}

/** Colophon footer — local time · load ms · version · links */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const resume = useResumeHref();
  const clock = useLocalClock();
  const loadMs = useLoadMs();

  return (
    <footer className="relative z-10 border-t border-border bg-bg-0/70 backdrop-blur-xl">
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

      {/* colophon — the tiny details that read as craft */}
      <div className="border-t border-border">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4 font-mono text-[11px] text-fg-2">
          <p>
            <span className="text-accent">$</span> colophon{" "}
            <span className="text-fg-2/60">// agent-runtime v3.0</span>
          </p>
          <div className="flex flex-wrap items-center gap-4 tabular-nums">
            <span title="Asia/Kolkata">
              IST <span className="text-fg-1">{clock}</span>
            </span>
            <span aria-hidden className="text-border">
              ·
            </span>
            <span>
              load{" "}
              <span className="text-fg-1">
                {loadMs != null ? `${loadMs}ms` : "—"}
              </span>
            </span>
            <span aria-hidden className="text-border">
              ·
            </span>
            <span>
              built with{" "}
              <span className="text-fg-1">React · GSAP · R3F · Lenis</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

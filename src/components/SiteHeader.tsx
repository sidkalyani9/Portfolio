import { useEffect, useState, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, TerminalSquare, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { openPalette } from "@/components/CommandPalette";
import { useResumeHref } from "@/hooks/useResumeHref";
import { profile } from "@/content/profile";
import { useScrollTo } from "@/components/SmoothScroll";

const nav = [
  { label: "Journey", id: "pipeline" },
  { label: "Systems", id: "systems" },
  { label: "Work", id: "work" },
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const resume = useResumeHref();
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollToId, scrollToY } = useScrollTo();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  const goSection = (e: MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname === "/") {
      scrollToId(id);
      window.history.replaceState(null, "", `/#${id}`);
    } else {
      navigate(`/#${id}`);
    }
  };

  const goHomeTop = (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname === "/") {
      scrollToY(0);
      window.history.replaceState(null, "", "/");
    } else {
      navigate("/");
    }
  };

  const linkClass =
    "text-sm text-fg-1 transition-colors hover:text-fg-0 focus-visible:text-fg-0";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-border bg-bg-0/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-bg-2 focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
        <a
          href="/"
          onClick={goHomeTop}
          className="group flex items-center gap-3"
          aria-label={`${profile.name} · back to top`}
        >
          <span className="flex max-w-[16rem] items-center gap-2 sm:max-w-none">
            <span className="truncate text-sm font-medium tracking-tight text-fg-0 transition group-hover:text-accent">
              {profile.name}
            </span>
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-bg-1/60 px-2 py-0.5 font-mono text-[10px] text-fg-2 xl:inline-flex">
              <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              open
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              className={linkClass}
              onClick={(e) => goSection(e, item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openPalette}
            aria-label="Open command palette"
            className="hidden items-center gap-2 rounded-lg border border-border bg-bg-1/50 px-3 py-2 font-mono text-xs text-fg-2 transition hover:border-accent/40 hover:text-accent md:inline-flex"
          >
            <TerminalSquare size={14} aria-hidden />
            <span>⌘K</span>
          </button>
          <ButtonLink
            to={resume.href}
            variant="primary"
            className="!px-4 !py-2 text-xs md:text-sm"
            {...(resume.isMailto ? {} : { download: true })}
          >
            {resume.label}
          </ButtonLink>
          <ButtonLink
            to="https://www.linkedin.com/in/siddharth-kalyani/"
            variant="ghost"
            className="hidden !px-3 !py-2 text-sm md:inline-flex"
          >
            LinkedIn
          </ButtonLink>
          <ButtonLink
            to="mailto:sidkalyani9@gmail.com"
            variant="ghost"
            className="hidden !px-3 !py-2 text-sm lg:inline-flex"
          >
            Email
          </ButtonLink>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-2/50 text-fg-0 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-border bg-bg-0/95 backdrop-blur-xl lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              className="rounded-xl px-3 py-3 text-base text-fg-0 hover:bg-white/5"
              onClick={(e) => goSection(e, item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

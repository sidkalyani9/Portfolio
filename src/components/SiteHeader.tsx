import { useEffect, useState, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, TerminalSquare, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { openPalette } from "@/components/CommandPalette";
import { useResumeHref } from "@/hooks/useResumeHref";
import { profile } from "@/content/profile";
import { useScrollTo } from "@/components/SmoothScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/** Order matches page scroll order (after hero). */
const nav = [
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Journey", id: "pipeline" },
  { label: "Systems", id: "systems" },
  { label: "Work", id: "work" },
  { label: "Contact", id: "contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const resume = useResumeHref();
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollToId, scrollToY } = useScrollTo();
  // Match section-rail / mobile world breakpoint
  const isCompact = useMediaQuery("(max-width: 899px)");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (!open || !isCompact) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isCompact]);

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
        "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-border bg-bg-0/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-bg-2 focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-14 w-full max-w-[1120px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-5 md:h-[4.25rem] md:px-6">
        <a
          href="/"
          onClick={goHomeTop}
          className="group flex min-w-0 items-center gap-2"
          aria-label={`${profile.name} · back to top`}
        >
          <span className="truncate text-[13px] font-medium tracking-tight text-fg-0 transition group-hover:text-accent sm:text-sm">
            {isCompact ? "S. Kalyani" : profile.name}
          </span>
          {!isCompact ? (
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-bg-1/60 px-2 py-0.5 font-mono text-[10px] text-fg-2 xl:inline-flex">
              <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              open
            </span>
          ) : null}
        </a>

        {/* Desktop / tablet primary nav (compact uses the hamburger) */}
        {!isCompact ? (
          <nav
            className="flex items-center gap-5 xl:gap-8"
            aria-label="Primary"
          >
            {nav.map((item) => (
              <a
                key={item.id}
                href={`/#${item.id}`}
                className={cn(linkClass, "max-lg:text-[13px]")}
                onClick={(e) => goSection(e, item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {!isCompact ? (
            <>
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
                className="!px-4 !py-2 text-sm"
                {...(resume.download ? { download: resume.download } : {})}
              >
                {resume.label}
              </ButtonLink>
              <ButtonLink
                to="https://www.linkedin.com/in/siddharth-kalyani/"
                variant="ghost"
                className="!px-3 !py-2 text-sm"
              >
                LinkedIn
              </ButtonLink>
              <ButtonLink
                to="mailto:sidkalyani9@gmail.com"
                variant="ghost"
                className="!px-3 !py-2 text-sm max-lg:!hidden"
              >
                Email
              </ButtonLink>
            </>
          ) : (
            <>
              {/* Mobile: single compact CTA + menu — no LinkedIn/Email clutter */}
              <a
                href={resume.href}
                className="inline-flex h-9 items-center justify-center rounded-full bg-accent px-3.5 font-sans text-xs font-semibold text-bg-0 shadow-[0_0_0_1px_rgba(199,125,255,0.25)] touch-manipulation active:scale-[0.98]"
                {...(resume.download
                  ? { download: resume.download }
                  : {})}
              >
                Resume
              </a>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-2/60 text-fg-0 touch-manipulation"
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile full-screen menu */}
      {isCompact ? (
        <div
          id="mobile-nav"
          className={cn(
            "border-t border-border bg-bg-0/95 backdrop-blur-xl",
            open ? "block" : "hidden",
          )}
        >
          <nav
            className="flex max-h-[min(72dvh,32rem)] flex-col gap-0.5 overflow-y-auto overscroll-contain px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
            aria-label="Mobile"
          >
            {nav.map((item) => (
              <a
                key={item.id}
                href={`/#${item.id}`}
                className="rounded-xl px-3 py-3.5 text-base text-fg-0 touch-manipulation active:bg-white/8"
                onClick={(e) => goSection(e, item.id)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border/60 pt-3">
              <a
                href="https://www.linkedin.com/in/siddharth-kalyani/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-border bg-bg-1/40 px-3 py-3 text-center text-sm text-fg-1 touch-manipulation"
              >
                LinkedIn
              </a>
              <a
                href="mailto:sidkalyani9@gmail.com"
                className="rounded-xl border border-border bg-bg-1/40 px-3 py-3 text-center text-sm text-fg-1 touch-manipulation"
              >
                Email
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

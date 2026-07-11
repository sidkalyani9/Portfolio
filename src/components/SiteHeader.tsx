import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { useResumeHref } from "@/hooks/useResumeHref";
import { profile } from "@/content/profile";

const nav = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const resume = useResumeHref();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

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
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label={`${profile.name} home`}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-bg-2 font-display text-sm font-bold text-accent shadow-[0_0_24px_rgba(46,230,166,0.12)] transition group-hover:border-accent/30">
            SK
          </span>
          <span className="max-w-[10rem] truncate text-sm font-medium text-fg-0 sm:max-w-none">
            {profile.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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
            className="hidden !px-3 !py-2 text-sm sm:inline-flex"
          >
            LinkedIn
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
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-3 text-base text-fg-0 hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

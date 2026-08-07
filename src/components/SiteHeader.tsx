import { useEffect, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/fx/Magnetic";
import { TextRoll } from "@/components/fx/TextRoll";
import { FullscreenMenu } from "@/components/FullscreenMenu";
import { openPalette } from "@/components/CommandPalette";
import { useResumeHref } from "@/hooks/useResumeHref";
import { profile } from "@/content/profile";
import { useScrollTo } from "@/components/SmoothScroll";

const nav = [
  { label: "Work", id: "work" },
  { label: "Systems", id: "systems" },
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

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
    hour12: false,
  });
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const resume = useResumeHref();
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollToId } = useScrollTo();
  const clock = useLocalClock();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const goSection = (e: MouseEvent, id: string) => {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToId(id);
      window.history.replaceState(null, "", `/#${id}`);
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-500",
          scrolled || menuOpen
            ? "border-b border-border bg-bg-0/70 backdrop-blur-xl"
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
          <Magnetic strength={0.2}>
            <Link
              to="/"
              className="group flex items-center gap-3"
              aria-label={`${profile.name} home`}
              data-cursor="link"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-bg-2 font-sans text-sm font-bold text-accent transition group-hover:border-accent/40">
                SK
              </span>
              <span className="hidden text-sm font-medium tracking-tight text-fg-0 sm:inline">
                <TextRoll text={profile.name} />
              </span>
            </Link>
          </Magnetic>

          <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`/#${item.id}`}
                className="group text-sm text-fg-1 transition-colors hover:text-fg-0"
                onClick={(e) => goSection(e, item.id)}
                data-cursor="link"
              >
                <TextRoll text={item.label} />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <span className="hidden font-mono text-[11px] tabular-nums text-fg-2 lg:inline">
              IST {clock}
            </span>
            <Magnetic strength={0.25}>
              <button
                type="button"
                onClick={openPalette}
                className="hidden rounded-full border border-border px-3 py-2 font-mono text-[11px] text-fg-2 transition hover:border-accent/40 hover:text-accent md:inline-flex"
                data-cursor="link"
                data-cursor-label="Cmd"
              >
                ⌘K
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <ButtonLink
                to={resume.href}
                variant="primary"
                className="!px-4 !py-2 text-xs md:text-sm"
                data-cursor="link"
                {...(resume.isMailto ? {} : { download: true })}
              >
                {resume.label}
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.3}>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-bg-2/40 px-3 text-sm text-fg-0 transition hover:border-accent/40"
                aria-expanded={menuOpen}
                aria-label="Open menu"
                data-cursor="menu"
                data-cursor-label="Menu"
                onClick={() => setMenuOpen(true)}
              >
                <Menu size={16} />
                <span className="hidden sm:inline">Menu</span>
              </button>
            </Magnetic>
          </div>
        </div>
      </header>
      <FullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { TextRoll } from "@/components/fx/TextRoll";
import { Magnetic } from "@/components/fx/Magnetic";
import { useScrollTo } from "@/components/SmoothScroll";
import { profile } from "@/content/profile";
import { useResumeHref } from "@/hooks/useResumeHref";

export const MENU_LINKS = [
  { label: "Work", id: "work", index: "01" },
  { label: "Systems", id: "systems", index: "02" },
  { label: "About", id: "about", index: "03" },
  { label: "Experience", id: "experience", index: "04" },
  { label: "Contact", id: "contact", index: "05" },
] as const;

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Fullscreen staggered overlay menu — huge display type, magnetic rows.
 */
export function FullscreenMenu({ open, onClose }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { scrollToId } = useScrollTo();
  const resume = useResumeHref();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const links = panelRef.current.querySelectorAll("[data-menu-link]");
    gsap.fromTo(
      links,
      { yPercent: 110, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.9,
        stagger: 0.07,
        ease: "expo.out",
        delay: 0.08,
      },
    );
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const go = (id: string) => {
    onClose();
    window.setTimeout(() => {
      if (window.location.pathname === "/") {
        scrollToId(id);
        window.history.replaceState(null, "", `/#${id}`);
      } else {
        window.location.href = `/#${id}`;
      }
    }, 120);
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[110] flex flex-col bg-bg-0/95 backdrop-blur-2xl"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div className="container-page flex h-16 items-center justify-between md:h-[4.25rem]">
        <p className="font-sans text-sm text-fg-0">{profile.name}</p>
        <Magnetic strength={0.3}>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-fg-0 transition hover:border-accent/40 hover:text-accent"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </Magnetic>
      </div>

      <div
        ref={panelRef}
        className="container-page flex flex-1 flex-col justify-center pb-16 pt-4"
      >
        <nav aria-label="Fullscreen">
          <ul className="space-y-1 md:space-y-2">
            {MENU_LINKS.map((item) => (
              <li key={item.id} className="overflow-hidden">
                <button
                  type="button"
                  data-menu-link
                  data-cursor="view"
                  onClick={() => go(item.id)}
                  className="group flex w-full items-baseline gap-4 py-1 text-left md:gap-8"
                >
                  <span className="w-8 font-mono text-xs text-fg-2 md:w-10">
                    {item.index}
                  </span>
                  <span className="font-display text-[clamp(2.75rem,9vw,7.5rem)] leading-[0.95] text-fg-0">
                    <TextRoll text={item.label} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-border pt-8 font-sans text-sm text-fg-1">
          <a
            href={`mailto:${profile.email}`}
            className="group transition hover:text-accent"
            data-cursor="link"
          >
            <TextRoll text={profile.email} />
          </a>
          <a
            href={resume.href}
            className="group transition hover:text-accent"
            data-cursor="link"
          >
            <TextRoll text={resume.label} />
          </a>
          <a
            href="https://www.linkedin.com/in/siddharth-kalyani/"
            target="_blank"
            rel="noopener noreferrer"
            className="group transition hover:text-accent"
            data-cursor="link"
          >
            <TextRoll text="LinkedIn" />
          </a>
          <span
            className={cn(
              "ml-auto hidden font-mono text-[11px] text-fg-2 sm:inline",
            )}
          >
            available for GenAI / FDE roles
          </span>
        </div>
      </div>
    </div>
  );
}

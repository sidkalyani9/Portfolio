import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import {
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  FileText,
  FolderGit2,
  Github,
  Linkedin,
  Mail,
  TerminalSquare,
} from "lucide-react";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { useResumeHref } from "@/hooks/useResumeHref";
import { useScrollTo } from "@/components/SmoothScroll";
import { useWipe } from "@/components/PageWipe";
import { cn } from "@/lib/cn";

/** Page order for “go to” list. */
const SECTIONS = [
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "pipeline", label: "the runtime · agent pipeline trace" },
  { id: "systems", label: "systems owned end-to-end" },
  { id: "awards", label: "awards & recognition" },
  { id: "hackathon", label: "hackathon win · grantflow" },
  { id: "work", label: "selected work" },
  { id: "telemetry", label: "production metrics" },
  { id: "contact", label: "contact" },
] as const;

type Item = {
  id: string;
  group: "root" | "go to" | "case studies" | "actions";
  label: string;
  icon?: typeof Mail;
  run: () => void;
};

/** Subsequence match · simple, predictable fuzzy scoring. */
function fuzzy(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let i = 0;
  for (const ch of t) {
    if (ch === q[i]) i += 1;
    if (i >= q.length) return true;
  }
  return q.length === 0;
}

export function openPalette() {
  window.dispatchEvent(new CustomEvent("palette:open"));
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { go } = useWipe();
  const { scrollToId } = useScrollTo();
  const resume = useResumeHref();

  const close = useCallback(() => setOpen(false), []);

  const copyEmail = useCallback(() => {
    navigator.clipboard?.writeText(profile.email).catch(() => {});
    setCopied(true);
    window.setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 900);
  }, []);

  const items = useMemo<Item[]>(() => {
    const goHome = (hash?: string) => {
      if (window.location.pathname !== "/") {
        go(hash ? `/#${hash}` : "/");
      }
    };
    const list: Item[] = SECTIONS.map((s) => ({
      id: `go-${s.id}`,
      group: "go to",
      label: s.label,
      icon: TerminalSquare,
      run: () => {
        if (window.location.pathname === "/") {
          scrollToId(s.id);
          window.history.replaceState(null, "", `/#${s.id}`);
        } else {
          goHome(s.id);
        }
        setOpen(false);
      },
    }));
    projects
      .filter((p) => p.links.some((l) => l.href.startsWith("/work/")))
      .forEach((p) =>
        list.push({
          id: `case-${p.slug}`,
          group: "case studies",
          label: p.title.toLowerCase(),
          icon: FolderGit2,
          run: () => {
            setOpen(false);
            go(`/work/${p.slug}`);
          },
        }),
      );
    list.push(
      {
        id: "act-email",
        group: "actions",
        label: copied ? "copied ✓" : `copy email · ${profile.email}`,
        icon: Mail,
        run: copyEmail,
      },
      {
        id: "act-resume",
        group: "actions",
        label: resume.isMailto ? "request resume via email" : "download resume",
        icon: FileText,
        run: () => {
          window.open(resume.href, resume.isMailto ? "_self" : "_blank");
          setOpen(false);
        },
      },
      {
        id: "act-linkedin",
        group: "actions",
        label: "open linkedin",
        icon: Linkedin,
        run: () => {
          window.open(
            "https://www.linkedin.com/in/siddharth-kalyani/",
            "_blank",
            "noopener",
          );
          setOpen(false);
        },
      },
      {
        id: "act-github",
        group: "actions",
        label: "open github",
        icon: Github,
        run: () => {
          window.open("https://github.com/sidkalyani9", "_blank", "noopener");
          setOpen(false);
        },
      },
    );
    return list;
  }, [go, scrollToId, resume, copied, copyEmail]);

  const filtered = useMemo(() => {
    const base = items.filter((i) => fuzzy(query, `${i.group} ${i.label}`));
    // easter egg · `sudo hire siddharth`
    if (query.trim().toLowerCase().startsWith("sudo")) {
      base.unshift({
        id: "sudo-hire",
        group: "root",
        label: "sudo hire siddharth · permission granted",
        icon: TerminalSquare,
        run: () => {
          window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
            "permission granted · let's talk",
          )}`;
          setOpen(false);
        },
      });
    }
    return base;
  }, [items, query]);

  // open/close listeners
  useEffect(() => {
    const onOpen = () => {
      setQuery("");
      setActive(0);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setActive(0);
      } else if (e.key === "/" && !open) {
        const t = e.target as HTMLElement;
        if (!t.closest("input, textarea, [contenteditable]")) {
          e.preventDefault();
          onOpen();
        }
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("palette:open", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("palette:open", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // entrance animation + focus
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: 12, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.48, ease: "expo.out" },
      );
    }
  }, [open]);

  // keep active item in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${active}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    }
  };

  if (!open) return null;

  let lastGroup = "";

  return (
    <div
      className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[16vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <button
        type="button"
        aria-label="Close palette"
        className="absolute inset-0 bg-bg-0/70 backdrop-blur-sm"
        onClick={close}
      />
      <div
        ref={panelRef}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-bg-1/95 shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <span className="font-mono text-sm text-accent">$</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder="type a command or search…"
            className="w-full bg-transparent font-mono text-sm text-fg-0 placeholder:text-fg-2/60 focus:outline-none"
            aria-label="Command"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-fg-2">
            esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[46vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center font-mono text-xs text-fg-2">
              no matches · try "systems", "email", "resume"
            </p>
          ) : (
            filtered.map((item, i) => {
              const Icon = item.icon ?? TerminalSquare;
              const header =
                item.group !== lastGroup ? (lastGroup = item.group) : null;
              return (
                <div key={item.id}>
                  {header ? (
                    <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-2/70">
                      {header}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    data-index={i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => item.run()}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-mono text-[13px] transition-colors",
                      i === active
                        ? "bg-accent/10 text-accent"
                        : "text-fg-1 hover:bg-white/5",
                    )}
                  >
                    <Icon size={14} className="shrink-0 opacity-70" aria-hidden />
                    <span className="truncate">{item.label}</span>
                    {i === active ? (
                      <CornerDownLeft
                        size={13}
                        className="ml-auto shrink-0 opacity-70"
                        aria-hidden
                      />
                    ) : null}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-border px-5 py-2.5 font-mono text-[10px] text-fg-2">
          <span className="flex items-center gap-1">
            <ArrowUp size={11} aria-hidden />
            <ArrowDown size={11} aria-hidden /> navigate
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft size={11} aria-hidden /> select
          </span>
          <span className="ml-auto hidden sm:block">
            try: sudo hire siddharth
          </span>
        </div>
      </div>
    </div>
  );
}

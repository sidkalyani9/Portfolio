import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DUR } from "@/lib/motion";
import { setCaseStudyOrigin } from "@/lib/navOrigin";
import { measureSectionJourney } from "@/three/journeyGraph";

export type WipeGoOptions = {
  /** Home section to restore when leaving a case study */
  fromSection?: string;
};

type WipeContextValue = {
  /** Navigate with the terminal `cd` wipe transition. */
  go: (to: string, opts?: WipeGoOptions) => void;
};

const WipeContext = createContext<WipeContextValue>({ go: () => {} });

export function useWipe() {
  return useContext(WipeContext);
}

type WipeLinkProps = {
  to: string;
  /** When linking into a case study, which home section to return to */
  fromSection?: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "to">;

/** Internal link that routes through the `cd` wipe transition. */
export function WipeLink({
  to,
  fromSection,
  children,
  onClick,
  ...rest
}: WipeLinkProps) {
  const { go } = useWipe();
  const handle = (e: MouseEvent) => {
    onClick?.(e as never);
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }
    e.preventDefault();
    go(to, { fromSection });
  };
  return (
    <Link to={to} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}

function labelFor(to: string) {
  if (to.startsWith("/#")) return `cd ~/${to.slice(2)}`;
  if (to === "/") return "cd ~";
  return `cd ~${to}`;
}

function rememberOriginIfCaseStudy(to: string, fromSection?: string) {
  if (!to.startsWith("/work/")) return;
  const detected =
    fromSection ||
    measureSectionJourney().section ||
    "work";
  setCaseStudyOrigin(detected);
}

/**
 * Page transitions as terminal commands — a black panel wipes up,
 * types `cd ~/work/…`, navigates, and lifts away.
 */
export function PageWipe({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const busy = useRef(false);

  const go = useCallback(
    (to: string, opts?: WipeGoOptions) => {
      if (busy.current) return;
      rememberOriginIfCaseStudy(to, opts?.fromSection);

      const state = opts?.fromSection
        ? { fromSection: opts.fromSection }
        : undefined;

      if (reduced) {
        navigate(to, state ? { state } : undefined);
        return;
      }
      busy.current = true;
      setLabel(labelFor(to));
      setVisible(true);

      const overlay = overlayRef.current;
      if (!overlay) {
        navigate(to, state ? { state } : undefined);
        busy.current = false;
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setVisible(false);
          busy.current = false;
          gsap.set(overlay, { clipPath: "inset(100% 0 0 0)" });
        },
      });
      tl.set(overlay, { clipPath: "inset(100% 0 0 0)" })
        .to(overlay, {
          clipPath: "inset(0% 0 0 0)",
          duration: DUR.wipe,
          ease: "expo.inOut",
        })
        .add(() => navigate(to, state ? { state } : undefined), "+=0.24")
        .to(
          overlay,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: DUR.wipe + 0.12,
            ease: "expo.inOut",
          },
          "+=0.28",
        );
    },
    [navigate, reduced],
  );

  const value = useMemo(() => ({ go }), [go]);

  return (
    <WipeContext.Provider value={value}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[140] bg-bg-1"
        style={{
          clipPath: "inset(100% 0 0 0)",
          visibility: visible ? "visible" : "hidden",
        }}
      >
        <div className="flex h-full items-center justify-center">
          <p className="font-mono text-sm text-fg-1 md:text-base">
            <span className="text-accent">siddharth</span>
            <span className="text-fg-2">@portfolio:~$ </span>
            {label}
            <span className="caret-blink ml-1 inline-block h-4 w-2 translate-y-0.5 bg-accent" />
          </p>
        </div>
      </div>
    </WipeContext.Provider>
  );
}

import { useEffect, useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DUR, EASE_OUT_EXPO, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** false = wait for external trigger via returned controls (hero boot) */
  start?: boolean;
  /** Animate on scroll into view instead of immediately on start */
  onScroll?: boolean;
  delay?: number;
  stagger?: number;
};

/**
 * Kinetic typography — Motion B: slower char rise, softer stagger.
 */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  start = true,
  onScroll = false,
  delay = 0,
  stagger = STAGGER.char,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const played = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>("[data-char]");
    if (reduced) {
      gsap.set(chars, { yPercent: 0 });
      return;
    }
    gsap.set(chars, { yPercent: 112 });

    const play = () => {
      if (played.current) return;
      played.current = true;
      gsap.to(chars, {
        yPercent: 0,
        duration: DUR.reveal + 0.2,
        ease: EASE_OUT_EXPO,
        stagger,
        delay,
      });
    };

    if (onScroll) {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: play,
      });
      return () => st.kill();
    }
    if (start) play();
    return undefined;
  }, [reduced, start, onScroll, delay, stagger, text]);

  const words = text.split(" ");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AnyTag = Tag as any;

  return (
    <AnyTag ref={ref} className={cn("inline-block", className)} aria-label={text}>
      {words.map((word, wi) => (
        <span
          key={wi}
          aria-hidden
          className="inline-block whitespace-nowrap"
        >
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            {word.split("").map((ch, ci) => (
              <span key={ci} data-char className="inline-block will-change-transform">
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </AnyTag>
  );
}

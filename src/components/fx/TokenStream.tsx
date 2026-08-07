import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/** Split into tokens the way LLM output feels: words + attached punctuation. */
function tokenize(text: string): string[] {
  return text.split(/(\s+)/).filter((t) => t.length > 0);
}

/** Variable cadence — pauses after punctuation like a model "thinking". */
function delayFor(token: string): number {
  const base = 22 + Math.random() * 46;
  if (/[.!?—:;]$/.test(token)) return base + 260 + Math.random() * 180;
  if (/[,)]$/.test(token)) return base + 120;
  return base;
}

type StreamProps = {
  text: string;
  /** Gate the stream — e.g. wait for the boot sequence. */
  start: boolean;
  className?: string;
  caret?: boolean;
  speed?: number;
  onDone?: () => void;
  as?: "span" | "div" | "p";
};

/**
 * The site's signature motion primitive: text streams in token-by-token
 * like LLM output, with a terminal caret trailing the frontier.
 */
export function TokenStream({
  text,
  start,
  className,
  caret = true,
  speed = 1,
  onDone,
  as: Tag = "span",
}: StreamProps) {
  const reduced = usePrefersReducedMotion();
  const tokens = useMemo(() => tokenize(text), [text]);
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (reduced) {
      setCount(tokens.length);
      return;
    }
  }, [reduced, tokens.length]);

  useEffect(() => {
    if (!start || reduced) return;
    let i = 0;
    let timer: number;
    const step = () => {
      i += 1;
      setCount(i);
      if (i >= tokens.length) {
        if (!doneRef.current) {
          doneRef.current = true;
          onDoneRef.current?.();
        }
        return;
      }
      timer = window.setTimeout(step, delayFor(tokens[i]) / speed);
    };
    timer = window.setTimeout(step, 120);
    return () => window.clearTimeout(timer);
  }, [start, reduced, tokens, speed]);

  const done = count >= tokens.length;

  return (
    <Tag className={cn("whitespace-pre-wrap", className)} aria-label={text}>
      {tokens.slice(0, count).map((t, i) => (
        <span key={i} aria-hidden>
          {t}
        </span>
      ))}
      {caret && !done && start ? (
        <span
          aria-hidden
          className="caret-blink ml-0.5 inline-block h-[1em] w-[0.55ch] translate-y-[0.15em] bg-accent"
        />
      ) : null}
      {caret && done ? (
        <span
          aria-hidden
          className="caret-blink ml-0.5 inline-block h-[1em] w-[0.55ch] translate-y-[0.15em] bg-accent"
        />
      ) : null}
    </Tag>
  );
}

/** Static caret for labels/prompts — `$ █` style. */
export function Caret({ className }: { className?: string }): ReactNode {
  return (
    <span
      aria-hidden
      className={cn(
        "caret-blink ml-1 inline-block h-[1em] w-[0.55ch] translate-y-[0.15em] bg-accent",
        className,
      )}
    />
  );
}

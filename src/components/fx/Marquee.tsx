import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  items: readonly string[];
  className?: string;
  separator?: ReactNode;
  /** seconds for one full loop */
  speed?: number;
};

/** Infinite marquee strip — award-site staple, mono uppercase. */
export function Marquee({ items, className, separator = "—", speed = 28 }: Props) {
  const row = (key: string, hidden: boolean) => (
    <div
      key={key}
      aria-hidden={hidden}
      className="flex shrink-0 items-center gap-8 pr-8"
    >
      {items.map((item, i) => (
        <Fragment key={`${item}-${i}`}>
          <span className="whitespace-nowrap">{item}</span>
          <span className="text-fg-2" aria-hidden>
            {separator}
          </span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "flex overflow-hidden font-mono text-xs uppercase tracking-[0.3em] text-fg-1",
        className,
      )}
    >
      <div
        className="flex animate-marquee will-change-transform"
        style={{ animationDuration: `${speed}s` }}
      >
        {row("a", false)}
        {row("b", true)}
      </div>
    </div>
  );
}

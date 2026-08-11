import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  attribution?: string;
  className?: string;
  /** ink = Concept E accent; accent = teal product accent */
  tone?: "ink" | "accent";
};

export function PullQuote({
  children,
  attribution,
  className,
  tone = "ink",
}: Props) {
  return (
    <figure
      className={cn(
        "relative my-10 border-l-2 pl-6 md:my-12 md:pl-8",
        tone === "ink" ? "border-ink" : "border-accent",
        className,
      )}
    >
      <blockquote className="font-display text-[clamp(1.35rem,2.6vw,1.85rem)] italic leading-snug text-fg-0">
        “{children}”
      </blockquote>
      {attribution ? (
        <figcaption
          className={cn(
            "mt-4 font-sans text-xs font-semibold uppercase tracking-[0.18em]",
            tone === "ink" ? "text-ink" : "text-accent",
          )}
        >
          {attribution}
        </figcaption>
      ) : null}
    </figure>
  );
}

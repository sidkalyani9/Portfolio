import { cn } from "@/lib/cn";
import { SplitText } from "@/components/fx/SplitText";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
  kinetic = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
  /** Use split-char reveal on scroll */
  kinetic?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] text-fg-0">
        {kinetic ? (
          <SplitText text={title} onScroll className="inline-block" />
        ) : (
          title
        )}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed text-fg-1 md:text-lg",
            align === "center" ? "mx-auto max-w-xl" : "max-w-[38rem]",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
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
        <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-accent sm:mb-4">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-[clamp(1.85rem,7vw,3.25rem)] leading-[1.05] text-fg-0">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-[0.95rem] leading-relaxed text-fg-1 sm:mt-5 sm:text-base md:text-lg",
            align === "center" ? "mx-auto max-w-xl" : "max-w-[38rem]",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

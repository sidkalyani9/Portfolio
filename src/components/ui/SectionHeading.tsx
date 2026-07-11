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
        <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] text-fg-0">
        {title}
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

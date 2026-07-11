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
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-bold text-fg-0 md:text-5xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base text-fg-1 md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

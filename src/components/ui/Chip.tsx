import { cn } from "@/lib/cn";

export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-bg-2/60 px-3 py-1 font-sans text-xs font-medium text-fg-1",
        className,
      )}
    >
      {children}
    </span>
  );
}

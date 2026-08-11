import { cn } from "@/lib/cn";

type Props = {
  id?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  number?: string;
};

/** Editorial longread chapter — Concept E */
export function LongreadSection({ id, title, children, className, number }: Props) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <header className="mb-4 flex items-baseline gap-3">
        {number ? (
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ink">
            {number}
          </span>
        ) : null}
        <h2 className="prose-editorial-title">{title}</h2>
      </header>
      <div className="prose-editorial space-y-4 [&_strong]:font-semibold [&_strong]:text-fg-0 [&_code]:rounded [&_code]:bg-bg-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_code]:text-accent">
        {children}
      </div>
    </section>
  );
}

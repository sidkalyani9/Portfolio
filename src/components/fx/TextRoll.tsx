import { cn } from "@/lib/cn";

type Props = {
  text: string;
  className?: string;
};

/**
 * Per-char vertical roll on hover — award-site nav staple.
 * Structure: two stacked copies; parent overflow-hidden, group-hover shifts.
 */
export function TextRoll({ text, className }: Props) {
  const chars = text.split("");
  return (
    <span className={cn("inline-flex overflow-hidden", className)} aria-label={text}>
      <span className="inline-flex" aria-hidden>
        {chars.map((ch, i) => (
          <span
            key={i}
            className="relative inline-block h-[1.1em] overflow-hidden"
            style={{ width: ch === " " ? "0.3em" : undefined }}
          >
            <span
              className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1/2"
              style={{ transitionDelay: `${i * 18}ms` }}
            >
              <span className="inline-block leading-[1.1]">{ch === " " ? "\u00A0" : ch}</span>
              <span className="inline-block leading-[1.1] text-accent">
                {ch === " " ? "\u00A0" : ch}
              </span>
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

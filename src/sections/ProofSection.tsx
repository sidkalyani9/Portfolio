import { proofPoints } from "@/content/proof";

export function ProofSection() {
  return (
    <section id="proof" className="section-y border-y border-border bg-bg-1/40">
      <div className="container-page">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proofPoints.map((p) => (
            <li
              key={p.label}
              className="reveal rounded-2xl border border-border bg-bg-0/60 p-5 transition hover:border-accent/25"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-2">
                {p.label}
              </p>
              <p className="mt-3 font-display text-xl font-bold text-fg-0 md:text-2xl">
                {p.value}
              </p>
              <p className="mt-2 text-sm text-fg-1">{p.hint}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

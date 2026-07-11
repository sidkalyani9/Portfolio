import { proofPoints } from "@/content/proof";

export function ProofSection() {
  return (
    <section id="proof" className="section-y border-y border-border bg-bg-1/40">
      <div className="container-page">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proofPoints.map((p) => (
            <li
              key={p.label}
              className="reveal border border-border bg-bg-0/40 p-6 transition hover:border-accent/20"
            >
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-2">
                {p.label}
              </p>
              <p className="mt-3 font-display text-xl text-fg-0 md:text-2xl">
                {p.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-fg-1">{p.hint}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

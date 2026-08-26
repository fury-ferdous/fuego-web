import { Reveal } from "@/components/Reveal";
import { faqs } from "@/lib/content";

export function Faq() {
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow">Bevor du fragst</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 id="faq-title" className="display display-md mt-5">
                Häufige Fragen
              </h2>
            </Reveal>
          </div>

          <div className="border-t border-[color:var(--hairline)]">
            {faqs.map((item, i) => (
              <Reveal key={item.q} delay={i * 50}>
                <details className="group border-b border-[color:var(--hairline)]">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-base leading-snug text-bone transition-colors hover:text-gold [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span
                      aria-hidden
                      className="mt-1 shrink-0 text-gold transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-[62ch] pb-7 text-sm leading-relaxed text-[color:var(--text-dim)]">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

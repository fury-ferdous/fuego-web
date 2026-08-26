import { reviews } from "@/lib/content";
import { site } from "@/lib/site.config";
import { Reveal } from "@/components/Reveal";

/**
 * Bewertungen erscheinen nur, wenn echte vorliegen (siehe lib/content.ts).
 * Ist die Liste leer, verweist die Sektion auf das Google-Profil, statt
 * Fuenf-Sterne-Stimmen zu erfinden.
 */
export function Reviews() {
  const hasReviews = reviews.length > 0;
  if (!hasReviews && !site.social.googleReviews) return null;

  return (
    <section className="section" aria-labelledby="reviews-title">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Gästestimmen</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 id="reviews-title" className="display display-md mt-5">
            Was Gäste sagen
          </h2>
        </Reveal>

        {hasReviews ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((review, i) => (
              <Reveal key={`${review.author}-${i}`} delay={i * 90}>
                <figure className="flex h-full flex-col rounded-md border border-[color:var(--hairline)] p-7">
                  <blockquote className="flex-1 text-sm leading-relaxed text-[color:var(--text-dim)]">
                    {review.text}
                  </blockquote>
                  <figcaption className="meta mt-6">
                    {review.author} · {review.source}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={140}>
            <p className="lede mt-6">
              Wir zeigen hier keine ausgedachten Zitate. Die echten Bewertungen stehen dort, wo sie
              hingehören.
            </p>
            <a
              href={site.social.googleReviews}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost mt-8"
            >
              Bewertungen auf Google
              <span aria-hidden>↗</span>
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}

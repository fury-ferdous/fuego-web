import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLandingPage, landingPages } from "@/lib/landing-pages";
import { site } from "@/lib/site.config";
import { breadcrumbSchema, jsonLd, restaurantSchema } from "@/lib/schema";
import { Reveal } from "@/components/Reveal";
import { PriceTable } from "@/components/PriceTable";
import { KaraokeRooms } from "@/components/KaraokeRooms";
import { TourExperience } from "@/components/tour/TourExperience";
import { MenuTeaser } from "@/components/MenuTeaser";
import { LocationSection } from "@/components/LocationSection";

/** Nur die definierten Slugs existieren - alles andere ist 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return landingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${site.brand.url}/${page.slug}`,
    },
  };
}

export default async function LandingRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(restaurantSchema())} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Start", path: "/" },
            { name: page.eyebrow, path: `/${page.slug}` },
          ]),
        )}
      />

      <article>
        <header className="section pt-[calc(var(--header-h)+5rem)]">
          <div className="shell">
            <nav aria-label="Brotkrümelnavigation" className="meta mb-8">
              <Link href="/" className="transition-colors hover:text-gold">
                Start
              </Link>
              <span aria-hidden> / </span>
              <span style={{ color: "var(--color-bone)" }}>{page.eyebrow}</span>
            </nav>

            <h1 className="display display-lg max-w-[18ch]">{page.h1}</h1>
            <p className="lede mt-7">{page.lede}</p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/#reservierung" className="btn btn-primary">
                Reservieren
              </Link>
              <Link href="/" className="btn btn-ghost">
                Zur Location
              </Link>
            </div>
          </div>
        </header>

        <div className="shell">
          <div className="grid gap-12 border-t border-[color:var(--hairline)] pt-16 lg:grid-cols-[0.35fr_0.65fr] lg:gap-20">
            <p className="meta lg:sticky lg:top-28 lg:self-start">Im Detail</p>

            <div className="space-y-14">
              {page.blocks.map((block, i) => (
                <Reveal key={block.heading} delay={i * 70}>
                  <section>
                    <h2 className="display display-md">{block.heading}</h2>
                    <div className="mt-5 space-y-4">
                      {block.body.map((paragraph, j) => (
                        <p key={j} className="max-w-[64ch] text-base leading-relaxed text-[color:var(--text-dim)]">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {page.showTour && <TourExperience />}
        {page.showRooms && <KaraokeRooms />}

        {page.showPriceTable && (
          <section className="section" aria-labelledby="prices-title">
            <div className="shell">
              <h2 id="prices-title" className="display display-md">
                Preise pro Raum
              </h2>
              <p className="lede mt-5 text-base">
                Alle Preise gelten pro Raum, nicht pro Person. Feiertage werden wie Wochenendtarife
                berechnet. Speisen und Getränke kommen dazu.
              </p>
              <div className="mt-10">
                <PriceTable />
              </div>
            </div>
          </section>
        )}

        {page.showMenu && <MenuTeaser />}

        <LocationSection />
      </article>
    </>
  );
}

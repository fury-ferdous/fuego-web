import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoom, karaokeRooms, priceColumns } from "@/lib/content";
import { site } from "@/lib/site.config";
import { breadcrumbSchema, jsonLd } from "@/lib/schema";
import { SmartImage } from "@/components/SmartImage";
import { Reveal } from "@/components/Reveal";
import { TourExperience } from "@/components/tour/TourExperience";
import { OpenTourButton } from "@/components/OpenTourButton";

export const dynamicParams = false;

export function generateStaticParams() {
  return karaokeRooms.map((room) => ({ room: room.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ room: string }>;
}): Promise<Metadata> {
  const { room: slug } = await params;
  const room = getRoom(slug);
  if (!room) return {};

  return {
    title: `${room.name} – privater Karaoke-Raum`,
    description: `${room.name}: ${room.capacityLabel}, ${room.type}, ab ${room.fromPrice} € pro Raum. ${room.short}`,
    alternates: { canonical: `/karaoke/${room.slug}` },
    openGraph: {
      title: `${room.name} – privater Karaoke-Raum in Wien`,
      description: room.short,
      url: `${site.brand.url}/karaoke/${room.slug}`,
    },
  };
}

export default async function RoomPage({ params }: { params: Promise<{ room: string }> }) {
  const { room: slug } = await params;
  const room = getRoom(slug);
  if (!room) notFound();

  const others = karaokeRooms.filter((r) => r.slug !== room.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Start", path: "/" },
            { name: "Karaoke", path: "/#karaoke" },
            { name: room.name, path: `/karaoke/${room.slug}` },
          ]),
        )}
      />

      <article className="section pt-[calc(var(--header-h)+4rem)]">
        <div className="shell">
          <nav aria-label="Brotkrümelnavigation" className="meta mb-10">
            <Link href="/" className="transition-colors hover:text-gold">
              Start
            </Link>
            <span aria-hidden> / </span>
            <Link href="/#karaoke" className="transition-colors hover:text-gold">
              Karaoke
            </Link>
            <span aria-hidden> / </span>
            <span style={{ color: "var(--color-bone)" }}>{room.name}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <Reveal variant="mask">
              <SmartImage
                src={room.image}
                alt={`Karaoke-Raum ${room.name}`}
                label={`${room.name} – Aufnahme folgt`}
                className="portal portal-frame aspect-[3/4] w-full"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Reveal>

            <div>
              <p className="eyebrow" style={{ color: "var(--color-volt)" }}>
                {room.type}
              </p>
              <h1 className="display display-lg mt-5">{room.name}</h1>
              <p className="lede mt-7">{room.description}</p>

              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-[color:var(--hairline)] pt-8">
                <div>
                  <dt className="meta">Kapazität</dt>
                  <dd className="mt-2 text-lg text-bone">{room.capacityLabel}</dd>
                </div>
                <div>
                  <dt className="meta">Ab</dt>
                  <dd className="mt-2 text-lg text-bone">{room.fromPrice} € pro Raum</dd>
                </div>
              </dl>

              <div className="mt-8">
                <p className="meta">Ausstattung</p>
                <ul className="mt-4 space-y-2">
                  {room.features.map((feature) => (
                    <li key={feature} className="flex items-baseline gap-3 text-sm text-[color:var(--text-dim)]">
                      <span aria-hidden className="text-gold">
                        —
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/#reservierung" className="btn btn-primary">
                  {room.name} anfragen
                </Link>
                {room.sceneId && (
                  <OpenTourButton sceneId={room.sceneId} className="btn btn-ghost">
                    360° ansehen
                  </OpenTourButton>
                )}
              </div>
            </div>
          </div>

          <section className="mt-24" aria-labelledby="room-prices">
            <h2 id="room-prices" className="display display-md">
              Preise
            </h2>
            <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-[color:var(--text-faint)]">
              Preis pro Raum, nicht pro Person. Speisen und Getränke sind nicht enthalten.
            </p>
            <dl className="mt-8 grid gap-px overflow-hidden rounded-md bg-[color:var(--hairline)] sm:grid-cols-2 lg:grid-cols-4">
              {room.pricing.map((price, i) => (
                <div key={i} className="bg-coal p-6">
                  <dt className="text-xs leading-relaxed text-[color:var(--text-faint)]">{priceColumns[i]}</dt>
                  <dd className="display mt-3 text-2xl text-bone">{price} €</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-24" aria-labelledby="other-rooms">
            <h2 id="other-rooms" className="display display-md">
              Andere Räume
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  href={`/karaoke/${other.slug}`}
                  className="group rounded-md border border-[color:var(--hairline)] p-6 transition hover:border-gold/50"
                >
                  <p className="display text-2xl transition-colors group-hover:text-gold">{other.name}</p>
                  <p className="meta mt-3">
                    {other.capacityLabel} · ab {other.fromPrice} €
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </article>

      <TourExperience />
    </>
  );
}

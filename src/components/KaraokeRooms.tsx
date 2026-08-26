"use client";

import Link from "next/link";
import { karaokeRooms } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { SmartImage } from "@/components/SmartImage";
import { openTour } from "@/components/tour/TourExperience";

export function KaraokeRooms() {
  return (
    <section id="karaoke" className="section" aria-labelledby="karaoke-title">
      <div className="shell">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow" style={{ color: "var(--color-volt)" }}>
              Private Karaoke Rooms
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="karaoke-title" className="display display-lg mt-5">
              Your room.
              <br />
              Your music.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede mt-7">
              Keine offene Bühne, kein fremdes Publikum. Sieben private Räume, die komplett vergeben
              werden – eigener Raum, eigene Freunde, eigene Playlist.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 text-sm leading-relaxed text-[color:var(--text-faint)]">
              Preise gelten pro Raum und richten sich nach Wochentag und Startzeit. Feiertage werden
              wie Wochenendtarife berechnet. Speisen und Getränke sind nicht enthalten.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {karaokeRooms.map((room, i) => (
            <Reveal key={room.slug} delay={(i % 3) * 90}>
              <article className="group flex h-full flex-col">
                <Link href={`/karaoke/${room.slug}`} className="block" aria-label={`${room.name} ansehen`}>
                  <SmartImage
                    src={room.image}
                    alt={`Karaoke-Raum ${room.name}`}
                    label={`${room.name} – Aufnahme folgt`}
                    className="portal portal-frame aspect-[3/4] w-full"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    imgClassName="transition-transform duration-[1200ms] group-hover:scale-[1.05]"
                  />
                </Link>

                <div className="flex flex-1 flex-col pt-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="display text-[1.75rem] leading-none">
                      <Link href={`/karaoke/${room.slug}`} className="transition-colors hover:text-gold">
                        {room.name}
                      </Link>
                    </h3>
                    <span className="meta shrink-0" style={{ color: "var(--color-gold)" }}>
                      ab {room.fromPrice} €
                    </span>
                  </div>

                  <p className="meta mt-3">
                    {room.capacityLabel} · {room.type}
                  </p>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-[color:var(--text-dim)]">{room.short}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {room.sceneId && (
                      <button
                        type="button"
                        onClick={() => openTour(room.sceneId)}
                        className="rounded-full border border-[color:var(--hairline)] px-4 py-2 text-xs uppercase tracking-[0.14em] transition hover:border-gold/60 hover:text-gold"
                      >
                        360° ansehen
                      </button>
                    )}
                    <Link
                      href={`/karaoke/${room.slug}`}
                      className="rounded-full border border-[color:var(--hairline)] px-4 py-2 text-xs uppercase tracking-[0.14em] transition hover:border-gold/60 hover:text-gold"
                    >
                      Raum entdecken
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { fullAddress, mapsDirectionsUrl, mapsEmbedUrl, site } from "@/lib/site.config";

export function LocationSection() {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <section id="location" className="section" aria-labelledby="location-title">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow">Anfahrt</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 id="location-title" className="display display-lg mt-5">
                Find us in Vienna.
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <dl className="mt-10 space-y-7">
                <div>
                  <dt className="meta">Adresse</dt>
                  <dd className="mt-2 text-lg text-bone">
                    {site.location.street}
                    <br />
                    {site.location.postalCode} {site.location.city}
                  </dd>
                </div>

                <div>
                  <dt className="meta">Öffnungszeiten</dt>
                  <dd className="mt-2 space-y-1">
                    {site.hours.entries.map((entry) => (
                      <p key={entry.days} className="flex justify-between gap-8 text-sm text-[color:var(--text-dim)] sm:max-w-xs">
                        <span>{entry.days}</span>
                        <span className="tabular-nums text-bone">
                          {entry.opens} – {entry.closes}
                        </span>
                      </p>
                    ))}
                  </dd>
                </div>

                <div>
                  <dt className="meta">Kontakt</dt>
                  <dd className="mt-2 space-y-1 text-sm">
                    <a href={`mailto:${site.contact.email}`} className="block text-bone transition-colors hover:text-gold">
                      {site.contact.email}
                    </a>
                    {site.contact.phone && (
                      <a
                        href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                        className="block text-bone transition-colors hover:text-gold"
                      >
                        {site.contact.phoneDisplay}
                      </a>
                    )}
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={200}>
              <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-9">
                Route öffnen
                <span aria-hidden>↗</span>
              </a>
            </Reveal>
          </div>

          {/* Karte wird erst auf Klick geladen: spart Requests und setzt keine
              Google-Cookies, bevor jemand sie wirklich braucht. */}
          <Reveal delay={120} variant="mask">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-[color:var(--hairline)] lg:aspect-auto lg:h-full lg:min-h-[420px]">
              {mapLoaded ? (
                <iframe
                  src={mapsEmbedUrl}
                  title={`Karte: ${fullAddress}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0 grayscale-[0.6] contrast-[1.1]"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setMapLoaded(true)}
                  className="group h-full w-full bg-coal grain"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 opacity-30"
                    style={{
                      background:
                        "radial-gradient(60% 60% at 50% 45%, var(--color-gold-deep), transparent 70%)",
                    }}
                  />
                  <span className="relative flex h-full flex-col items-center justify-center gap-4">
                    <span className="btn btn-ghost transition-transform group-hover:scale-[1.03]">Karte laden</span>
                    <span className="meta">{fullAddress}</span>
                  </span>
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

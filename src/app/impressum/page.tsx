import type { Metadata } from "next";
import Link from "next/link";
import { imprint, site } from "@/lib/site.config";
import { breadcrumbSchema, jsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und Offenlegung gemäß § 5 ECG sowie §§ 24, 25 MedienG für ${site.brand.url}.`,
  alternates: { canonical: "/impressum" },
  robots: { index: true, follow: false },
};

type Row = { label: string; value?: string; href?: string };

/** Zeilen ohne Wert werden nicht gerendert - kein leeres Feld auf der Seite. */
function DataList({ rows }: { rows: Row[] }) {
  const filled = rows.filter((row) => row.value);
  if (filled.length === 0) return null;

  return (
    <dl className="mt-6 divide-y divide-[color:var(--hairline)] border-y border-[color:var(--hairline)]">
      {filled.map((row) => (
        <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
          <dt className="meta sm:pt-1">{row.label}</dt>
          <dd className="text-sm leading-relaxed text-bone">
            {row.href ? (
              <a href={row.href} className="transition-colors hover:text-gold">
                {row.value}
              </a>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function ImpressumPage() {
  const { operator, venue } = imprint;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Start", path: "/" },
            { name: "Impressum", path: "/impressum" },
          ]),
        )}
      />

      <article className="section pt-[calc(var(--header-h)+4rem)]">
        <div className="shell max-w-4xl">
          <nav aria-label="Brotkrümelnavigation" className="meta mb-10">
            <Link href="/" className="transition-colors hover:text-gold">
              Start
            </Link>
            <span aria-hidden> / </span>
            <span style={{ color: "var(--color-bone)" }}>Impressum</span>
          </nav>

          <h1 className="display display-lg">Impressum</h1>
          <p className="lede mt-6">
            Offenlegung gemäß § 5 E-Commerce-Gesetz sowie §§ 24 und 25 Mediengesetz.
          </p>

          <section className="mt-16" aria-labelledby="operator-title">
            <h2 id="operator-title" className="display display-md">
              Medieninhaber und Betreiber der Website
            </h2>
            <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-[color:var(--text-dim)]">
              Für Gestaltung, Inhalt und technischen Betrieb dieser Website verantwortlich.
            </p>

            <DataList
              rows={[
                { label: "Unternehmen", value: operator.name },
                { label: "Inhaber", value: operator.owner },
                {
                  label: "Anschrift",
                  value: `${operator.street}, ${operator.postalCode} ${operator.city}, ${operator.countryName}`,
                },
                { label: "E-Mail", value: operator.email, href: `mailto:${operator.email}` },
                {
                  label: "Telefon",
                  value: operator.phone,
                  href: `tel:${operator.phone.replace(/[^\d+]/g, "")}`,
                },
                { label: "Unternehmensgegenstand", value: operator.businessPurpose },
                { label: "Firmenbuchnummer", value: operator.companyRegisterNumber },
                { label: "Firmenbuchgericht", value: operator.companyRegisterCourt },
                { label: "UID-Nummer", value: operator.vatId },
                { label: "Kammerzugehörigkeit", value: operator.chamber },
                { label: "Aufsichtsbehörde", value: operator.supervisoryAuthority },
                { label: "Anwendbare Rechtsvorschrift", value: operator.legalBasis },
              ]}
            />
          </section>

          <section className="mt-16" aria-labelledby="venue-title">
            <h2 id="venue-title" className="display display-md">
              Der Betrieb
            </h2>
            <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-[color:var(--text-dim)]">
              Restaurant, Bar und die privaten Karaoke-Räume, über die diese Website informiert.
              Reservierungen und Anfragen zum Lokal laufen über die folgenden Kontaktdaten.
            </p>

            <DataList
              rows={[
                { label: "Betrieb", value: venue.name },
                { label: "Firma", value: venue.legalName },
                {
                  label: "Anschrift",
                  value: `${venue.street}, ${venue.postalCode} ${venue.city}`,
                },
                { label: "E-Mail", value: venue.email, href: `mailto:${venue.email}` },
                {
                  label: "Telefon",
                  value: site.contact.phoneDisplay,
                  href: `tel:${venue.phone.replace(/[^\d+]/g, "")}`,
                },
                { label: "Firmenbuchnummer", value: venue.companyRegisterNumber },
                { label: "UID-Nummer", value: venue.vatId },
              ]}
            />
          </section>

          <section className="mt-16" aria-labelledby="dispute-title">
            <h2 id="dispute-title" className="display display-md">
              Online-Streitbeilegung
            </h2>
            <p className="mt-5 max-w-[62ch] text-sm leading-relaxed text-[color:var(--text-dim)]">
              Verbraucherinnen und Verbraucher können Beschwerden an die Online-Streitbeilegungs-
              plattform der Europäischen Union richten:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline underline-offset-4"
              >
                ec.europa.eu/consumers/odr
              </a>
              . Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor
              einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section className="mt-16" aria-labelledby="rights-title">
            <h2 id="rights-title" className="display display-md">
              Urheberrecht und Haftung
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-[color:var(--text-dim)]">
              <p className="max-w-[62ch]">
                Inhalte, Texte, Fotografien und die 360°-Aufnahmen dieser Website sind
                urheberrechtlich geschützt. Eine Verwendung außerhalb der gesetzlich erlaubten Fälle
                bedarf der vorherigen schriftlichen Zustimmung.
              </p>
              <p className="max-w-[62ch]">
                Diese Website enthält Verweise auf externe Seiten, deren Inhalte wir nicht
                beeinflussen können. Für diese Inhalte ist ausschließlich der jeweilige Anbieter
                verantwortlich. Die 360°-Rundgänge werden über den Player von Insta360 ausgeliefert;
                dabei gelten zusätzlich die Bedingungen des Anbieters.
              </p>
              <p className="max-w-[62ch]">
                Angaben zu Preisen, Kapazitäten und Öffnungszeiten werden mit Sorgfalt gepflegt.
                Verbindlich ist die Bestätigung der Reservierung durch den Betrieb.
              </p>
            </div>
          </section>

          <div className="mt-16 flex flex-wrap gap-3">
            <a href={site.links.datenschutz} className="btn btn-ghost">
              Datenschutzerklärung
            </a>
            <Link href="/" className="btn btn-ghost">
              Zur Startseite
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

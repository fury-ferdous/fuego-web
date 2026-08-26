import Link from "next/link";
import { karaokeRooms } from "@/lib/content";
import { fullAddress, mapsDirectionsUrl, site } from "@/lib/site.config";

const columns = [
  {
    title: "Location",
    links: [
      { label: "Experience", href: "/#experience" },
      { label: "360° Tour", href: "/#tour" },
      { label: "Food", href: "/#food" },
      { label: "Karaoke", href: "/#karaoke" },
      { label: "Gallery", href: "/#gallery" },
    ],
  },
  {
    title: "Räume",
    links: karaokeRooms.slice(0, 5).map((room) => ({
      label: room.name,
      href: `/karaoke/${room.slug}`,
    })),
  },
  {
    title: "Wien",
    links: [
      { label: "Karaoke Wien", href: "/karaoke-wien" },
      { label: "Karaoke-Räume Wien", href: "/karaoke-raeume-wien" },
      { label: "Fusion Restaurant Wien", href: "/fusion-restaurant-wien" },
      { label: "Sushi Wien", href: "/sushi-wien" },
      { label: "Restaurant Wien", href: "/restaurant-wien" },
    ],
  },
];

export function Footer() {
  const socials = [
    { label: "Instagram", href: site.social.instagram },
    { label: "TikTok", href: site.social.tiktok },
    { label: "Facebook", href: site.social.facebook },
    { label: "Google", href: site.social.googleReviews },
  ].filter((s) => s.href);

  return (
    <footer className="relative z-10 border-t border-[color:var(--hairline)]">
      <div className="shell py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_repeat(3,0.6fr)]">
          <div>
            <p className="display text-3xl lowercase">{site.brand.wordmark}</p>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--text-dim)]">{site.brand.claim}</p>
            {/* NAP-Block: Name, Adresse, Telefon exakt wie im Google-Profil. */}
            <address className="mt-7 not-italic text-sm leading-relaxed text-[color:var(--text-dim)]">
              <span className="block text-bone">{site.brand.napName}</span>
              {site.location.street}
              <br />
              {site.location.postalCode} {site.location.city}
              <br />
              <a
                href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-gold"
              >
                {site.contact.phoneDisplay}
              </a>
              <br />
              <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-gold">
                {site.contact.email}
              </a>
            </address>
            <a
              href={mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block text-sm text-gold underline underline-offset-4"
            >
              Route zu {fullAddress}
            </a>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="meta">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[color:var(--text-dim)] transition-colors hover:text-bone">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-[color:var(--hairline)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-5">
            {socials.length > 0 ? (
              socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meta transition-colors hover:text-gold"
                >
                  {social.label}
                </a>
              ))
            ) : (
              <span className="meta">Social-Links folgen</span>
            )}
          </div>

          <div className="flex flex-wrap gap-5">
            <Link href={site.links.impressum} className="meta transition-colors hover:text-gold">
              Impressum
            </Link>
            <a href={site.links.datenschutz} className="meta transition-colors hover:text-gold">
              Datenschutz
            </a>
            <span className="meta">
              © {new Date().getFullYear()} {site.brand.napName}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * ZENTRALE KONFIGURATION
 * ----------------------
 * Alles, was sich am Betrieb aendern kann, steht hier - und nur hier.
 *
 * Felder mit `verified: false` bzw. dem Kommentar PRUEFEN sind noch nicht
 * bestaetigt. Im Dev-Modus zeigt die Seite dafuer ein Hinweis-Panel
 * (siehe components/ConfigTodo.tsx). In Produktion erscheint es nie.
 */

export const site = {
  brand: {
    /** Kurzform fuer Seitentitel und Navigation. */
    name: "fuego",
    wordmark: "fuego",
    /**
     * Vollstaendiger Betriebsname (NAP).
     * Muss auf Website, Google Business Profile und in allen Branchen-
     * eintraegen identisch geschrieben sein - sonst zerfaellt das lokale
     * SEO-Signal.
     */
    napName: "Fuego Karaoke Bar Restaurant",
    claim: "Fusion Kitchen · Bar · Private Karaoke",
    /** Produktions-URL, ueberschreibbar per NEXT_PUBLIC_SITE_URL. */
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fuego.at",
  },

  location: {
    street: "Jagdgasse 4",
    postalCode: "1100",
    city: "Wien",
    district: "Favoriten",
    countryCode: "AT",
    countryName: "Österreich",
    /** Ungefaehre Koordinaten - PRUEFEN und exakt eintragen. */
    geo: { lat: 48.1746, lng: 16.3763, verified: false },
    areaSqm: 1000,
  },

  contact: {
    email: "office@fuego.at",
    /** Internationale Schreibweise fuer tel:-Links und Schema. */
    phone: "+43 664 99689261",
    /** Anzeige in Oesterreich. */
    phoneDisplay: "0664 99689261",
    phoneVerified: true,
  },

  /**
   * Empfaenger jeder Reservierungsanfrage. Beide Adressen stehen als
   * Hauptempfaenger im To-Feld - kein Cc, damit keine Adresse untergeht.
   * Wird vom PHP-Mailer und vom E-Mail-Fallback im Formular genutzt.
   */
  reservationRecipients: ["office@fuego.at", "dugicalko@gmail.com"],

  /**
   * Oeffnungszeiten PRUEFEN.
   * Abgeleitet aus den Reservierungs-Zeitfenstern (ab 16:00, letzter Slot
   * bis 04:00) - noch nicht offiziell bestaetigt.
   */
  hours: {
    verified: false,
    entries: [
      { days: "Mo – Do", opens: "16:00", closes: "01:00", schema: ["Monday", "Tuesday", "Wednesday", "Thursday"] },
      { days: "Fr – Sa", opens: "16:00", closes: "04:00", schema: ["Friday", "Saturday"] },
      { days: "Sonntag", opens: "16:00", closes: "00:00", schema: ["Sunday"] },
    ],
  },

  social: {
    instagram: "", // PRUEFEN
    tiktok: "", // PRUEFEN
    facebook: "", // PRUEFEN
    googleReviews: "", // Link auf das Google-Profil, PRUEFEN
  },

  links: {
    menuPdf: "https://fuego.at/assets/Fuego-Speisekarte.pdf",
    impressum: "/impressum",
    /** Bestehende Datenschutzerklaerung - PRUEFEN, ob sie noch passt. */
    datenschutz: "https://fuego.at/datenschutz.html",
  },

  bookingSlots: [
    "16:00 – 19:00",
    "19:00 – 23:00",
    "20:00 – 00:00",
    "21:00 – 01:00",
    "22:00 – 02:00",
    "23:00 – 03:00",
    "00:00 – 04:00",
  ],
};

/**
 * IMPRESSUM
 * ---------
 * Betreiber der Website im Sinn von § 5 ECG und §§ 24, 25 MedienG.
 *
 * ACHTUNG: Ein unvollstaendiges Impressum ist in Oesterreich
 * verwaltungsstrafbewehrt. Die leeren Felder MUESSEN vor dem Livegang
 * gefuellt werden. Leere Felder werden auf der Seite nicht gerendert -
 * das ersetzt aber keine rechtliche Pruefung.
 */
export const imprint = {
  /** Medieninhaber, Herausgeber und technischer Betreiber der Website. */
  operator: {
    name: "Digital Denker e.U.",
    street: "Wattgasse 33",
    postalCode: "1160",
    city: "Wien",
    countryName: "Österreich",
    owner: "", // Name des Inhabers - PFLICHT
    email: "", // PFLICHT
    phone: "", // empfohlen
    companyRegisterNumber: "", // Firmenbuchnummer, z. B. FN 123456a - PFLICHT
    companyRegisterCourt: "", // z. B. Handelsgericht Wien
    vatId: "", // UID, z. B. ATU12345678 - falls vorhanden
    businessPurpose: "", // Gegenstand des Unternehmens
    chamber: "Wirtschaftskammer Wien",
    supervisoryAuthority: "", // Gewerbebehörde - PFLICHT
    legalBasis: "Gewerbeordnung (GewO), abrufbar auf ris.bka.gv.at",
  },

  /** Der Gastronomiebetrieb, um den es auf der Website geht. */
  venue: {
    name: site.brand.napName,
    legalName: "KTV Gastro GmbH", // PRUEFEN
    street: site.location.street,
    postalCode: site.location.postalCode,
    city: site.location.city,
    email: site.contact.email,
    phone: site.contact.phone,
    companyRegisterNumber: "", // PRUEFEN
    vatId: "", // PRUEFEN
  },
};

export const fullAddress = `${site.location.street}, ${site.location.postalCode} ${site.location.city}`;

export const mapsQuery = encodeURIComponent(
  `${site.brand.napName} ${site.location.street} ${site.location.postalCode} ${site.location.city}`,
);

export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;
export const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&hl=de&z=17&output=embed`;

/** Offene Punkte - speist das Dev-Hinweispanel. */
export function openConfigTodos(): string[] {
  const todos: string[] = [];
  if (!site.hours.verified) todos.push("Öffnungszeiten bestätigen (site.config.ts → hours)");
  if (!site.location.geo.verified) todos.push("Geo-Koordinaten exakt setzen (site.config.ts → location.geo)");
  if (!site.social.instagram) todos.push("Social-Links ergänzen (site.config.ts → social)");

  const required: [string, string][] = [
    ["Inhaber", imprint.operator.owner],
    ["E-Mail", imprint.operator.email],
    ["Firmenbuchnummer", imprint.operator.companyRegisterNumber],
    ["Gewerbebehörde", imprint.operator.supervisoryAuthority],
  ];
  const missing = required.filter(([, value]) => !value).map(([label]) => label);
  if (missing.length) todos.push(`Impressum unvollständig: ${missing.join(", ")}`);

  return todos;
}

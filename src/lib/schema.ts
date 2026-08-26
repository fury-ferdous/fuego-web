import { faqs, karaokeRooms, menuCategories } from "@/lib/content";
import { fullAddress, imprint, site } from "@/lib/site.config";

const url = site.brand.url;

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: site.location.street,
  addressLocality: site.location.city,
  postalCode: site.location.postalCode,
  addressCountry: site.location.countryCode,
};

const openingHoursSpecification = site.hours.entries.map((entry) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: entry.schema,
  opens: entry.opens,
  closes: entry.closes,
}));

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: site.brand.napName,
    legalName: imprint.venue.legalName,
    url,
    address: postalAddress,
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

export function restaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${url}/#restaurant`,
    name: site.brand.napName,
    description:
      "Fusion-Küche, Bar und sieben private Karaoke-Räume auf knapp 1.000 m² in Wien-Favoriten.",
    url,
    servesCuisine: ["Fusion", "Japanisch", "Italienisch", "Sushi"],
    priceRange: "€€",
    address: postalAddress,
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(site.location.geo.verified
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: site.location.geo.lat,
            longitude: site.location.geo.lng,
          },
        }
      : {}),
    ...(site.hours.verified ? { openingHoursSpecification } : {}),
    hasMenu: `${url}/#menu`,
    acceptsReservations: `${url}/#reservierung`,
    parentOrganization: { "@id": `${url}/#organization` },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Private Karaoke-Räume", value: true },
      { "@type": "LocationFeatureSpecification", name: "Bar", value: true },
      { "@type": "LocationFeatureSpecification", name: "Für Firmenfeiern geeignet", value: true },
    ],
    makesOffer: karaokeRooms.map((room) => ({
      "@type": "Offer",
      name: `Privater Karaoke-Raum ${room.name}`,
      url: `${url}/karaoke/${room.slug}`,
      priceCurrency: "EUR",
      price: room.fromPrice,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: room.fromPrice,
        priceCurrency: "EUR",
        description: "Preis pro Raum, exklusive Speisen und Getränke",
      },
    })),
  };
}

export function menuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${url}/#menu`,
    name: `Speisekarte ${site.brand.name}`,
    url: site.links.menuPdf,
    inLanguage: "de-AT",
    hasMenuSection: menuCategories.map((category) => ({
      "@type": "MenuSection",
      name: category.label,
      description: category.intro,
      hasMenuItem: category.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        ...(item.note ? { description: item.note } : {}),
      })),
    })),
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}/#faq`,
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${url}${item.path}`,
    })),
  };
}

export function placeSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}/#localbusiness`,
    name: site.brand.napName,
    image: `${url}/opengraph-image`,
    address: postalAddress,
    description: `${site.brand.claim} in ${site.location.postalCode} ${site.location.city}. ${fullAddress}.`,
    url,
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(site.hours.verified ? { openingHoursSpecification } : {}),
  };
}

/** Rendert JSON-LD sicher als Script-Tag. */
export function jsonLd(data: object) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

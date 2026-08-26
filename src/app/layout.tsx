import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileCta } from "@/components/MobileCta";
import { ScrollAtmosphere } from "@/components/ScrollAtmosphere";
import { ConfigTodo } from "@/components/ConfigTodo";
import { site } from "@/lib/site.config";
import { INSTA360_ORIGIN } from "@/lib/tour-scenes";
import { jsonLd, organizationSchema, placeSchema } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL(site.brand.url),
  title: {
    default: `${site.brand.name} | Fusion Kitchen & Karaoke Wien`,
    template: `%s | ${site.brand.name} Wien`,
  },
  description:
    "Fusion-Küche, Sushi, Cocktails und private Karaoke-Räume auf fast 1.000 m² in Wien. Restaurant und Entertainment in einer Location entdecken – inklusive 360°-Tour.",
  applicationName: site.brand.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_AT",
    siteName: site.brand.name,
    url: site.brand.url,
    title: `${site.brand.name} | Fusion Kitchen & Karaoke Wien`,
    description:
      "Restaurant, Bar und sieben private Karaoke-Räume auf knapp 1.000 m² in Wien-Favoriten. Sieh dich vorab in der 360°-Tour um.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.brand.name} | Fusion Kitchen & Karaoke Wien`,
    description: "Fusion-Küche, Bar und private Karaoke-Räume auf knapp 1.000 m² in Wien.",
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#060507",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-AT">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1&family=Inter:wght@400;500;600&display=swap"
        />
        {/* Erst verbinden, wenn die Tour wirklich geoeffnet wird - deshalb
            nur dns-prefetch statt preconnect. */}
        <link rel="dns-prefetch" href={INSTA360_ORIGIN} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationSchema())} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(placeSchema())} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Zum Inhalt springen
        </a>
        <ScrollAtmosphere />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileCta />
        <ConfigTodo />
      </body>
    </html>
  );
}

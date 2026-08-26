/**
 * 360°-TOUR - ZENTRALE DATENQUELLE
 * --------------------------------
 * Die acht Insta360-Links stehen ausschliesslich hier. Viewer, Selector,
 * Modal, Raumseiten und Schema lesen alle aus diesem Array.
 *
 * WICHTIG - ZUORDNUNG PRUEFEN:
 * Welcher Link welchen Raum zeigt, laesst sich von aussen nicht erkennen.
 * Die Titel unten folgen der im Briefing vorgeschlagenen Reihenfolge.
 * Einmal durchklicken, Titel korrigieren, fertig - der Rest der Seite
 * zieht automatisch nach.
 *
 * PREVIEW-BILDER:
 * `preview` zeigt auf eine Datei in /public/tour/. Fehlt die Datei, rendert
 * die Seite automatisch einen gestalteten Platzhalter statt eines
 * kaputten Bildes. Empfehlung: aus jedem Panorama einen Still exportieren,
 * als WebP mit ca. 1600px Breite ablegen.
 */

export type TourScene = {
  id: string;
  /** Zweistellige Nummer - die Tour ist ein Rundgang, die Reihenfolge zaehlt. */
  index: string;
  title: string;
  /** Kurze Einordnung unter dem Titel im Viewer-HUD. */
  caption: string;
  /** Insta360 Share-Link. */
  url: string;
  /** Preview-Still in /public/tour/ - optional. */
  preview?: string;
  /** Optionaler Hotspot, der aus der Szene heraus weiterfuehrt. */
  hotspot?: {
    label: string;
    action: string;
    href: string;
  };
};

export const tourScenes: TourScene[] = [
  {
    id: "restaurant",
    index: "01",
    title: "Restaurant",
    caption: "Offene Küche, lange Tische, warmes Licht",
    url: "https://cloud-fra.insta360.com/share/fra/4L2n3Y7x550t3S1L3472688128",
    preview: "/tour/01-restaurant.webp",
    hotspot: { label: "Fusion Kitchen", action: "Speisekarte ansehen", href: "#food" },
  },
  {
    id: "main-area",
    index: "02",
    title: "Main Area",
    caption: "Das Herzstück der Fläche",
    url: "https://cloud-fra.insta360.com/share/fra/4q2M3j7C5G0y2p2o0271058944",
    preview: "/tour/02-main-area.webp",
  },
  {
    id: "bar",
    index: "03",
    title: "Bar",
    caption: "Signature Cocktails bis spät",
    url: "https://cloud-fra.insta360.com/share/fra/4x2x3G7x5C0l0s5Q6118587392",
    preview: "/tour/03-bar.webp",
    hotspot: { label: "Signature Cocktails", action: "Drinks entdecken", href: "#food" },
  },
  {
    id: "lounge",
    index: "04",
    title: "Lounge",
    caption: "Ankommen, warten, weitertrinken",
    url: "https://cloud-fra.insta360.com/share/fra/4c2y3r7r4c919l549716704256",
    preview: "/tour/04-lounge.webp",
  },
  {
    id: "ktv-01",
    index: "05",
    title: "Karaoke Room 01",
    caption: "Privater Raum",
    url: "https://cloud-fra.insta360.com/share/fra/4e2m327O4D9L8H2a4953716736",
    preview: "/tour/05-ktv-01.webp",
    hotspot: { label: "Private Karaoke Rooms", action: "Räume ansehen", href: "#karaoke" },
  },
  {
    id: "ktv-02",
    index: "06",
    title: "Karaoke Room 02",
    caption: "Privater Raum",
    url: "https://cloud-fra.insta360.com/share/fra/402R3u7C4w9W7L0N0638740480",
    preview: "/tour/06-ktv-02.webp",
  },
  {
    id: "ktv-03",
    index: "07",
    title: "Karaoke Room 03",
    caption: "Privater Raum mit Bühne",
    url: "https://cloud-fra.insta360.com/share/fra/4c2K3A7i4P9g5Q208831655936",
    preview: "/tour/07-ktv-03.webp",
  },
  {
    id: "ktv-04",
    index: "08",
    title: "Karaoke Room 04",
    caption: "Privater Raum mit Bühne",
    url: "https://cloud-fra.insta360.com/share/fra/4U2i3G7N4F9O361K9007408128",
    preview: "/tour/08-ktv-04.webp",
  },
];

export const getScene = (id: string) => tourScenes.find((s) => s.id === id);

/** Host der Insta360-Cloud - fuer preconnect und die Embed-Pruefung. */
export const INSTA360_ORIGIN = "https://cloud-fra.insta360.com";

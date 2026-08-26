import { ImageResponse } from "next/og";
import { site } from "@/lib/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.brand.name} – Fusion Kitchen & Karaoke Wien`;

/**
 * Vorschaubild fuer Social Media, aus der Konfiguration erzeugt. Damit gibt
 * es kein verwaistes og.jpg, das nach jeder Aenderung neu exportiert werden
 * muesste.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(150deg, #1a1208 0%, #060507 45%, #0d0d11 100%)",
          color: "#f0e9df",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, color: "#d8be86" }}>
          {site.location.postalCode} {site.location.city.toUpperCase()} ·{" "}
          {site.location.district.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, lineHeight: 1.05, letterSpacing: -3 }}>Eat. Sing.</div>
          <div style={{ fontSize: 104, lineHeight: 1.05, letterSpacing: -3, color: "#d8be86" }}>
            Stay late.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a89e92" }}>
          <span>{site.brand.claim}</span>
          <span>{site.location.areaSqm.toLocaleString("de-AT")} m²</span>
        </div>
      </div>
    ),
    size,
  );
}

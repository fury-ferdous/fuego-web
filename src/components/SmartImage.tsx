"use client";

import { useState } from "react";

type Props = {
  src?: string;
  alt: string;
  /** Wird im Platzhalter gesetzt, wenn das Bild fehlt. */
  label?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Bild mit gestaltetem Fallback.
 *
 * Solange die echten Aufnahmen fehlen, darf die Seite nicht wie eine
 * Baustelle aussehen. Faellt ein Bild aus - Datei fehlt, Netz weg - rendert
 * diese Komponente eine dunkle Flaeche mit Kornstruktur und Beschriftung.
 * Sobald die Datei unter dem angegebenen Pfad liegt, ist der Platzhalter weg.
 */
export function SmartImage({
  src,
  alt,
  label,
  className = "",
  imgClassName = "",
  priority = false,
  sizes = "100vw",
}: Props) {
  const [failed, setFailed] = useState(!src);

  return (
    <div className={`relative overflow-hidden bg-coal grain ${className}`}>
      {!failed && src ? (
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex items-end p-5"
          style={{ background: "linear-gradient(150deg, #16161c 0%, #0d0d11 45%, #100c0e 100%)" }}
        >
          <span
            aria-hidden
            className="absolute inset-0 opacity-[0.16]"
            style={{ background: "radial-gradient(70% 55% at 30% 15%, var(--color-gold-deep), transparent 65%)" }}
          />
          <span className="meta relative">{label ?? "Bild folgt"}</span>
        </div>
      )}
    </div>
  );
}

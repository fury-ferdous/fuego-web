"use client";

import { useCallback, useEffect, useState } from "react";
import { galleryItems } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { SmartImage } from "@/components/SmartImage";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";

const spanClass: Record<string, string> = {
  tall: "row-span-2 aspect-[3/4]",
  wide: "sm:col-span-2 aspect-[16/10]",
  square: "aspect-square",
};

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  useLockBodyScroll(open);

  const move = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + galleryItems.length) % galleryItems.length)),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, move]);

  return (
    <section id="gallery" className="section" aria-labelledby="gallery-title">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Galerie</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 id="gallery-title" className="display display-lg mt-5">
            Das Haus in Bildern.
          </h2>
        </Reveal>

        <div className="mt-14 grid auto-rows-[minmax(0,auto)] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {galleryItems.map((item, i) => (
            <Reveal key={item.src} delay={(i % 3) * 70} className={spanClass[item.span]}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group h-full w-full overflow-hidden rounded-sm"
                aria-label={`${item.alt} – vergrößern`}
              >
                <SmartImage
                  src={item.src}
                  alt={item.alt}
                  label="Aufnahme folgt"
                  className="h-full w-full"
                  sizes="(max-width: 640px) 50vw, 33vw"
                  imgClassName="transition-transform duration-[1200ms] group-hover:scale-[1.06]"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {open && index !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galerie"
          className="fixed inset-0 z-[95] flex flex-col bg-ink/97 backdrop-blur-xl"
          style={{ height: "100dvh" }}
          onClick={() => setIndex(null)}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <p className="meta">
              {String(index + 1).padStart(2, "0")} / {String(galleryItems.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={() => setIndex(null)}
              className="rounded-full border border-[color:var(--hairline)] p-3 transition hover:border-gold/50 hover:text-gold"
              aria-label="Galerie schließen"
              autoFocus
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-6" onClick={(e) => e.stopPropagation()}>
            <SmartImage
              src={galleryItems[index].src}
              alt={galleryItems[index].alt}
              label="Aufnahme folgt"
              className="max-h-full w-full max-w-4xl rounded-sm"
              imgClassName="object-contain"
            />
          </div>

          <div className="flex items-center justify-between gap-4 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => move(-1)} className="btn btn-ghost" aria-label="Vorheriges Bild">
              ←
            </button>
            <p className="text-center text-xs text-[color:var(--text-faint)]">{galleryItems[index].alt}</p>
            <button type="button" onClick={() => move(1)} className="btn btn-ghost" aria-label="Nächstes Bild">
              →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

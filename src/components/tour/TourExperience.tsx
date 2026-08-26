"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tourScenes } from "@/lib/tour-scenes";
import type { EmbedProbe } from "@/lib/embed-check";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";
import { SmartImage } from "@/components/SmartImage";
import { Reveal } from "@/components/Reveal";
import { TourViewer } from "./TourViewer";
import { TourSelector } from "./TourSelector";

/** Von ueberall aufrufbar: `openTour("bar")` oeffnet die Tour beim Barbereich. */
export const TOUR_EVENT = "fuego:open-tour";

const READY_FLAG = "__fuegoTourMounted";

/**
 * Liegt auf der aktuellen Seite eine Tour, wird sie geoeffnet. Sonst wird zur
 * Startseite navigiert - ein Button, der ins Leere klickt, waere schlimmer
 * als gar keiner.
 */
export function openTour(sceneId?: string) {
  const mounted = (window as unknown as Record<string, boolean>)[READY_FLAG];
  if (mounted) {
    window.dispatchEvent(new CustomEvent(TOUR_EVENT, { detail: { sceneId } }));
    return;
  }
  window.location.href = "/#tour";
}

export function TourExperience() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(tourScenes[0].id);
  const [probes, setProbes] = useState<Record<string, EmbedProbe> | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const activeScene = tourScenes.find((s) => s.id === activeId) ?? tourScenes[0];
  const activeProbe = probes?.[activeScene.id];

  useLockBodyScroll(open);

  /* Header-Pruefung erst anstossen, wenn die Tour tatsaechlich geoeffnet wird. */
  useEffect(() => {
    if (!open || probes) return;
    let cancelled = false;

    fetch("/api/tour/embed")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("probe failed"))))
      .then((data: { scenes: EmbedProbe[] }) => {
        if (cancelled) return;
        setProbes(Object.fromEntries(data.scenes.map((p) => [p.id, p])));
      })
      .catch(() => {
        /* Ohne Pruefergebnis wird optimistisch eingebettet - der Timeout
           im Viewer faengt den Fehlerfall ab. */
        if (!cancelled) setProbes({});
      });

    return () => {
      cancelled = true;
    };
  }, [open, probes]);

  const handleOpen = useCallback((sceneId?: string) => {
    if (sceneId && tourScenes.some((s) => s.id === sceneId)) setActiveId(sceneId);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onEvent = (e: Event) => handleOpen((e as CustomEvent<{ sceneId?: string }>).detail?.sceneId);
    window.addEventListener(TOUR_EVENT, onEvent);
    (window as unknown as Record<string, boolean>)[READY_FLAG] = true;
    return () => {
      window.removeEventListener(TOUR_EVENT, onEvent);
      (window as unknown as Record<string, boolean>)[READY_FLAG] = false;
    };
  }, [handleOpen]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <section id="tour" className="section" aria-labelledby="tour-title">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">360° Experience</p>
          </Reveal>

          <Reveal delay={80}>
            <h2 id="tour-title" className="display display-lg mt-5">
              Step inside.
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p className="lede mt-6">
              Entdecke fast 1.000 m² Fusion-Küche, Bar und private Karaoke Rooms – direkt im Browser,
              bevor du reservierst.
            </p>
          </Reveal>

          {/* Das Portal: die Location als Durchgang, nicht als Widget. */}
          <Reveal delay={220} className="mt-14">
            <button
              type="button"
              onClick={() => handleOpen()}
              className="portal portal-frame group relative block w-full overflow-hidden text-left"
              style={{ aspectRatio: "4 / 5" }}
              aria-label="360°-Tour öffnen"
            >
              <div className="absolute inset-0 sm:hidden">
                <SmartImage
                  src={activeScene.preview}
                  alt="Blick in die Location"
                  label="Vorschau folgt"
                  className="h-full w-full"
                  imgClassName="scale-105 transition-transform duration-[1400ms] group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 hidden sm:block">
                <SmartImage
                  src={tourScenes[0].preview}
                  alt="Blick in den Restaurantbereich"
                  label="Vorschau folgt"
                  className="h-full w-full"
                  imgClassName="scale-105 transition-transform duration-[1400ms] group-hover:scale-110"
                />
              </div>

              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(6,5,7,.35) 0%, rgba(6,5,7,.1) 35%, rgba(6,5,7,.88) 100%)",
                }}
              />

              <span className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 p-8 sm:p-12">
                <span className="btn btn-primary transition-transform duration-500 group-hover:scale-[1.04]">
                  Enter 360°
                </span>
                <span className="meta">{tourScenes.length} Räume · Vollbild · Mobil bedienbar</span>
              </span>
            </button>
          </Reveal>

          <Reveal delay={280} className="mt-8">
            <div className="border-t border-[color:var(--hairline)] pt-2">
              <TourSelector
                scenes={tourScenes}
                activeId={activeId}
                onSelect={(id) => {
                  setActiveId(id);
                  handleOpen(id);
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Fullscreen-Overlay */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="360°-Tour"
          className="fixed inset-0 z-[100] flex flex-col bg-ink"
          style={{ height: "100dvh" }}
        >
          <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <p className="meta">
              360°-Tour · {activeScene.index} / {String(tourScenes.length).padStart(2, "0")}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-bone/15 p-3 text-bone/80 transition hover:border-gold/50 hover:text-gold"
              aria-label="360°-Tour schließen"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div className="relative min-h-0 flex-1">
            <TourViewer
              scene={activeScene}
              active={open}
              embeddable={activeProbe ? activeProbe.embeddable : null}
              playerUrl={activeProbe?.playerUrl}
            />
          </div>

          <footer className="border-t border-[color:var(--hairline)] px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6">
            <TourSelector scenes={tourScenes} activeId={activeId} onSelect={setActiveId} />
          </footer>
        </div>
      )}
    </>
  );
}

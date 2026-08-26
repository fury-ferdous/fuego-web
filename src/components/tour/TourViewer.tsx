"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TourScene } from "@/lib/tour-scenes";
import { SmartImage } from "@/components/SmartImage";

/**
 * Wenn der Player nach dieser Zeit kein `load` gemeldet hat, gilt er als
 * blockiert. Zweite Sicherung neben der serverseitigen Header-Pruefung:
 * manche Umgebungen liefern zwar erlaubende Header, laden aber trotzdem nicht.
 */
const LOAD_TIMEOUT_MS = 9000;

type Status = "idle" | "loading" | "ready" | "blocked";

type Props = {
  scene: TourScene;
  /** Ergebnis der serverseitigen Pruefung. `null` = noch unbekannt. */
  embeddable: boolean | null;
  /** Aufgeloeste Player-URL, falls der Server den Redirect schon kennt. */
  playerUrl?: string;
  /** Erst mounten, wenn die Tour wirklich sichtbar ist. */
  active: boolean;
  className?: string;
};

export function TourViewer({ scene, embeddable, playerUrl, active, className = "" }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const src = playerUrl ?? scene.url;
  const blockedByServer = embeddable === false;

  /* Szenenwechsel: Status zuruecksetzen und Timeout neu aufziehen. */
  useEffect(() => {
    if (!active) {
      setStatus("idle");
      return;
    }

    if (blockedByServer) {
      setStatus("blocked");
      return;
    }

    setStatus("loading");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setStatus((s) => (s === "loading" ? "blocked" : s)), LOAD_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [scene.id, active, blockedByServer]);

  /* Bedienhinweis kurz zeigen, dann verschwinden lassen. */
  useEffect(() => {
    if (status !== "ready") return;
    setShowHint(true);
    const t = setTimeout(() => setShowHint(false), 2600);
    return () => clearTimeout(t);
  }, [status, scene.id]);

  useEffect(() => {
    setCanFullscreen(typeof document !== "undefined" && !!document.fullscreenEnabled);
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const handleLoad = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus("ready");
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await el.requestFullscreen();
    } catch {
      /* Vom Browser abgelehnt - das Overlay ist ohnehin bildschirmfuellend. */
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`group relative h-full w-full overflow-hidden bg-ink ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || status !== "ready") return;
        const rect = e.currentTarget.getBoundingClientRect();
        setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onPointerLeave={() => setCursor(null)}
    >
      {/* Standbild liegt immer darunter - dadurch entsteht der Crossfade
          beim Raumwechsel, statt eines schwarzen Lochs. */}
      <SmartImage
        src={scene.preview}
        alt={`${scene.title} – Vorschau der 360°-Ansicht`}
        label={`${scene.index} · ${scene.title}`}
        className="absolute inset-0 h-full w-full"
        imgClassName="scale-105 blur-[1px] opacity-70"
      />

      {active && !blockedByServer && (
        <iframe
          key={scene.id}
          src={src}
          title={`360°-Ansicht: ${scene.title}`}
          onLoad={handleLoad}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allow="fullscreen; gyroscope; accelerometer; magnetometer; xr-spatial-tracking"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0 transition-opacity duration-700"
          style={{ opacity: status === "ready" ? 1 : 0 }}
        />
      )}

      {/* Ladezustand */}
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/55">
          <div className="flex flex-col items-center gap-4">
            <span
              aria-hidden
              className="h-9 w-9 rounded-full border border-bone/15 border-t-gold"
              style={{ animation: "spin-slow 1s linear infinite" }}
            />
            <span className="meta" style={{ animation: "pulse-soft 2s ease-in-out infinite" }}>
              {scene.title} wird geladen
            </span>
          </div>
        </div>
      )}

      {/* Fallback: Player laesst sich nicht einbetten. Nie eine leere Flaeche. */}
      {status === "blocked" && (
        <div className="absolute inset-0 grid place-items-center bg-ink/78 px-6 text-center backdrop-blur-[2px]">
          <div className="max-w-sm">
            <p className="eyebrow mb-3">{scene.index} · {scene.title}</p>
            <p className="display display-md mb-4">Öffnet extern</p>
            <p className="mx-auto mb-7 max-w-xs text-sm leading-relaxed text-[color:var(--text-dim)]">
              Dieser Player lässt sich nicht direkt auf der Seite einbetten. Der Rundgang öffnet
              in einem neuen Tab – mit voller 360°-Steuerung.
            </p>
            <a href={scene.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              360°-Tour öffnen
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      )}

      {/* HUD oben links */}
      <div className="pointer-events-none absolute left-0 top-0 flex items-start gap-4 p-5 sm:p-7">
        <span className="display text-[2.25rem] leading-none text-gold/80">{scene.index}</span>
        <span className="mt-1">
          <span className="block text-base font-medium tracking-wide sm:text-lg">{scene.title}</span>
          <span className="block text-xs text-[color:var(--text-faint)]">{scene.caption}</span>
        </span>
      </div>

      {/* Vollbild */}
      {canFullscreen && status === "ready" && (
        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute right-4 top-4 rounded-full border border-bone/15 bg-ink/60 p-3 text-bone/80 backdrop-blur transition hover:border-gold/50 hover:text-gold sm:right-6 sm:top-6"
          aria-label={isFullscreen ? "Vollbild verlassen" : "Vollbild öffnen"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            {isFullscreen ? (
              <path d="M6 1v5H1M10 15v-5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            ) : (
              <path d="M1 6V1h5M15 10v5h-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            )}
          </svg>
        </button>
      )}

      {/* Hotspot der Szene */}
      {scene.hotspot && status === "ready" && (
        <a
          href={scene.hotspot.href}
          className="absolute bottom-6 left-5 flex items-center gap-3 rounded-full border border-gold/25 bg-ink/65 py-2 pl-3 pr-4 text-xs backdrop-blur transition hover:border-gold/60 sm:left-7"
        >
          <span
            aria-hidden
            className="h-2 w-2 rounded-full bg-gold"
            style={{ animation: "pulse-soft 2.4s ease-in-out infinite" }}
          />
          <span className="text-[color:var(--text-dim)]">{scene.hotspot.label}</span>
          <span className="text-gold">{scene.hotspot.action} →</span>
        </a>
      )}

      {/* Bedienhinweis: Touch-Geraete bekommen einen anderen Text als Maus. */}
      <div
        className="pointer-events-none absolute bottom-6 right-5 transition-opacity duration-500 sm:right-7"
        style={{ opacity: showHint ? 1 : 0 }}
      >
        <span className="meta rounded-full border border-bone/10 bg-ink/60 px-3 py-1.5 backdrop-blur">
          <span className="hidden sm:inline">Ziehen zum Umsehen</span>
          <span className="sm:hidden">Mit dem Finger bewegen</span>
        </span>
      </div>

      {/* Desktop-Cursor über dem Viewer */}
      {cursor && (
        <span
          aria-hidden
          className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-gold/30 bg-ink/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold backdrop-blur sm:block"
          style={{ left: cursor.x, top: cursor.y }}
        >
          Drag to explore
        </span>
      )}
    </div>
  );
}

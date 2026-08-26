"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site.config";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { openTour } from "@/components/tour/TourExperience";

const WORDS = ["Eat.", "Sing.", "Stay late."];

/**
 * Der Hero ist die These der Seite: drei Woerter, drei Teile des Hauses.
 * Dahinter steht der Lichtbogen - dasselbe Portal-Motiv, das spaeter die
 * 360°-Tour und die Raumkarten rahmt.
 *
 * Optionales Video: liegt `/hero.mp4` in /public, wird es hinterlegt.
 * Fehlt es, bleibt die CSS-Komposition stehen - kein schwarzes Rechteck.
 */
export function Hero() {
  const reduced = usePrefersReducedMotion();
  const [videoOk, setVideoOk] = useState(true);
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const offset = Math.min(window.scrollY, window.innerHeight) * 0.12;
      if (headlineRef.current) {
        headlineRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
        headlineRef.current.style.opacity = String(Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.85)));
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <section
      className="relative isolate flex flex-col justify-end overflow-hidden"
      style={{ minHeight: "100svh" }}
      aria-labelledby="hero-title"
    >
      {/* Optionales Hintergrundvideo */}
      {videoOk && (
        <video
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/hero.webp"
          onError={() => setVideoOk(false)}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Lichtbogen - das Portal, aus dem alles andere abgeleitet ist. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[6%] -z-10 h-[78vh] w-[min(88vw,760px)] -translate-x-1/2 portal"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 20%, color-mix(in oklab, var(--color-gold-deep) 40%, transparent), transparent 70%)",
          filter: "blur(14px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[6%] -z-10 h-[78vh] w-[min(88vw,760px)] -translate-x-1/2 portal"
        style={{ boxShadow: "inset 0 1px 0 0 color-mix(in oklab, var(--color-gold) 30%, transparent)" }}
      />

      {/* Glut. Sechs Partikel, mehr braucht es nicht. */}
      {!reduced && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute bottom-0 h-1 w-1 rounded-full bg-gold"
              style={{
                left: `${12 + i * 15}%`,
                ["--dx" as string]: `${(i % 2 === 0 ? 1 : -1) * (20 + i * 8)}px`,
                animation: `ember-drift ${16 + i * 3}s linear ${i * 2.4}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2"
        style={{ background: "linear-gradient(180deg, transparent, var(--color-ink) 88%)" }}
      />

      <div className="shell relative w-full pb-14 pt-[calc(var(--header-h)+4rem)] sm:pb-20">
        <div ref={headlineRef} className="will-change-transform">
          <p className="eyebrow reveal-mask" data-visible="true">
            {site.location.district} · Wien · knapp {site.location.areaSqm.toLocaleString("de-AT")} m²
          </p>

          <h1 id="hero-title" className="display display-xl mt-6">
            {WORDS.map((word, i) => (
              <span key={word} className="block overflow-hidden">
                <span
                  className="block"
                  style={{
                    animation: reduced ? undefined : `hero-line 1.1s var(--ease-out-soft) ${0.15 + i * 0.13}s both`,
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p className="lede mt-8">
            Fusion Kitchen, private Karaoke Rooms und eine Bar, die spät zusperrt – alles unter einem
            Dach in Wien-Favoriten.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="button" onClick={() => openTour()} className="btn btn-primary">
            360°-Location entdecken
          </button>
          <Link href="/#reservierung" className="btn btn-ghost">
            Tisch reservieren
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes hero-line {
          from { transform: translate3d(0, 105%, 0); }
          to   { transform: translate3d(0, 0, 0); }
        }
      `}</style>
    </section>
  );
}

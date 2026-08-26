"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const DAY = ["Restaurant", "Fusion Kitchen", "Lunch", "Dinner"];
const NIGHT = ["Cocktails", "Neon", "Karaoke", "Late Night"];

/**
 * Der Uebergang vom Abend in die Nacht als Scroll-Sequenz. `progress` steuert
 * eine einzige Ueberblendung - kein Pinning, kein Scroll-Hijacking, damit
 * iOS Safari nicht ins Stocken kommt.
 */
export function DayToNight() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setProgress(0.5);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const seen = window.innerHeight - rect.top;
      setProgress(Math.min(1, Math.max(0, seen / total)));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section relative overflow-hidden"
      aria-labelledby="daynight-title"
      style={{
        background: `linear-gradient(${140 + progress * 60}deg,
          color-mix(in oklab, var(--color-gold-deep) ${Math.round((1 - progress) * 16)}%, transparent),
          transparent 55%,
          color-mix(in oklab, var(--color-neon) ${Math.round(progress * 12)}%, transparent))`,
      }}
    >
      <div className="shell">
        <p className="eyebrow">Ein Haus, zwei Temperaturen</p>
        <h2 id="daynight-title" className="display display-lg mt-5">
          Day to night.
        </h2>

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg bg-[color:var(--hairline)] md:grid-cols-2">
          <div
            className="bg-coal p-8 transition-colors duration-700 sm:p-12"
            style={{ opacity: 0.55 + (1 - progress) * 0.45 }}
          >
            <p className="meta" style={{ color: "var(--color-gold)" }}>
              Day
            </p>
            <ul className="mt-8 space-y-4">
              {DAY.map((item) => (
                <li key={item} className="display text-[clamp(1.5rem,3.2vw,2.5rem)] leading-tight text-bone">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[34ch] text-sm leading-relaxed text-[color:var(--text-faint)]">
              Warmes Licht, offene Küche, lange Tische. Der Teil des Hauses, der auch funktioniert,
              wenn niemand singen will.
            </p>
          </div>

          <div
            className="bg-coal p-8 transition-colors duration-700 sm:p-12"
            style={{ opacity: 0.55 + progress * 0.45 }}
          >
            <p className="meta" style={{ color: "var(--color-volt)" }}>
              Night
            </p>
            <ul className="mt-8 space-y-4">
              {NIGHT.map((item) => (
                <li key={item} className="display text-[clamp(1.5rem,3.2vw,2.5rem)] leading-tight text-bone">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[34ch] text-sm leading-relaxed text-[color:var(--text-faint)]">
              Ab 22 Uhr kippt das Haus. Das Licht wird kälter, die Bar wird lauter, und hinter den
              Türen läuft der Teil des Abends, den niemand filmt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

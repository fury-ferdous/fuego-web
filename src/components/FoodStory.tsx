"use client";

import { useState } from "react";
import { foodChapters } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { SmartImage } from "@/components/SmartImage";
import { MenuModal } from "@/components/MenuModal";

export function FoodStory() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <section id="food" className="section" aria-labelledby="food-title">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Zwei Küchen, ein Haus</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="food-title" className="display display-lg mt-5 max-w-[14ch]">
              Fusion without rules.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede mt-7">
              Eine Küchenlinie für Sushi und asiatisch inspirierte Gerichte, eine für italienische
              Klassiker. Beide behalten ihre Handschrift – deshalb funktioniert die Karte quer.
            </p>
          </Reveal>
        </div>

        <div className="mt-24 space-y-24 sm:space-y-32">
          {foodChapters.map((chapter, i) => {
            const inverted = i % 2 === 1;
            return (
              <article key={chapter.id} className="shell">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                  <Reveal variant="mask" className={inverted ? "lg:order-2" : ""}>
                    <SmartImage
                      src={chapter.image}
                      alt={chapter.title}
                      label={`${chapter.title} – Aufnahme folgt`}
                      className="aspect-[5/4] w-full rounded-sm"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      imgClassName="transition-transform duration-[1200ms] hover:scale-[1.03]"
                    />
                  </Reveal>

                  <div className={inverted ? "lg:order-1" : ""}>
                    <Reveal delay={100}>
                      <p className="eyebrow">{chapter.eyebrow}</p>
                      <h3 className="display display-md mt-4">{chapter.title}</h3>
                      <p className="lede mt-5 text-base">{chapter.text}</p>
                    </Reveal>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="shell mt-24">
          <Reveal>
            <button type="button" onClick={() => setMenuOpen(true)} className="btn btn-primary">
              Speisekarte ansehen
            </button>
          </Reveal>
        </div>
      </section>

      <MenuModal open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

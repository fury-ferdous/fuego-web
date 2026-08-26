"use client";

import { useState } from "react";
import { menuCategories } from "@/lib/content";
import { MenuModal } from "@/components/MenuModal";
import { Reveal } from "@/components/Reveal";

/** Kompakte Kartenvorschau fuer Unterseiten - oeffnet dieselbe Speisekarte. */
export function MenuTeaser() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="section" aria-labelledby="menu-teaser-title">
        <div className="shell">
          <h2 id="menu-teaser-title" className="display display-md">
            Auf der Karte
          </h2>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {menuCategories.map((category, i) => (
              <Reveal key={category.id} as="li" delay={i * 40}>
                <span className="display text-[clamp(1.25rem,2.4vw,1.85rem)] text-[color:var(--text-dim)]">
                  {category.label}
                </span>
              </Reveal>
            ))}
          </ul>

          <button type="button" onClick={() => setOpen(true)} className="btn btn-primary mt-12">
            Speisekarte ansehen
          </button>
        </div>
      </section>

      <MenuModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

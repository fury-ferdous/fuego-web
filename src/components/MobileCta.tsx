"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site.config";

/** Dauerhafter Reservieren-Button auf Mobile, sobald der Hero durch ist. */
export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex gap-2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-transform duration-500 sm:hidden"
      style={{
        transform: visible ? "translateY(0)" : "translateY(120%)",
        background: "linear-gradient(180deg, transparent, color-mix(in oklab, var(--color-ink) 92%, transparent) 40%)",
      }}
    >
      <Link href="/#reservierung" className="btn btn-primary flex-1">
        Reservieren
      </Link>
      {site.contact.phone && (
        <a
          href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
          className="btn btn-ghost bg-ink/80 backdrop-blur"
          aria-label="Anrufen"
        >
          Anrufen
        </a>
      )}
    </div>
  );
}

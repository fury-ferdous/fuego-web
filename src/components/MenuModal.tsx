"use client";

import { useEffect, useRef, useState } from "react";
import { menuCategories } from "@/lib/content";
import { site } from "@/lib/site.config";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";

export function MenuModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeId, setActiveId] = useState(menuCategories[0].id);
  const closeRef = useRef<HTMLButtonElement>(null);
  const active = menuCategories.find((c) => c.id === activeId) ?? menuCategories[0];

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Speisekarte"
      className="fixed inset-0 z-[90] flex flex-col bg-ink/97 backdrop-blur-xl"
      style={{ height: "100dvh" }}
    >
      <div className="shell flex items-center justify-between py-5">
        <p className="eyebrow">Speisekarte</p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="rounded-full border border-[color:var(--hairline)] p-3 text-bone/80 transition hover:border-gold/50 hover:text-gold"
          aria-label="Speisekarte schließen"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="shell border-y border-[color:var(--hairline)]">
        <div role="tablist" aria-label="Kategorien" className="hide-scrollbar flex gap-6 overflow-x-auto py-4">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={category.id === activeId}
              onClick={() => setActiveId(category.id)}
              className="whitespace-nowrap text-sm transition-colors"
              style={{ color: category.id === activeId ? "var(--color-gold)" : "var(--text-dim)" }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="shell min-h-0 flex-1 overflow-y-auto py-10">
        <h2 className="display display-md">{active.label}</h2>
        <p className="lede mt-4 text-base">{active.intro}</p>

        <ul className="mt-10 max-w-2xl">
          {active.items.map((item) => (
            <li
              key={item.name}
              className="flex items-baseline justify-between gap-6 border-b border-[color:var(--hairline)] py-5"
            >
              <span className="text-lg text-bone">{item.name}</span>
              {item.price ? (
                <span className="meta shrink-0" style={{ color: "var(--color-gold)" }}>
                  {item.price}
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-lg border border-[color:var(--hairline)] p-6">
          <p className="text-sm leading-relaxed text-[color:var(--text-dim)]">
            Die vollständige Karte mit allen Gerichten, Varianten und aktuellen Preisen liegt als PDF
            vor. Für die privaten Karaoke-Räume gibt es eine eigene Speise- und Getränkekarte.
          </p>
          <a
            href={site.links.menuPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost mt-6"
          >
            Vollständige Karte als PDF
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}

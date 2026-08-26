"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site.config";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";

const nav = [
  { label: "Experience", href: "/#experience" },
  { label: "360° Tour", href: "/#tour" },
  { label: "Food", href: "/#food" },
  { label: "Karaoke", href: "/#karaoke" },
  { label: "Gallery", href: "/#gallery" },
  { label: "About", href: "/#about" },
  { label: "FAQ", href: "/#faq" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useLockBodyScroll(menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500"
        style={{
          backgroundColor: scrolled ? "color-mix(in oklab, var(--color-ink) 72%, transparent)" : "transparent",
          backdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none",
          borderBottom: `1px solid ${scrolled ? "var(--hairline)" : "transparent"}`,
        }}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link
            href="/"
            className="display text-2xl lowercase tracking-tight text-bone transition-colors hover:text-gold"
            aria-label={`${site.brand.name} Startseite`}
          >
            {site.brand.wordmark}
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] tracking-wide text-[color:var(--text-dim)] transition-colors hover:text-bone"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/#reservierung" className="btn btn-primary hidden sm:inline-flex">
              Reservieren
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline)] lg:hidden"
              aria-label="Menü öffnen"
              aria-expanded={menuOpen}
            >
              <span aria-hidden className="relative block h-[9px] w-4">
                <span className="absolute inset-x-0 top-0 h-px bg-bone" />
                <span className="absolute inset-x-0 bottom-0 h-px bg-bone" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-ink lg:hidden"
          style={{ height: "100dvh" }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="shell flex h-[var(--header-h)] items-center justify-between">
            <span className="display text-2xl lowercase text-bone">{site.brand.wordmark}</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline)]"
              aria-label="Menü schließen"
              autoFocus
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav aria-label="Hauptnavigation mobil" className="shell flex flex-1 flex-col justify-center gap-1 pb-24">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="display flex items-baseline gap-4 py-2 text-[2rem] text-bone transition-colors hover:text-gold"
              >
                <span className="meta w-8 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </Link>
            ))}

            <div className="mt-8 flex flex-col gap-3">
              <Link href="/#reservierung" onClick={() => setMenuOpen(false)} className="btn btn-primary">
                Tisch oder Raum reservieren
              </Link>
              <Link href="/#tour" onClick={() => setMenuOpen(false)} className="btn btn-ghost">
                360°-Tour öffnen
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

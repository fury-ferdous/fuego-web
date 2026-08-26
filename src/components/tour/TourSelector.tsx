"use client";

import { useEffect, useRef } from "react";
import type { TourScene } from "@/lib/tour-scenes";

type Props = {
  scenes: TourScene[];
  activeId: string;
  onSelect: (id: string) => void;
};

/**
 * Raumwahl als Rundgang. Die Nummerierung ist keine Dekoration - sie bildet
 * den Weg durch das Haus ab: vom Restaurant vorne bis zu den privaten
 * Raeumen hinten.
 */
export function TourSelector({ scenes, activeId, onSelect }: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  /* Aktiven Eintrag auf Mobile in den sichtbaren Bereich holen. */
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-scene="${activeId}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeId]);

  const move = (direction: 1 | -1) => {
    const index = scenes.findIndex((s) => s.id === activeId);
    const next = (index + direction + scenes.length) % scenes.length;
    onSelect(scenes[next].id);
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Räume der 360°-Tour"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          move(1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          move(-1);
        }
      }}
      className="hide-scrollbar flex snap-x snap-mandatory gap-1 overflow-x-auto"
    >
      {scenes.map((scene) => {
        const isActive = scene.id === activeId;
        return (
          <button
            key={scene.id}
            type="button"
            role="tab"
            data-scene={scene.id}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(scene.id)}
            className="group relative shrink-0 snap-center px-4 py-3.5 text-left transition-colors sm:px-5"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-500"
              style={{
                background: "var(--color-gold)",
                transform: `scaleX(${isActive ? 1 : 0})`,
              }}
            />
            <span
              className="block text-[10px] tracking-[0.28em] transition-colors"
              style={{ color: isActive ? "var(--color-gold)" : "var(--text-faint)" }}
            >
              {scene.index}
            </span>
            <span
              className="mt-1 block whitespace-nowrap text-sm transition-colors group-hover:text-bone"
              style={{ color: isActive ? "var(--color-bone)" : "var(--text-dim)" }}
            >
              {scene.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

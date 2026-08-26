"use client";

import { useState } from "react";
import { openConfigTodos } from "@/lib/site.config";

/**
 * Nur im Entwicklungsmodus sichtbar. Listet auf, welche Betriebsdaten noch
 * Platzhalter sind, damit nichts unbemerkt live geht. In Produktion rendert
 * die Komponente nichts.
 */
export function ConfigTodo() {
  const [dismissed, setDismissed] = useState(false);

  if (process.env.NODE_ENV === "production" || dismissed) return null;

  const todos = openConfigTodos();
  if (todos.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[110] max-w-xs rounded-md border border-gold/40 bg-ink/95 p-4 text-xs backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <p className="meta" style={{ color: "var(--color-gold)" }}>
          Offen vor Livegang
        </p>
        <button type="button" onClick={() => setDismissed(true)} aria-label="Hinweis ausblenden" className="text-bone/60">
          ×
        </button>
      </div>
      <ul className="mt-3 space-y-2 text-[color:var(--text-dim)]">
        {todos.map((todo) => (
          <li key={todo}>· {todo}</li>
        ))}
      </ul>
    </div>
  );
}

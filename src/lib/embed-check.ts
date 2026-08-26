/**
 * EMBED-CHECK
 * -----------
 * Ob eine fremde Seite im iframe laufen darf, entscheiden zwei Header:
 * `X-Frame-Options` und `Content-Security-Policy: frame-ancestors`.
 * Beide sind im Browser nicht auslesbar - der Client sieht nur eine leere
 * Flaeche. Deshalb fragt der Server sie ab, cached das Ergebnis und die
 * Seite entscheidet daraus, ob sie den Player einbettet oder auf die
 * Preview-Variante geht.
 *
 * Zusaetzlich wird der Redirect aufgeloest: der Share-Link zeigt auf einen
 * `/player`-Endpunkt mit Query-Parametern. Direkt diesen zu laden spart
 * einen Roundtrip.
 *
 * Faellt die Pruefung aus (Netzwerkfehler, Timeout), wird optimistisch
 * `embeddable: true` gemeldet - der Client hat als zweite Sicherung einen
 * eigenen Timeout und faengt den Fall ab. Die Seite zeigt nie ein leeres
 * iframe.
 */

export type EmbedProbe = {
  id: string;
  embeddable: boolean;
  /** Aufgeloeste Player-URL nach Redirects, sonst die Original-URL. */
  playerUrl: string;
  /** Kurzbegruendung - nur fuer Logs und das Dev-Panel. */
  reason: string;
};

const PROBE_TIMEOUT_MS = 6000;
/** 6 Stunden - Header aendern sich selten, aber nicht nie. */
export const PROBE_REVALIDATE_SECONDS = 21600;

function readsAsBlocked(xFrameOptions: string | null, csp: string | null, selfOrigin: string) {
  if (xFrameOptions) {
    const value = xFrameOptions.trim().toLowerCase();
    if (value.includes("deny")) return "X-Frame-Options: DENY";
    if (value.includes("sameorigin")) return "X-Frame-Options: SAMEORIGIN";
    if (value.includes("allow-from")) {
      return value.includes(selfOrigin.toLowerCase()) ? null : "X-Frame-Options: ALLOW-FROM (fremde Origin)";
    }
  }

  if (csp) {
    const directive = csp
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.toLowerCase().startsWith("frame-ancestors"));

    if (directive) {
      const sources = directive
        .slice("frame-ancestors".length)
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((s) => s.toLowerCase());

      if (sources.includes("'none'")) return "CSP frame-ancestors 'none'";
      if (sources.includes("*")) return null;

      const host = selfOrigin.replace(/^https?:\/\//, "").toLowerCase();
      const allowed = sources.some((src) => {
        const clean = src.replace(/^https?:\/\//, "").replace(/:\d+$/, "");
        if (clean.startsWith("*.")) return host.endsWith(clean.slice(1));
        return clean === host;
      });

      if (!allowed) return `CSP frame-ancestors erlaubt ${host} nicht`;
    }
  }

  return null;
}

export async function probeScene(id: string, url: string, selfOrigin: string): Promise<EmbedProbe> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        // Ohne plausiblen UA liefern manche CDNs eine abweichende Antwort.
        "User-Agent": "Mozilla/5.0 (compatible; TourEmbedCheck/1.0)",
        Accept: "text/html",
      },
      next: { revalidate: PROBE_REVALIDATE_SECONDS },
    });

    const blockedBy = readsAsBlocked(
      response.headers.get("x-frame-options"),
      response.headers.get("content-security-policy"),
      selfOrigin,
    );

    /**
     * Antwortet der Server nicht mit 2xx, wird nicht eingebettet. Ein
     * abgelaufener Share-Link oder eine Fehlerseite wuerde sonst als
     * "erlaubt" durchgehen und im iframe als Fremdfehler landen.
     */
    if (!response.ok) {
      return { id, embeddable: false, playerUrl: url, reason: `Antwort ${response.status} – Link prüfen` };
    }

    return {
      id,
      embeddable: !blockedBy,
      playerUrl: response.url || url,
      reason: blockedBy ?? "Keine Frame-Beschränkung gefunden",
    };
  } catch (error) {
    return {
      id,
      embeddable: true,
      playerUrl: url,
      reason: `Prüfung fehlgeschlagen (${error instanceof Error ? error.name : "unbekannt"}) – Client-Fallback greift`,
    };
  } finally {
    clearTimeout(timer);
  }
}

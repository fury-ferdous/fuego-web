"use client";

import { useMemo, useState } from "react";
import { karaokeRooms } from "@/lib/content";
import { site } from "@/lib/site.config";
import { Reveal } from "@/components/Reveal";

/**
 * Ziel des Formulars. Standard ist die Next.js-Route; zeigt die Variable auf
 * das PHP-Skript, wird direkt dorthin gesendet.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_RESERVATION_ENDPOINT || "/api/reservierung";

type Kind = "restaurant" | "karaoke" | "beides";
type Status = "idle" | "sending" | "sent" | "fallback" | "error";

const KINDS: { id: Kind; label: string; note: string }[] = [
  { id: "restaurant", label: "Restaurant", note: "Tisch im Restaurantbereich" },
  { id: "karaoke", label: "Karaoke Room", note: "Privater Raum, ab 16:00" },
  { id: "beides", label: "Restaurant + Karaoke", note: "Erst essen, dann singen" },
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  guests: "",
  room: "",
  message: "",
  website: "",
};

export function Reservation() {
  const [kind, setKind] = useState<Kind>("restaurant");
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  /** Vorausgefüllter E-Mail-Entwurf – greift, wenn kein Endpunkt konfiguriert ist. */
  const mailtoHref = useMemo(() => {
    const kindLabel = KINDS.find((k) => k.id === kind)?.label ?? "";
    const body = [
      `Art: ${kindLabel}`,
      form.room && `Raum: ${form.room}`,
      `Name: ${form.name}`,
      `Telefon: ${form.phone}`,
      `E-Mail: ${form.email}`,
      `Datum: ${form.date}`,
      `Uhrzeit: ${form.time}`,
      `Personen: ${form.guests}`,
      form.message && `Nachricht: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");

    const [to, ...rest] = site.reservationRecipients;
    const cc = rest.length ? `&cc=${encodeURIComponent(rest.join(","))}` : "";

    return `mailto:${to}?subject=${encodeURIComponent(
      `Reservierungsanfrage – ${kindLabel}`,
    )}${cc}&body=${encodeURIComponent(body)}`;
  }, [form, kind]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: kind }),
      });

      if (response.ok) {
        setStatus("sent");
        return;
      }

      const data = await response.json().catch(() => ({}));
      const softFail = ["not_configured", "delivery_failed", "too_many_requests", "method_not_allowed"];
      setStatus(softFail.includes(data?.error) ? "fallback" : "error");
    } catch {
      setStatus("fallback");
    }
  };

  const showKaraokeFields = kind !== "restaurant";

  return (
    <section id="reservierung" className="section" aria-labelledby="reservation-title">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow">Reservierung</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 id="reservation-title" className="display display-lg mt-5">
                Your table.
                <br />
                Your room.
                <br />
                Your night.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="lede mt-7">
                Wähle, was du brauchst. Wir bestätigen jede Anfrage persönlich – automatisch bestätigt
                wird hier nichts.
              </p>
            </Reveal>

            {site.contact.phone && (
              <Reveal delay={200}>
                <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="btn btn-ghost mt-8">
                  {site.contact.phoneDisplay}
                </a>
              </Reveal>
            )}
          </div>

          <div>
            <fieldset className="mb-8">
              <legend className="meta mb-4">Art der Reservierung</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {KINDS.map((option) => {
                  const active = option.id === kind;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setKind(option.id)}
                      aria-pressed={active}
                      className="rounded-md border p-4 text-left transition"
                      style={{
                        borderColor: active ? "var(--color-gold)" : "var(--hairline)",
                        background: active ? "color-mix(in oklab, var(--color-gold) 8%, transparent)" : "transparent",
                      }}
                    >
                      <span className="block text-sm text-bone">{option.label}</span>
                      <span className="mt-1 block text-xs text-[color:var(--text-faint)]">{option.note}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <form onSubmit={submit} noValidate={false}>
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={form.website}
                onChange={set("website")}
                className="absolute left-[-9999px] h-px w-px opacity-0"
              />

              <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <Field label="Name" required value={form.name} onChange={set("name")} autoComplete="name" />
                <Field label="Telefon" required type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" />
                <Field label="E-Mail" required type="email" value={form.email} onChange={set("email")} autoComplete="email" />
                <Field label="Personen" required type="number" min="1" max="30" value={form.guests} onChange={set("guests")} />
                <Field label="Datum" required type="date" value={form.date} onChange={set("date")} />

                <label className="block">
                  <span className="meta">Uhrzeit *</span>
                  {showKaraokeFields ? (
                    <select required value={form.time} onChange={set("time")} className="mt-2 w-full appearance-none rounded-md border border-[color:var(--hairline)] bg-coal px-4 py-3 text-sm text-bone transition focus:border-gold">
                      <option value="">Zeitfenster wählen</option>
                      {site.bookingSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input required type="time" value={form.time} onChange={set("time")} className="mt-2 w-full rounded-md border border-[color:var(--hairline)] bg-coal px-4 py-3 text-sm text-bone transition focus:border-gold" />
                  )}
                </label>

                {showKaraokeFields && (
                  <label className="block sm:col-span-2">
                    <span className="meta">Raum (optional)</span>
                    <select value={form.room} onChange={set("room")} className="mt-2 w-full appearance-none rounded-md border border-[color:var(--hairline)] bg-coal px-4 py-3 text-sm text-bone transition focus:border-gold">
                      <option value="">Vorschlag vom Team</option>
                      {karaokeRooms.map((room) => (
                        <option key={room.slug} value={room.name}>
                          {room.name} – {room.capacityLabel} – ab {room.fromPrice} €
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                <label className="block sm:col-span-2">
                  <span className="meta">Nachricht</span>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Anlass, Allergien, besondere Wünsche"
                    className="mt-2 w-full resize-y rounded-md border border-[color:var(--hairline)] bg-coal px-4 py-3 text-sm text-bone transition placeholder:text-[color:var(--text-faint)] focus:border-gold"
                  />
                </label>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
                  {status === "sending" ? "Wird gesendet …" : "Anfrage senden"}
                </button>
                <p className="text-xs text-[color:var(--text-faint)]">
                  Pflichtfelder sind mit * markiert. Details in der{" "}
                  <a href={site.links.datenschutz} className="underline underline-offset-4 hover:text-gold">
                    Datenschutzerklärung
                  </a>
                  .
                </p>
              </div>

              <div aria-live="polite" className="mt-6">
                {status === "sent" && (
                  <p className="rounded-md border border-gold/30 bg-gold/5 p-5 text-sm leading-relaxed text-bone">
                    Anfrage ist eingegangen. Wir melden uns zur Bestätigung – erst danach ist die
                    Reservierung fix.
                  </p>
                )}

                {status === "fallback" && (
                  <div className="rounded-md border border-[color:var(--hairline)] p-5">
                    <p className="text-sm leading-relaxed text-[color:var(--text-dim)]">
                      Der Versand ist auf dieser Seite noch nicht eingerichtet. Damit nichts verloren
                      geht: Der Entwurf unten enthält bereits alle Angaben – ein Klick öffnet ihn im
                      E-Mail-Programm.
                    </p>
                    <a href={mailtoHref} className="btn btn-primary mt-5">
                      Anfrage per E-Mail öffnen
                    </a>
                  </div>
                )}

                {status === "error" && (
                  <p className="rounded-md border border-[color:var(--color-ember)] p-5 text-sm leading-relaxed text-bone">
                    Ein Pflichtfeld fehlt oder die E-Mail-Adresse stimmt nicht. Bitte oben prüfen und
                    erneut senden.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  ...props
}: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="meta">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        required={required}
        {...props}
        className="mt-2 w-full rounded-md border border-[color:var(--hairline)] bg-coal px-4 py-3 text-sm text-bone transition placeholder:text-[color:var(--text-faint)] focus:border-gold"
      />
    </label>
  );
}

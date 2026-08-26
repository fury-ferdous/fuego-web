import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string;
  type?: string;
  room?: string;
  message?: string;
  /** Honeypot - Bots fuellen es aus, Menschen sehen es nicht. */
  website?: string;
};

const required: (keyof Payload)[] = ["name", "email", "phone", "date", "time", "guests", "type"];

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (data.website) {
    // Honeypot ausgeloest: still verwerfen.
    return NextResponse.json({ ok: true });
  }

  const missing = required.filter((field) => !data[field]?.toString().trim());
  if (missing.length) {
    return NextResponse.json({ ok: false, error: "missing_fields", missing }, { status: 422 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email!)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  /**
   * Zwei moegliche Ziele: das PHP-Mailskript auf dem Webspace oder ein
   * beliebiger Webhook. Ist keins gesetzt, wird bewusst 501 gemeldet - das
   * Formular zeigt dann einen vorausgefuellten E-Mail-Entwurf, statt eine
   * erfolgreiche Uebermittlung vorzutaeuschen.
   */
  const target = process.env.RESERVATION_PHP_ENDPOINT || process.env.RESERVATION_WEBHOOK_URL;

  if (!target) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 501 });
  }

  try {
    const response = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, receivedAt: new Date().toISOString() }),
    });

    if (!response.ok) throw new Error(`Ziel antwortete mit ${response.status}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}

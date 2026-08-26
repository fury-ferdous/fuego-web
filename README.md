# fuego – Website

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · keine Animationsbibliothek.

Restaurant, Bar und sieben private Karaoke-Räume auf knapp 1.000 m² in
Wien-Favoriten – mit einer 360°-Tour als zentralem Element.

---

## Starten

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start    # Produktions-Build
npm run typecheck             # nur Typen prüfen
```

Node 20 oder neuer.

---

## Checkliste vor dem Livegang

Der Reihe nach. Punkt 1–4 sind Pflicht, alles andere macht die Seite besser.

### 1. Betriebsdaten bestätigen → `src/lib/site.config.ts`

| Feld | Status | Was zu tun ist |
| --- | --- | --- |
| `brand.name` | gesetzt: `fuego` | Prüfen, ob die Seite unter diesem Namen läuft |
| `location.street` | `Jagdgasse 4, 1100 Wien` | Bestätigen |
| `contact.phone` | **leer** | Nummer eintragen, `phoneVerified: true` setzen |
| `hours.entries` | **abgeleitet** | Echte Zeiten eintragen, `verified: true` setzen |
| `location.geo` | **geschätzt** | Exakte Koordinaten, `verified: true` setzen |
| `social.*` | **leer** | Instagram, TikTok, Facebook, Google-Profil |

`hours` und `geo` landen erst im Schema-Markup, wenn `verified: true` steht –
falsche Öffnungszeiten in den Google-Ergebnissen sind schlimmer als keine.

Solange Punkte offen sind, zeigt die Seite **im Dev-Modus** unten links ein
Hinweisfeld. In Produktion rendert es nie.

### 2. Räume der 360°-Tour zuordnen → `src/lib/tour-scenes.ts`

Die acht Insta360-Links liegen dort in der vom Briefing vorgeschlagenen
Reihenfolge (Restaurant, Main Area, Bar, Lounge, KTV 01–04). Von außen lässt
sich nicht erkennen, welcher Link welchen Raum zeigt.

Einmal durchklicken, `title` und `caption` korrigieren – Viewer, Selector,
Raumseiten und Deep-Links ziehen automatisch nach.

Über `sceneId` in `src/lib/content.ts` hängen die Karaoke-Räume an ihren
Szenen. Aktuell sind vier Räume verknüpft; sobald die Zuordnung steht,
lassen sich die restlichen ergänzen.

### 3. Bilder ablegen

Fehlt eine Datei, rendert `SmartImage` eine gestaltete dunkle Fläche mit
Beschriftung statt eines kaputten Bildes. Die Seite sieht auch ohne ein
einziges Foto fertig aus – aber natürlich nicht gut.

```
public/
  hero.webp              Standbild für den Hero (optional: hero.mp4 dazu)
  tour/01-restaurant.webp … 08-ktv-04.webp    Vorschaubilder der Tour
  rooms/kyoto.webp … whisky-club.webp         die sieben Räume
  food/sushi-pizza.webp … cocktails.webp      Gerichte aus der Food-Story
  gallery/01.webp … 09.webp                   Galerie
  gallery/interior-wide.webp                  Innenaufnahme Section 1
```

Empfehlung: WebP, ca. 1600 px Breite für Vollflächen, 1000 px für Karten.
Die Vorschaubilder der Tour lassen sich als Still aus jedem Panorama
exportieren.

Alt-Texte stehen in `src/lib/content.ts` und sind bereits gefüllt.

### 4. Reservierungen empfangen

Jede Anfrage geht an **office@fuego.at** und **dugicalko@gmail.com** – beide
im To-Feld, kein Cc.

Ohne konfiguriertes Ziel meldet die Seite bewusst `501` und das Formular zeigt
einen vorausgefüllten E-Mail-Entwurf an beide Adressen. Es wird nie
„gesendet" angezeigt, wenn nichts gesendet wurde.

**Variante A – PHP-Mailer (empfohlen bei PHP-Hosting)**

`php/reservierung.php` auf den Webspace legen, z. B. nach
`https://fuego.at/mail/reservierung.php`. Dann in `.env.local`:

```
NEXT_PUBLIC_RESERVATION_ENDPOINT=https://fuego.at/mail/reservierung.php
```

Im Skript oben prüfen: `$RECIPIENTS`, `$FROM_ADDRESS` und `$ALLOWED_ORIGINS`.
Die Absenderadresse **muss** auf fuego.at liegen – eine Gmail- oder
Fremdadresse im `From` lässt die Mail durch SPF fallen und landet bei Gmail
im Spam. Empfehlung: `no-reply@fuego.at` im Hosting anlegen.

Was das Skript macht: Honeypot prüfen, Felder validieren, Header-Injection
blockieren, pro IP höchstens alle 20 Sekunden eine Anfrage annehmen, an beide
Adressen senden (Reply-To = Gast) und dem Gast eine Eingangsbestätigung
schicken, die ausdrücklich sagt, dass die Reservierung noch nicht fix ist.

**Variante B – serverseitige Weiterleitung**

Versteckt die Skript-Adresse vor dem Quelltext:

```
RESERVATION_PHP_ENDPOINT=https://fuego.at/mail/reservierung.php
```

**Variante C – Webhook**

```
RESERVATION_WEBHOOK_URL=https://…
```

Der Endpunkt bekommt ein JSON mit allen Feldern plus `receivedAt`. Make,
Zapier, n8n oder ein eigener Handler funktionieren gleichermaßen.

**Test nach dem Aufsetzen:** einmal absenden und prüfen, ob die Mail in
*beiden* Postfächern liegt – nicht nur in einem. Gmail-Spamordner mitprüfen.

### 5. Impressum vervollständigen → `src/lib/site.config.ts` → `imprint`

Betreiber der Website ist **Digital Denker e.U., Wattgasse 33, 1160 Wien**.
Die Seite liegt unter `/impressum` und rendert nur gefüllte Felder – leere
Zeilen erscheinen nicht.

Noch offen und in Österreich nach § 5 ECG **verpflichtend**:

| Feld | Beispiel |
| --- | --- |
| `owner` | Name des Inhabers |
| `email` | Kontaktadresse des Betreibers |
| `companyRegisterNumber` | FN 123456a |
| `companyRegisterCourt` | Handelsgericht Wien |
| `supervisoryAuthority` | Magistratisches Bezirksamt für den 16. Bezirk |
| `vatId` | ATU12345678, falls vorhanden |
| `businessPurpose` | Gegenstand des Unternehmens |

Beim Betrieb (`imprint.venue`) sind Firmenbuchnummer und UID offen; die als
`KTV Gastro GmbH` eingetragene Firma stammt aus der bisherigen Website und
gehört geprüft.

Ein unvollständiges Impressum ist verwaltungsstrafbewehrt. Das Dev-Panel
listet die fehlenden Felder, ersetzt aber keine rechtliche Prüfung.

Die Datenschutzerklärung zeigt weiterhin auf `fuego.at/datenschutz.html`. Sie
gehört geprüft, sobald das Reservierungsformular live ist – es verarbeitet
personenbezogene Daten und lädt Google Maps auf Klick.

### 6. Optional

- `NEXT_PUBLIC_SITE_URL` auf die Produktionsdomain setzen (Canonicals,
  Sitemap, Schema).
- NAP-Konsistenz prüfen: Name, Adresse und Telefonnummer stehen im Footer, im
  Impressum und im Schema-Markup identisch. Google Business Profile und
  Branchenverzeichnisse müssen exakt dieselbe Schreibweise verwenden –
  „Fuego Karaoke Bar Restaurant", „Jagdgasse 4, 1100 Wien", „0664 99689261".
- Echte Bewertungen in `reviews` in `src/lib/content.ts`. Solange das Array
  leer ist, verlinkt die Sektion auf Google, statt Zitate zu erfinden.
- Preise in `menuCategories` ergänzen, sobald sie bestätigt sind.

---

## Wie die 360°-Tour funktioniert

Das ist der Teil, der am meisten schiefgehen kann, deshalb ausführlicher.

**Das Problem:** Ob eine fremde Seite im `iframe` laufen darf, entscheiden
`X-Frame-Options` und `Content-Security-Policy: frame-ancestors`. Beide sind
im Browser nicht auslesbar – blockiert der Anbieter, sieht der Besucher
einfach eine weiße Fläche, und JavaScript erfährt nichts davon.

**Die Lösung:** Drei Ebenen.

1. **Serverseitige Prüfung.** `/api/tour/embed` ruft jede Szene ab, folgt dem
   Redirect auf den `/player`-Endpunkt, liest die Header und meldet pro Szene
   `embeddable` plus die aufgelöste Player-URL. Ergebnis wird 6 Stunden
   gecacht. Läuft erst, wenn jemand die Tour öffnet.
2. **Client-Timeout.** Meldet der Player nach 9 Sekunden kein `load`, gilt er
   als blockiert. Fängt Fälle ab, in denen die Header erlauben, das Laden
   aber trotzdem scheitert.
3. **Fallback.** Statt einer leeren Fläche erscheint eine gestaltete Karte mit
   Raumname und „360°-Tour öffnen" – Insta360 im neuen Tab, volle Steuerung.

Zusätzlich: eine Antwort außerhalb 2xx (abgelaufener Share-Link, Fehlerseite)
gilt ebenfalls als „nicht einbetten". Schlägt die Prüfung ganz fehl, wird
optimistisch eingebettet und der Timeout übernimmt.

**Performance:** Es läuft immer nur ein Player. Beim Raumwechsel wird das
`iframe` neu gemountet, darunter liegt das Standbild – daraus entsteht der
Crossfade. Acht gleichzeitige Player gibt es nie.

Deep-Link aus jedem Kontext:

```ts
import { openTour } from "@/components/tour/TourExperience";
openTour("bar");   // öffnet die Tour direkt beim Barbereich
```

Liegt auf der aktuellen Seite keine Tour, navigiert der Aufruf zu `/#tour`
statt ins Leere zu klicken.

---

## Struktur

```
src/
  app/
    page.tsx                  Startseite
    [slug]/page.tsx           die fünf SEO-Landingpages
    karaoke/[room]/page.tsx   Detailseite je Raum
    api/tour/embed/           iframe-Prüfung
    api/reservierung/         Formular-Endpunkt
    opengraph-image.tsx       Social-Vorschau, aus der Config generiert
    impressum/page.tsx        Impressum nach § 5 ECG
    sitemap.ts · robots.ts
  components/
    tour/                     TourExperience · TourViewer · TourSelector
    …                         Hero, FoodStory, KaraokeRooms, Gallery …
  lib/
    site.config.ts            Betriebsdaten und Impressum – einzige Quelle
    tour-scenes.ts            die acht Insta360-Szenen
    content.ts                Räume, Karte, Galerie, FAQ, Bewertungen
    landing-pages.ts          Texte der SEO-Seiten
    schema.ts                 Structured Data
php/
  reservierung.php            Mailer für PHP-Hosting, optional
```

Alles, was sich am Betrieb ändern kann, liegt in `lib/`. Komponenten lesen,
schreiben nicht.

---

## Entscheidungen, die vom Briefing abweichen

**Kein Framer Motion.** IntersectionObserver plus CSS-Transitions liefern
dieselben Reveals ohne zusätzliches Kilobyte. Der First Load der Startseite
liegt bei 124 kB. Scroll-Effekte laufen über eine einzige CSS-Variable
(`--night`) und einen rAF-Tick statt über Layout-erzwingende Listener.

**Keine Preise in der Speisekarte.** Die Gerichtsnamen stammen aus dem
Briefing, die Preise nicht. Die Karte verlinkt aufs offizielle PDF, bis die
Zahlen bestätigt sind. Erfundene Preise wären der schlimmere Fehler.

**Google Maps lädt erst auf Klick.** Spart Requests und setzt keine
Google-Cookies, bevor jemand sie braucht.

**Keine Bewertungen ohne Bewertungen.** Siehe oben.

---

## Barrierefreiheit und Mobile

- Skip-Link, sichtbare Focus-States, ARIA-Rollen an Tabs, Dialogen und
  Galerie, Tastatursteuerung in Tour (Pfeiltasten) und Lightbox.
- `prefers-reduced-motion` schaltet sämtliche Animationen ab, Inhalte bleiben
  vollständig sichtbar.
- `100dvh` / `100svh` statt `100vh` – keine abgeschnittenen Buttons in
  iOS Safari. `overflow-x: clip` auf `body` verhindert horizontales Scrollen.
- Scroll-Lock in Modals ohne Sprung nach oben.
- Sticky Reservieren-Button auf Mobile ab 70 % Hero-Höhe, mit
  `env(safe-area-inset-bottom)`.

---

## SEO

Umgesetzt: Metadata pro Seite, Canonicals, OpenGraph mit generiertem Bild,
`sitemap.xml`, `robots.txt` und Structured Data für Organization,
LocalBusiness, Restaurant (inkl. Angebote pro Raum), Menu, FAQPage und
BreadcrumbList.

Die fünf Landingpages beantworten jeweils eine eigene Frage und teilen keinen
Textbaustein – sonst wären es Doorway-Pages und der Aufwand kehrte sich um.

Vor dem Livegang: Rich-Results-Test auf Startseite, einer Landingpage und
einer Raumseite laufen lassen.

import { Reveal } from "@/components/Reveal";
import { SmartImage } from "@/components/SmartImage";
import { karaokeRooms } from "@/lib/content";
import { site } from "@/lib/site.config";

const stats = [
  { value: `~${site.location.areaSqm.toLocaleString("de-AT")} m²`, label: "Location" },
  { value: String(karaokeRooms.length), label: "Private Rooms" },
  { value: "Zwei Küchen", label: "Fusion Concept" },
  { value: "Late Night", label: "Bar & Karaoke" },
];

export function ExperienceIntro() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow">Die Location</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 id="experience-title" className="display display-lg mt-5">
                {site.location.areaSqm.toLocaleString("de-AT")} m².
                <br />
                Ein Abend.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="lede mt-7">
                Restaurant, Fusion Kitchen, Bar und sieben private Karaoke-Räume unter einem Dach.
                Kein Ortswechsel, kein zweites Lokal, kein Taxi um Mitternacht.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-[color:var(--text-faint)]">
                Der Abend beginnt am Tisch und endet dort, wo du ihn beenden willst – an der Bar oder
                hinter einer Tür, die nur deiner Gruppe gehört.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120} variant="mask">
            <SmartImage
              src="/gallery/interior-wide.webp"
              alt="Innenraum der Location mit Restaurantbereich und Bar"
              label="Innenaufnahme folgt"
              className="portal portal-frame aspect-[4/5] w-full"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-[color:var(--hairline)] pt-10 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90}>
              <p className="display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-none text-bone">{stat.value}</p>
              <p className="meta mt-3">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

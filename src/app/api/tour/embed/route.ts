import { NextResponse } from "next/server";
import { probeScene } from "@/lib/embed-check";
import { site } from "@/lib/site.config";
import { tourScenes } from "@/lib/tour-scenes";

/**
 * Liefert fuer jede Szene, ob der Insta360-Player eingebettet werden darf.
 * Die Antwort wird sechs Stunden gecacht (Data Cache in `probeScene`),
 * die Route selbst laeuft dynamisch, damit der Build kein Netz braucht.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const scenes = await Promise.all(
    tourScenes.map((scene) => probeScene(scene.id, scene.url, site.brand.url)),
  );

  return NextResponse.json(
    { scenes },
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=21600, stale-while-revalidate=86400" } },
  );
}

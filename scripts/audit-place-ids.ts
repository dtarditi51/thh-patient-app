// Fetches the real lat/lng for each Place ID from Google.
// Prints a TS snippet you can paste into data/locations.ts.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { locations } from "../data/locations";

function loadDotEnv(path: string): Record<string, string> {
  try {
    const raw = readFileSync(path, "utf8");
    const out: Record<string, string> = {};
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      out[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
    }
    return out;
  } catch {
    return {};
  }
}
const env = { ...loadDotEnv(join(process.cwd(), ".env.local")), ...process.env };
if (!env.GOOGLE_PLACES_API_KEY) {
  console.error("Missing GOOGLE_PLACES_API_KEY");
  process.exit(1);
}
const KEY: string = env.GOOGLE_PLACES_API_KEY;

async function details(placeId: string) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "name,formatted_address,geometry");
  url.searchParams.set("key", KEY);
  const res = await fetch(url);
  return res.json();
}

const round = (n: number) => Math.round(n * 10000) / 10000;

async function main() {
  console.log("\nReal Google coordinates per office (canonical from each Place ID):\n");
  console.log("slug              current lat,lng         canonical lat,lng        drift (m)");
  console.log("─".repeat(85));

  for (const loc of locations) {
    const d = await details(loc.placeId);
    const g = d.result?.geometry?.location;
    if (!g) {
      console.log(`${loc.slug.padEnd(18)} (no geometry returned)`);
      continue;
    }
    const newLat = round(g.lat);
    const newLng = round(g.lng);
    // crude haversine for drift
    const R = 6371000;
    const toRad = (x: number) => (x * Math.PI) / 180;
    const dLat = toRad(newLat - loc.lat);
    const dLng = toRad(newLng - loc.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(loc.lat)) * Math.cos(toRad(newLat)) * Math.sin(dLng / 2) ** 2;
    const drift = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    const flag = drift > 100 ? "  ← BIG DRIFT" : "";
    console.log(
      `${loc.slug.padEnd(18)} ${`${loc.lat}, ${loc.lng}`.padEnd(22)}  ${`${newLat}, ${newLng}`.padEnd(22)}  ${String(drift).padStart(6)}${flag}`
    );
  }
  console.log();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

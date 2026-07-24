// Verifies the Place IDs in data/locations.ts against Google's canonical IDs.
//
// Run:
//   pnpm run verify:place-ids
//   (or)  tsx scripts/verify-place-ids.ts
//
// What it does:
//   1. Reads GOOGLE_PLACES_API_KEY from .env.local
//   2. For each office, calls Find Place From Text with the full address
//      → prints the canonical place_id Google returns today
//   3. Calls Place Details on the CURRENT (in-code) place_id
//      → confirms reviews + rating come back, surfaces stale/invalid IDs
//   4. Prints a diff: which offices need their placeId updated in locations.ts

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
  console.error("Missing GOOGLE_PLACES_API_KEY in .env.local or process env.");
  console.error("Add it and rerun. See .env.example for setup instructions.");
  process.exit(1);
}
const KEY: string = env.GOOGLE_PLACES_API_KEY;

type FindPlaceResult = {
  status: string;
  candidates?: Array<{ place_id: string; formatted_address?: string; name?: string }>;
  error_message?: string;
};

type DetailsResult = {
  status: string;
  result?: {
    name?: string;
    rating?: number;
    user_ratings_total?: number;
    formatted_address?: string;
    reviews?: Array<unknown>;
  };
  error_message?: string;
};

async function findPlace(query: string): Promise<FindPlaceResult> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
  url.searchParams.set("input", query);
  url.searchParams.set("inputtype", "textquery");
  url.searchParams.set("fields", "place_id,formatted_address,name");
  url.searchParams.set("key", KEY);
  const res = await fetch(url);
  return res.json();
}

async function placeDetails(placeId: string): Promise<DetailsResult> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "name,formatted_address,rating,user_ratings_total,reviews");
  url.searchParams.set("key", KEY);
  const res = await fetch(url);
  return res.json();
}

const pad = (s: string, n: number) => (s.length >= n ? s : s + " ".repeat(n - s.length));

async function main() {
  console.log("\nGoogle Places verification — Heart House offices\n");

  const mismatches: Array<{ slug: string; current: string; canonical: string }> = [];
  const noReviews: string[] = [];

  for (const loc of locations) {
    const fullAddress = `The Heart House ${loc.address}, ${loc.city}, NJ ${loc.zip}`;
    process.stdout.write(`${pad(loc.slug, 16)} `);

    const find = await findPlace(fullAddress);
    if (find.status !== "OK" || !find.candidates?.length) {
      console.log(`FIND FAILED — status=${find.status} ${find.error_message ?? ""}`);
      continue;
    }
    const canonical = find.candidates[0].place_id;
    const match = canonical === loc.placeId;

    const details = await placeDetails(loc.placeId);
    const ratingInfo =
      details.status === "OK" && details.result
        ? `${details.result.rating ?? "?"} ★  ${details.result.user_ratings_total ?? 0} reviews  ${
            details.result.reviews?.length ?? 0
          } shown`
        : `DETAILS FAILED status=${details.status}`;

    if (!match) mismatches.push({ slug: loc.slug, current: loc.placeId, canonical });
    if (details.status === "OK" && !details.result?.reviews?.length) noReviews.push(loc.slug);

    console.log(`${match ? "✓" : "✗"}  ${ratingInfo}`);
    if (!match) {
      console.log(`${pad("", 16)}    current   = ${loc.placeId}`);
      console.log(`${pad("", 16)}    canonical = ${canonical}`);
    }
  }

  console.log("\n─── Summary ───");
  if (mismatches.length === 0) {
    console.log("All 6 Place IDs match canonical. No code changes needed.");
  } else {
    console.log(`${mismatches.length} office(s) have non-canonical Place IDs:\n`);
    for (const m of mismatches) {
      console.log(`  ${m.slug.padEnd(16)} → "${m.canonical}"`);
    }
    console.log("\nUpdate data/locations.ts with the canonical IDs above.");
  }
  if (noReviews.length) {
    console.log(`\nOffices with zero reviews (UI will show empty state): ${noReviews.join(", ")}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

// End-to-end validation of data/locations.ts.
//
// For each of the 6 offices, cross-checks against Google Places:
//   - name contains "Heart House" (caught the chiropractor risk earlier)
//   - formatted_address matches our street/zip
//   - business_status is OPERATIONAL
//   - lat/lng within 50m of canonical
//   - Google's phone matches our phone
//   - Google's weekday hours match our 08:00–17:00
//
// For each of the 9 hospitals, runs a Text Search:
//   - confirms there's a top result with the expected name
//   - URL returns 200/30x (not dead)

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { locations, hospitals } from "../data/locations";

function loadDotEnv(path: string): Record<string, string> {
  try {
    const raw = readFileSync(path, "utf8");
    const out: Record<string, string> = {};
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      out[t.slice(0, eq)] = t.slice(eq + 1);
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

const COLOR = { ok: "\x1b[32m", warn: "\x1b[33m", err: "\x1b[31m", dim: "\x1b[2m", reset: "\x1b[0m" };
const mark = (ok: boolean | null, label: string) =>
  ok === null ? `${COLOR.dim}-${COLOR.reset} ${label}` : ok ? `${COLOR.ok}✓${COLOR.reset} ${label}` : `${COLOR.err}✗${COLOR.reset} ${label}`;

async function placeDetails(placeId: string) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "name,formatted_address,geometry,formatted_phone_number,opening_hours,business_status,types");
  url.searchParams.set("key", KEY);
  return (await fetch(url)).json();
}

async function textSearch(query: string) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  url.searchParams.set("query", query);
  url.searchParams.set("key", KEY);
  return (await fetch(url)).json();
}

function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function normalizePhone(s: string | undefined) {
  return (s ?? "").replace(/\D/g, "");
}

async function checkUrl(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return { ok: res.ok || (res.status >= 300 && res.status < 400), status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

async function validateOffices() {
  console.log(`\n${COLOR.dim}═══════ OFFICES ═══════${COLOR.reset}`);

  let allPass = true;
  for (const loc of locations) {
    const d = await placeDetails(loc.placeId);
    const r = d.result;
    if (!r) {
      console.log(`\n${COLOR.err}${loc.slug}${COLOR.reset}: Place Details failed (${d.status})`);
      allPass = false;
      continue;
    }

    const nameOk = /heart house/i.test(r.name);
    const zipOk = (r.formatted_address ?? "").includes(loc.zip);
    const streetOk = (r.formatted_address ?? "").toLowerCase().includes(loc.address.split(",")[0].toLowerCase().replace(/\./g, "").split(" ")[0]);
    const statusOk = r.business_status === "OPERATIONAL";
    const drift = haversine(loc, r.geometry.location);
    const geoOk = drift < 50;
    const phoneOk = normalizePhone(r.formatted_phone_number) === normalizePhone(loc.phone);

    const hoursWeekday = r.opening_hours?.periods?.filter((p: { open: { day: number } }) => p.open.day >= 1 && p.open.day <= 5);
    let hoursOk: boolean | null = null;
    let hoursDisplay = "(no data)";
    if (hoursWeekday?.length) {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const fmt = (t: string) => `${t.slice(0, 2)}:${t.slice(2)}`;
      hoursDisplay = hoursWeekday
        .map((p: { open: { day: number; time: string }; close?: { time: string } }) =>
          `${days[p.open.day]} ${fmt(p.open.time)}–${p.close ? fmt(p.close.time) : "24h"}`
        )
        .join(", ");
      hoursOk = hoursWeekday.every(
        (p: { open: { time: string }; close?: { time: string } }) =>
          p.open.time === "0800" && p.close?.time === "1700"
      );
    }

    const allOfficeOk = nameOk && zipOk && streetOk && statusOk && geoOk && phoneOk && hoursOk !== false;
    if (!allOfficeOk) allPass = false;

    console.log(`\n${allOfficeOk ? COLOR.ok : COLOR.err}${loc.slug}${COLOR.reset}  (${r.name})`);
    console.log(`  ${mark(nameOk, `name contains "Heart House" — got "${r.name}"`)}`);
    console.log(`  ${mark(zipOk, `zip ${loc.zip} present in formatted_address`)}`);
    console.log(`  ${mark(streetOk, `street prefix matches — got "${r.formatted_address}"`)}`);
    console.log(`  ${mark(statusOk, `business_status: ${r.business_status}`)}`);
    console.log(`  ${mark(geoOk, `lat/lng drift ${Math.round(drift)}m (threshold 50m)`)}`);
    console.log(`  ${mark(phoneOk, `phone: ours="${loc.phone}" google="${r.formatted_phone_number ?? "(none)"}"`)}`);
    console.log(`  ${mark(hoursOk, `weekday hours match 08:00–17:00`)}`);
    console.log(`     google says: ${hoursDisplay}`);
  }

  return allPass;
}

async function validateHospitals() {
  console.log(`\n\n${COLOR.dim}═══════ HOSPITAL AFFILIATIONS ═══════${COLOR.reset}`);

  let allPass = true;
  for (const h of hospitals) {
    const s = await textSearch(h.name);
    const top = s.results?.[0];
    const googleNameOk = !!top && top.name.toLowerCase().includes(h.name.toLowerCase().split(" ")[0]);
    const urlCheck = await checkUrl(h.url);

    const ok = googleNameOk && urlCheck.ok;
    if (!ok) allPass = false;

    console.log(`\n${ok ? COLOR.ok : COLOR.warn}${h.name}${COLOR.reset}  (${h.system})`);
    console.log(`  ${mark(googleNameOk, `Google finds it — top match: "${top?.name ?? "(none)"}"`)}`);
    if (top) console.log(`     address: ${top.formatted_address}`);
    console.log(`  ${mark(urlCheck.ok, `URL live (HTTP ${urlCheck.status}) — ${h.url}`)}`);
  }

  return allPass;
}

async function main() {
  const officesOk = await validateOffices();
  const hospitalsOk = await validateHospitals();

  console.log(`\n${COLOR.dim}═══════ SUMMARY ═══════${COLOR.reset}`);
  console.log(`Offices:    ${officesOk ? COLOR.ok + "all pass" : COLOR.err + "issues above"}${COLOR.reset}`);
  console.log(`Hospitals:  ${hospitalsOk ? COLOR.ok + "all pass" : COLOR.warn + "issues above"}${COLOR.reset}`);
  process.exit(officesOk && hospitalsOk ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

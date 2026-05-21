// One-shot merge: data/providers.ts (hand-curated) + data/providers-scraped.json
// (real bios/photos) → new data/providers.ts. Hand-curated fields preserved.

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { providers as current, type Provider } from "../data/providers";

type Scraped = {
  slug: string;
  photoLocalPath: string;
  bio: string;
  education: string[];
  languages: string[];
  warnings: string[];
};

const scraped: Scraped[] = JSON.parse(
  readFileSync(join(process.cwd(), "data", "providers-scraped.json"), "utf8")
);
const bySlug = new Map(scraped.map((s) => [s.slug, s]));

function emitProvider(p: Provider): string {
  const s = bySlug.get(p.slug);
  const photoUrl = s?.photoLocalPath || p.photoUrl;
  const bio = s?.bio?.trim() || p.bio || "";
  const education = s && s.education.length ? s.education : p.education || [];
  const languages = s && s.languages.length ? s.languages : p.languages || [];

  const parts: string[] = [
    `slug: ${JSON.stringify(p.slug)}`,
    `name: ${JSON.stringify(p.name)}`,
    `credentials: ${JSON.stringify(p.credentials)}`,
    `gender: ${JSON.stringify(p.gender)}`,
    `subspecialties: ${JSON.stringify(p.subspecialties)}`,
    `locations: ${JSON.stringify(p.locations)}`,
    `acceptingNew: ${p.acceptingNew}`,
    `profileUrl: ${JSON.stringify(p.profileUrl)}`,
    `photoUrl: ${JSON.stringify(photoUrl)}`
  ];
  if (bio) parts.push(`bio: ${JSON.stringify(bio)}`);
  if (p.bioEs) parts.push(`bioEs: ${JSON.stringify(p.bioEs)}`);
  if (education.length) parts.push(`education: ${JSON.stringify(education)}`);
  if (languages.length) parts.push(`languages: ${JSON.stringify(languages)}`);
  if (typeof p.rater8Score === "number") parts.push(`rater8Score: ${p.rater8Score}`);
  if (typeof p.rater8Count === "number") parts.push(`rater8Count: ${p.rater8Count}`);

  return `  { ${parts.join(", ")} }`;
}

const header = readFileSync(join(process.cwd(), "data", "providers.ts"), "utf8")
  .split("export const providers: Provider[] = [")[0];

const body = current.map(emitProvider).join(",\n");

const out = `${header}export const providers: Provider[] = [\n${body}\n];\n`;

writeFileSync(join(process.cwd(), "data", "providers.ts"), out);
console.log(`[INFO] merged ${current.length} providers`);

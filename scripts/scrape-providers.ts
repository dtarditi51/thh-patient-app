// Scrapes provider photos, full bios, education, and languages from
// hearthousenj.com individual profile pages. Run weekly to keep bios fresh.
//
// Usage: pnpm run scrape:providers
// Outputs: data/providers-scraped.json plus public/providers/{slug}.jpg

import * as cheerio from "cheerio";
import { writeFileSync } from "fs";
import { join } from "path";
import { providers } from "../data/providers";
import sharp from "sharp";

type ScrapedProvider = {
  slug: string;
  profileUrl: string;
  photoLocalPath: string;
  photoSourceUrl: string;
  bio: string;
  education: string[];
  languages: string[];
  warnings: string[];
};

function clean(s: string): string {
  return s.replace(/\s+/g, " ").replace(/ /g, " ").trim();
}

async function scrapeOne(profileUrl: string, slug: string): Promise<ScrapedProvider> {
  const result: ScrapedProvider = {
    slug,
    profileUrl,
    photoLocalPath: "",
    photoSourceUrl: "",
    bio: "",
    education: [],
    languages: [],
    warnings: []
  };

  let html: string;
  try {
    const res = await fetch(profileUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; THH-scraper/1.0)" }
    });
    if (!res.ok) {
      result.warnings.push(`HTTP ${res.status}`);
      return result;
    }
    html = await res.text();
  } catch (err: any) {
    result.warnings.push(`fetch failed: ${err?.message || err}`);
    return result;
  }

  const $ = cheerio.load(html);

  // Photo: og:image is the reliable HubSpot headshot
  const ogImage = $('meta[property="og:image"]').attr("content") || "";
  if (ogImage && /hubfs\/THH\//i.test(ogImage)) {
    result.photoSourceUrl = ogImage;
  } else if (ogImage) {
    result.photoSourceUrl = ogImage;
    result.warnings.push(`og:image not in /hubfs/THH/ path — verify`);
  } else {
    result.warnings.push("no og:image meta tag");
  }

  // Bio: h3.title "My Biography" → collect every .bio_content_mbl child
  const bioPieces: string[] = [];
  $('h3.title').each((_, el) => {
    const heading = clean($(el).text()).toLowerCase();
    if (heading.includes("biography") || heading.includes("about")) {
      $(el)
        .nextAll()
        .find(".bio_content_mbl")
        .each((_, p) => {
          const t = clean($(p).text());
          if (t) bioPieces.push(t);
        });
    }
  });
  result.bio = bioPieces.join("\n\n").slice(0, 3000);
  if (!result.bio) result.warnings.push("bio empty");

  // Education: h3.title "Education..." → each .item is {h4: label, ul/li: entries}
  $('h3.title').each((_, el) => {
    const heading = clean($(el).text()).toLowerCase();
    if (heading.includes("education")) {
      $(el)
        .nextAll()
        .find(".item")
        .each((_, item) => {
          const label = clean($(item).find("h4").first().text());
          $(item)
            .find("li")
            .each((_, li) => {
              const entry = clean($(li).text());
              if (!entry) return;
              result.education.push(label ? `${label}: ${entry}` : entry);
            });
        });
    }
  });
  if (result.education.length === 0) result.warnings.push("education empty");

  // Languages: rarely present on these pages, scan as a courtesy
  $('h3.title, h4').each((_, el) => {
    const heading = clean($(el).text()).toLowerCase();
    if (heading === "languages" || heading === "language") {
      $(el)
        .nextAll()
        .first()
        .find("li")
        .each((_, li) => {
          const lang = clean($(li).text());
          if (lang) result.languages.push(lang);
        });
    }
  });

  // Photo download → 400x400 JPEG
  if (result.photoSourceUrl) {
    try {
      const imgRes = await fetch(result.photoSourceUrl);
      if (!imgRes.ok) {
        result.warnings.push(`photo HTTP ${imgRes.status}`);
      } else {
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        const outPath = join(process.cwd(), "public", "providers", `${slug}.jpg`);
        await sharp(buffer)
          .resize(400, 400, { fit: "cover", position: "top" })
          .jpeg({ quality: 85 })
          .toFile(outPath);
        result.photoLocalPath = `/providers/${slug}.jpg`;
      }
    } catch (err: any) {
      result.warnings.push(`photo write failed: ${err?.message || err}`);
    }
  }

  return result;
}

async function main() {
  console.log(`[INFO] scraping ${providers.length} providers from hearthousenj.com\n`);
  const results: ScrapedProvider[] = [];
  let okCount = 0;
  let failCount = 0;
  for (const p of providers) {
    const data = await scrapeOne(p.profileUrl, p.slug);
    results.push(data);
    const hasBio = data.bio.length > 0;
    const hasPhoto = data.photoLocalPath.length > 0;
    const hasEdu = data.education.length > 0;
    const status = hasBio && hasPhoto ? "OK " : "WARN";
    if (status === "OK ") okCount++;
    else failCount++;
    const w = data.warnings.length ? ` | ${data.warnings.join("; ")}` : "";
    console.log(
      `[${status}] ${p.slug.padEnd(38)} photo=${hasPhoto ? "y" : "n"} bio=${hasBio ? `${data.bio.length}c` : "n"} edu=${data.education.length}${w}`
    );
    await new Promise((r) => setTimeout(r, 800));
  }
  const outPath = join(process.cwd(), "data", "providers-scraped.json");
  writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\n[INFO] wrote ${results.length} records → ${outPath}`);
  console.log(`[INFO] ok=${okCount} warn=${failCount}`);
}

main();

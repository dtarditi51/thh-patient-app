import type { MetadataRoute } from "next";
import { providers } from "@/data/providers";
import { locations } from "@/data/locations";
import { educationTopics } from "@/data/education";
import { procedures } from "@/data/procedures";
import { SITE_URL } from "@/lib/seo";

// English only during the pilot. Spanish routes exist and render, but every ES
// string is machine translation pending medical-translator review, so they are
// noindex'd in app/[locale]/layout.tsx and excluded here. When Spanish launches,
// flip SHOW_LANGUAGE_TOGGLE in lib/launchFlags.ts and map over INDEXABLE_LOCALES.

export const dynamic = "force-static";

type Entry = MetadataRoute.Sitemap[number];

function entry(path: string, priority: number, changeFrequency: Entry["changeFrequency"]): Entry {
  return {
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: new Date("2026-07-30"),
    changeFrequency,
    priority
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry("/", 1.0, "weekly"),
    entry("/doctors", 0.9, "weekly"),
    entry("/locations", 0.9, "monthly"),
    entry("/appointment", 0.9, "monthly"),
    entry("/education", 0.8, "monthly"),
    entry("/procedures", 0.8, "monthly"),
    entry("/about", 0.6, "monthly"),
    entry("/portal", 0.5, "monthly"),
    // Low priority but must be indexable — a nondiscrimination notice that
    // search engines can't reach isn't much of a public notice.
    entry("/nondiscrimination", 0.3, "yearly"),
    entry("/accessibility", 0.3, "yearly"),

    // Detail pages. Providers and offices are the pages that win local search,
    // so they sit above the index pages they hang off.
    ...locations.map((l) => entry(`/locations/${l.slug}`, 0.9, "monthly")),
    ...providers.map((p) => entry(`/doctors/${p.slug}`, 0.8, "monthly")),
    ...educationTopics.map((t) => entry(`/education/${t.slug}`, 0.7, "monthly")),
    ...procedures.map((p) => entry(`/procedures/${p.slug}`, 0.7, "monthly"))
  ];
}

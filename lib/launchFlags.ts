// Launch gating for the pilot rollout.
//
// Spanish is fully built (/es routes render, precache, and the offline shell
// hops to them) but every ES string is machine translation pending medical
// -translator review, and no provider has a bioEs. Until that review lands we
// keep the routes alive and reachable-by-URL but hide the toggle and tell
// search engines not to index them.
//
// To launch Spanish: flip this to true and drop the noindex branch in
// app/[locale]/layout.tsx generateMetadata. Nothing else needs to change.
export const SHOW_LANGUAGE_TOGGLE = false;

// Locales that belong in sitemap.xml and are indexable.
export const INDEXABLE_LOCALES = ["en"] as const;

export function isIndexableLocale(locale: string) {
  return (INDEXABLE_LOCALES as readonly string[]).includes(locale);
}

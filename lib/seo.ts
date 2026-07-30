// Canonical site identity. Single source for metadata, sitemap, robots, and
// JSON-LD so they can't drift apart.
//
// hearthousenj.app is the canonical domain (Vercel-provisioned, .app TLD
// enforces HTTPS). thh-patient-app.vercel.app is the underlying deploy URL and
// must never appear in canonical URLs, OG tags, sitemaps, or QR codes.
export const SITE_URL = "https://hearthousenj.app";

export const SITE_NAME = "The Heart House and Vascular Care";

export const SITE_DESCRIPTION =
  "Premier cardiology care in southern New Jersey. 34 cardiologists, 6 offices, same-day appointments.";

export const PRACTICE_WEBSITE = "https://www.hearthousenj.com";

// Google Search Console ownership token for hearthousenj.app.
//
// Paste the value from GSC's "HTML tag" verification method here — just the
// content string, not the whole <meta> tag. Then redeploy and click Verify.
// Empty means no verification tag is emitted at all.
//
// Not an env var on purpose: this token is public by design (it ships in the
// page HTML), and this project's Vercel CLI has a known bug adding Preview env
// vars, so a committed constant is the lower-friction path here.
//
// NOTE: hearthousenj.app is a separate GSC property from hearthousenj.com.
// Whatever verification the practice already has for the main site does not
// carry over to this domain.
export const GOOGLE_SITE_VERIFICATION = "K5-DKl8WLVaUgyOTFJtQ_ZmrFP_-UAHRTqqGGWXe9HY";

/** Absolute URL for a locale-prefixed path, matching localePrefix "as-needed". */
export function absoluteUrl(locale: string, path: string) {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${clean}` || SITE_URL;
}

/** Trim to a clean meta-description length without cutting mid-word. */
export function truncateDescription(text: string, max = 155) {
  const collapsed = text.replace(/\s+/g, " ").trim();
  if (collapsed.length <= max) return collapsed;
  const cut = collapsed.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./i18n";

// Single source of truth for locale routing. Consumed by middleware.ts and by
// navigation.ts, so the middleware's URL rewriting and the app's <Link> hrefs can
// never disagree.
//
// localePrefix "as-needed" means English paths are unprefixed: /doctors, not
// /en/doctors. Hand-building hrefs as `/${locale}/...` is what broke the bottom
// nav's active state — the middleware 307'd /en/doctors to /doctors, so
// usePathname() never matched the href. Always route through navigation.ts.
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed"
});

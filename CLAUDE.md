# CLAUDE.md — Heart House Patient App Project Memory

> This file gives Claude (and any future collaborator) the full context for the Heart House patient app project in one read. Drop this into the project root of the GitHub repo. Claude reads it automatically at the start of every conversation when working in the repo. Update it as decisions evolve.

## Who and what

**Practice**: The Heart House and Vascular Care, southern New Jersey. 34 board-certified cardiologists, 10+ advanced practitioners, 6 offices, 9 hospital affiliations. Main line 856-546-3003. Website hearthousenj.com. Member of CVA USA.

**Owner of this project**: Daniel Tarditi, DO, FACC. Partner, COO, and one of the practicing cardiologists. Lives in Haddonfield, NJ.

**The build**: a mobile-responsive web app (PWA) for patients. Marketing + education + light portal passthrough. Not a replacement for the EHR or patient portal, a friendlier front door to them.

**Why now**: the practice transitioned to NextGen Healthcare EHR with Luma Health as the new patient portal (launched May 4, 2026). Good moment to give patients a vibrant, intuitive, branded experience that surfaces the practice's strengths (NPS 92, only PET imaging in S. NJ, same-day appointments) and educates them about heart health.

## Inspiration and design direction

User named three apps as reference:
- **Chick-fil-A**: bottom-tab navigation, clean card-based home screen, quick-action tiles, friendly tone
- **Uber**: map-first locations view, simple "select → confirm" flows
- **MyChart / Epic** (originally): portal feel. Dropped this in favor of Luma Health since practice moved off Epic.

Visual direction: vibrant but clinical. Heart House red `#C8102E` as primary accent on white. Generous whitespace. Large tap targets. Mobile-first, desktop secondary.

## Decisions locked in

| Decision | Choice | Date |
|---|---|---|
| Platform | Web app (mobile-responsive, PWA) | Week 1 |
| Audience | Patient-facing + appointment/portal links | Week 1 |
| Primary goal | Patient education + brand marketing + reduce call volume (roughly equal weight) | Week 1 |
| Build approach | Mockup first, then production scaffold | Week 1 |
| Stack | Next.js 14 (App Router) + Tailwind + shadcn-style primitives | Week 1 |
| Host | Vercel (Next.js native, image optimization, edge routes) | Week 1 |
| Source control | GitHub | Week 1 |
| i18n | English + Spanish via next-intl, `/en/...` and `/es/...` routes | Week 1 |
| Portal | Luma Health only. MyChart dropped (no longer relevant post-NextGen transition) | Week 1 |
| Auth | Anonymous browsing for marketing pages, passthrough to Luma for portal | Week 1 |
| CardioSmart UX | Hybrid: practice-written summary + when-to-call + questions + linkout to acc.org/cardiosmart. Never reproduce ACC content verbatim. | Week 1 |
| Reviews layering | NPS 92 badge on home + Rater8 testimonials on every provider page + Google Places reviews per office (with full attribution + G logo per Places API terms) + optional aggregate Rater8 score on About | Week 1 |
| Push notifications | Web Push + Firebase Cloud Messaging. Opt-in surfaced on Portal page, never modal-on-load. | Week 1 |
| Provider photos | Scraped weekly from hearthousenj.com profile pages via `pnpm run scrape:providers`, resized to 400×400 JPEG | Week 1 |
| Data layer (v1) | Static JSON / TS files committed to repo. Migrate to Sanity or Contentful only when non-developers need to edit bios. | Week 1 |
| Spanish translations | Machine translation as starting point. Medical Spanish translator review required before production launch. | Week 1 |
| Rater8 integration | Public-page scrape via `lib/rater8.ts` (cheerio + schema.org microdata) with 6h cache. Skipped the vendor CSM contract to avoid blocking on it. Allowlist of 32 Heart House provider profile paths in `data/rater8.ts` keeps Shore Heart Group reviews (same CVA USA listing) from leaking in. | 2026-05-24 |
| Canonical domain | `hearthousenj.app` (Vercel-provisioned, auto-SSL on the `.app` TLD). QR codes, OG share urls, sitemap, and printed materials use this. `thh-patient-app.vercel.app` stays as the underlying deploy URL only. `metadataBase` set in `app/[locale]/layout.tsx`. | 2026-05-25 |
| Provider directory taxonomy | 7-category taxonomy: `clinical`, `interventional`, `ep`, `peripheralVascular`, `veins`, `hf`, `structural` (`imaging` removed 2026-05-25; `vascular` split into `peripheralVascular` + `veins` 2026-05-25). **Rule for doctors**: single major bucket (clinical OR interventional OR EP) + any sub-specialty tags. Interventional/EP doctors do NOT carry `clinical`. **Rule for APNs**: always `clinical` + their specialty tag(s). Per-bucket assignments: interventional = Giri, Kaddissi, Levine, Ogbara, Rafeq, Rheam, Verma, Zinn (Tarditi moved to clinical 2026-05-25; Cohen and Fertels stay clinical despite interventional boards); EP = Costello, DaTorre, Levi, Alex Smith (+ APNs Galzerano, Tyler, Whitby); peripheral vascular = Levine, Rafeq, Rheam, Verma, Zinn; veins = Gips, Levine, Rheam, Verma, Zinn (+ APNs Baran, Delcollo); HF = Mohapatra (+ APN Salvatore); structural = Kaddissi, Ogbara, Verma. Operational CSV uses GEN/INT/EP for scheduling; not patient labels. Locations from CSV `Office_*` columns; `HH3`, `TESTDR`, `HAMMONTON` ignored. `SVI` = Vineland. | 2026-05-25 |
| Directory render order | Within every filter on `/doctors`, physicians render first (alphabetical by surname), then a small "Advanced practice nurses" subheader, then APNs (also alphabetical by surname). Implemented in `app/[locale]/(shell)/doctors/page.tsx` via `sortByLastName` + credentials-based split. `doctors.count` label switched from "cardiologists"/"cardiólogos" to "providers"/"proveedores". | 2026-05-25 |
| Directory includes APNs | 10 office-based APNs in `data/providers.ts`: Salvatore, Galzerano, Del Collo, Tyler, Whitby, Coringrato, Baran, Knights, Rai, Clarke. Hospital-only APN Shamani Ballard excluded. Nelene Crasner excluded — retiring (per Dr. Tarditi 2026-05-25) even though still listed on the practice site. Names/credentials/slugs/profileUrl mirror hearthousenj.com/advanced-practitioners (so Audrey Delcollo → Del Collo, Vickie Clark → Victoria Clarke, Katie → Katherine, Nick → Nicholas, Jackie → Jacqlyn; credentials match formal site versions like ACNPC-AG, MSN AGACNP-BC, DNP APN AGPCNP-BC). Photos reference remote hearthousenj.com URLs (allowlisted in `next.config.js`). Knights and Rai have no portrait on the practice site — initials fallback renders. Full bios pending — follow-up scrape needed. | 2026-05-25 |
| Test prep page | New `/procedures` route with 3 cards (Nuclear Stress, PET/CT, MUGA). Prep content re-authored in-app (`data/procedures.ts`) for seamless reading; PDFs from hearthousenj.com link out as printable backup. Home page tile sits in Quick Actions. EN copy is patient-final; ES is machine-translation placeholder pending medical-translator review. If the practice updates a PDF, update `data/procedures.ts` in the same release — file is now the patient-facing source of truth. | 2026-05-25 |
| Locale-aware navigation | **All internal links go through `navigation.ts`** (`createNavigation(routing)` from next-intl), never `next/link`, and hrefs are written WITHOUT a locale prefix (`/doctors`, not `` `/${locale}/doctors` ``). Routing config is centralized in `routing.ts` and shared by `middleware.ts`. Fixed a live production bug: `localePrefix: "as-needed"` 307'd `/en/doctors` → `/doctors`, so `usePathname()` never matched the hand-built `/en/...` hrefs and **no bottom-nav tab highlighted for English users on any page except home**. Also cost a redirect round-trip per navigation. | 2026-07-30 |
| Analytics | Vercel Analytics, wrapped behind `lib/analytics.ts`. **Never import `track` from `@vercel/analytics` directly** — every call site imports from the wrapper so a vendor swap is a one-file change. Custom events cover intent that LEAVES the app (`appointment_handoff_click`, `tel_tap`, `portal_signin_click`, `directions_click`, `forms_click`, `paybill_click`, `push_optin`, `pwa_install_accepted`); page views are automatic, so no `*_view` events. `appointment_handoff_click` vs `tel_tap` is the call-deflection ratio. Swap to Plausible when (a) an in-app appointment form ships, or (b) the practice needs a shareable dashboard. | 2026-07-30 |
| EN-only pilot launch | Spanish routes still build, precache, and render, but the header toggle is hidden and `/es` is `noindex` + `Disallow`-ed. Gated by `SHOW_LANGUAGE_TOGGLE` / `INDEXABLE_LOCALES` in `lib/launchFlags.ts`. To launch Spanish: flip the flag, add `es` to `INDEXABLE_LOCALES`, and drop the noindex branch in `app/[locale]/layout.tsx`. Nothing else changes. | 2026-07-30 |
| SEO surface | `generateMetadata` on every route (client-component routes `/doctors` and `/portal` use pass-through segment `layout.tsx` files, and must set `title` in OBJECT form so the root title template propagates to `[slug]` children). `app/sitemap.ts` (EN only, 69 URLs), `app/robots.ts`, `app/opengraph-image.tsx`. JSON-LD via `lib/structuredData.ts` + `components/JsonLd.tsx`: `MedicalOrganization` on home/about, `MedicalClinic` per office, `Physician` per provider, `BreadcrumbList` on detail pages. **`opengraph-image` must stay excluded in the `middleware.ts` matcher** — it has no file extension, so the default matcher swallows it and the OG card 404s silently. | 2026-07-30 |

| Legal / compliance footer | `components/layout/Footer.tsx` renders on every `(shell)` route: emergency-call-911 note, the five policy links on hearthousenj.com (privacy, HIPAA, NPP EN + ES, terms — all verified 200), `/nondiscrimination`, `/accessibility`, main line + TTY 711, the short Section 1557 nondiscrimination statement, a notice of availability of free language assistance, and a not-medical-advice disclaimer. Policy documents are **linked, never duplicated** — the practice's counsel maintains the canonical versions. | 2026-07-30 |
| 1557 items deliberately NOT published | Two pieces of the Section 1557 notice are built but withheld rather than faked. (1) **No named Civil Rights Coordinator** — grievances route to the main office line; restore the named contact block on `/nondiscrimination` once the practice designates someone (TODO in `lib/practiceInfo.ts`). (2) **The 15 NJ language taglines are not rendered** — the data and the `TaglineText` component live in `data/legal.ts` / `components/legal/TaglineText.tsx` awaiting a compliance diff against HHS's official published translations. **When restoring taglines, render them through `TaglineText`** — it wraps the phone in `<bdi>` so the Unicode bidi algorithm doesn't scramble `(856) 546-3003` into `3003-546 (856)` inside the Arabic and Urdu lines. That bug was found via screenshot and fixed 2026-07-30. | 2026-07-30 |

## Open questions still to answer

- ~~**Domain**: `app.hearthousenj.com` or `my.hearthousenj.com`? IT must add CNAME to Vercel.~~ **Resolved 2026-05-25** — went with `hearthousenj.app` (Vercel-provisioned, `.app` TLD enforces HTTPS at the browser level, auto SSL). `metadataBase` set in `app/[locale]/layout.tsx`. Use this for QR codes, OG urls, printed materials. Deploy URL `thh-patient-app.vercel.app` stays as the underlying.
- **GitHub org**: under `hearthousenj` org, Tarditi personal account, or new org? Determines who has admin.
- ~~**Rater8 integration shape**~~ **Resolved 2026-05-24** by shipping a public-page scraper (`lib/rater8.ts`) so we didn't wait on the vendor CSM. Revisit if (a) the vendor offers a free/cheap API that gives full review bodies instead of the truncated SSR'd snippets, (b) Rater8 changes their HTML and breaks our microdata selectors, or (c) we want to surface aggregate Rater8 score on home/About without scraping the listing page (`/specialty/cardiology/new-jersey/cvausa-1810` would need a separate parse).
- ~~**Google Place IDs**: need to be fetched once for all 6 offices and pasted into env.~~ **Done 2026-05-24.** All 6 canonical IDs verified via `pnpm run verify:place-ids`. Practice combined: ~3,700 Google reviews averaging 4.85★ (Sewell 1064, Haddon Heights 930, Marlton 599, Vineland 490, Elmer 478, Woodbury 176). Worth surfacing on About / home.
- ~~**Subspecialty assignments**: I inferred from credentials and profile content; the practice should verify each of the 34 providers' subspecialties against internal records before launch.~~ **Reconciled 2026-05-25** against the practice's operational scheduling CSV (`provider details.csv` at repo root). 9 subspecialty fixes applied: Costello/Levi/DaTorre/Alex Smith → `["ep","clinical"]`; Giri/Ogbara/Zinn/Verma → `["interventional","clinical"]`; Pavlides → `["clinical"]`. 30 of 33 directory rows had location drift vs the CSV; all corrected. CSV's `HH3`, `TESTDR`, `HAMMONTON` columns ignored. `SVI` = Vineland. Baptist (vineland part-time) stays as-is. Jetmir Vojnika, MD (EP) starts August — add at that time. Gelernt's bio updated 2026-05-25 to say "former Medical Staff President for Inspira Healthcare" (was stale "second term" claim).
- **Map provider**: Mapbox ($0 free tier sufficient for our traffic) vs Google Maps ($200/mo free credit, more familiar). Defer to week 4.
- **Spanish bios**: who translates? Hire a medical Spanish translator (one-time, ~$500-1000 for 34 bios) or use a service like Stepes.
- **Spanish UI strings pending medical-translator review** (machine-translation placeholders): `reviews.homepageHeading`, `reviews.homepageSubhead`, `reviews.seeAllAtMarlton`, the entire `about`, `appointment`, `pwa`, and (added 2026-05-25) `procedures` namespaces — including all `prepEs` / `summaryEs` / `titleEs` / `durationEs` strings inside `data/procedures.ts` for the three test-prep entries (Nuclear Stress, PET/CT, MUGA). Also `locations.needDirections` / `locationDetail.needDirections` ("¿Necesita indicaciones?", added 2026-07-24) plus `locationDetail.weekdayRange` / `weekendClosed` / `backToList` / `reviewsSummarySeeAll` / `reviewsSummaryCount` plus `about.stats.reviewsCalloutTitle` / `reviewsCalloutBody` plus `doctors.count` / `apnsHeading` / `noResults` plus `subspecialtyLabels.peripheralVascular.es` ("Vascular periférico") / `subspecialtyLabels.veins.es` ("Venas") in `data/providers.ts`. Bundle into the Week 3 medical-Spanish pass.
- **PWA brand assets** (2026-05-23): app icons (`public/icon-*.png`, `public/apple-icon-180.png`, `public/icon-maskable.png`) are placeholder "HH" wordmarks generated by `scripts/generate-icons.ts`. Replace with a real brand mark when design lands. Re-run `tsx scripts/generate-icons.ts` after swapping the SVG source. Also confirm: (a) `theme_color: "#C8102E"` and `background_color: "#F7F7F5"` match the publish-ready palette in `app/manifest.ts`; (b) `short_name: "Heart House"` (12 chars) reads correctly on Android home screens.
- **Appointment-page copy confirmations** (2026-05-23): (a) confirm the appointment-line phone is the main `856-546-3003` and not a separate scheduling line; (b) confirm main-line hours match the office hours used in `PRACTICE_HOURS_DISPLAY` (currently "Monday through Friday, 8am to 5pm"); (c) confirm `APPOINTMENT_CONFIRMATION_WINDOW` wording ("within one business day") matches what the practice tells callers; (d) the `{hours}` placeholder in the appointment i18n strings interpolates the English constant value into both EN and ES — Spanish UX shows English hours until the constant is split per locale or the hours are localized into the i18n string directly.
- ~~**Analytics platform for handoff CTAs**~~ **Resolved 2026-07-30** — Vercel Analytics, wrapped in `lib/analytics.ts`. See the Decisions table. Remaining check: confirm the Vercel **Hobby** tier's custom-event cap and data retention actually cover the app's traffic before relying on the numbers; Hobby is limited and this is the instrument the whole ship-and-learn plan rests on.
- **Handoff vs in-app picker**: appointment page currently is a thin handoff to `https://www.hearthousenj.com/request-an-appointment`. Revisit after capturing handoff conversion + call-volume data — decide whether to (i) keep the handoff, (ii) embed Luma deep links once Luma exposes provider/location params, or (iii) build the in-app picker that was removed in this pass.
- **Aggregate Rater8 score on home/About**: per-provider scores now live (e.g. Tarditi 5.0★/712, Pavlides 5.0★/546, Sambucci 4.9★/1K, DaTorre 5.0★/1K). Decide whether to surface a practice-wide aggregate alongside the existing 4.85★/~3,700 Google number on About. The Rater8 listing page exposes per-provider scores; a practice-wide aggregate would need either a separate parse of `/specialty/cardiology/new-jersey/cvausa-1810` (with the same Heart-House-only allowlist) or a hardcoded summary refreshed periodically. Practice-wide Rater8 + practice-wide Google together is a strong dual-source social proof block.
- **About page TODOs**: replace gradient hero on `/about` with a real photo collage of offices or team. Resolved 2026-05-24: story now anchored at 1979 (milestones intentionally skipped); per-hospital affiliation type deferred (generic subhead stays); leadership stays as Giri (Managing Partner) + Tarditi only (Gelernt intentionally not surfaced — his scraped bio's "second term as Inspira Medical Staff President" claim is stale, and we're not putting him on About with that wording).
- **Provider directory now mixes 33 cardiologists + 10 office-based APNs** (updated 2026-05-25): Harvey Snyder retired 2026 and remains excluded from `data/providers.ts`. The "34 cardiologists" home-page trust badge counts physicians (incl. Snyder) and does NOT track `providers.length`; the directory `count` string was renamed from "cardiologists" to "providers" / "proveedores" to reflect the mixed list. Hospital-only APN Shamani Ballard excluded. APNs land in the "Clinical cardiology" filter only, except Amanda Salvatore who also gets `hf` per Dr. Tarditi's direction. APN profileUrl/photoUrl/bio left blank — `ProviderCard` renders initials fallback. Jetmir Vojnika, MD (EP) starts August — add then.
- **Google Business Profile drift on all 6 offices** (confirmed 2026-05-24 via `pnpm run validate:locations`): (a) every office's GBP shows **9am-5pm** weekdays; practice actually opens at **8am**. Update GBP hours on all 6 listings. (b) Woodbury GBP shows the main line `856-546-3003`; the actual office line is `856-582-2000` (shared with Sewell, which is operationally one office). Update Woodbury's GBP phone. (c) The previous hand-entered lat/lng in `data/locations.ts` was wrong by 800m to 6.6km on every office — fixed by running the canonical lookup, but the original geo source (whoever pulled those coordinates) is suspect. Don't trust hand-entered coordinates anywhere else without a `validate:locations` pass. App data is correct; GBP is what's wrong.
- **Stale leadership claims in scraped bios on hearthousenj.com** (confirmed 2026-05-23): (a) ~~Rosenberg's profile still says "Chief of Cardiology for Jefferson Health NJ"~~ **Gone from the patient-facing app as of 2026-07-30** — `data/providers.ts` (the file that actually renders) is clean and that IS committed. Note `data/providers-scraped.json` is gitignored and regenerated by the scraper, so scrubbing it locally is temporary: **the next `scrape:providers` + `merge-scraped` run WILL pull the stale claim back in unless hearthousenj.com is fixed at the source first.** Fix the source page, then re-scrape. That role is now Tarditi's; (b) Gelernt's profile says he's "in his second term as Medical Staff President for Inspira Healthcare" — Gelernt and Zinn are both former Inspira Medical Staff Presidents (Zinn most recently 2022-2024); neither currently serves. The scraped `bio` field carries these stale claims. Fix the source pages on hearthousenj.com, then re-run `pnpm run scrape:providers` + `tsx scripts/merge-scraped.ts`.

## On the horizon

- ~~**iOS Safari install variant**~~ **Shipped 2026-05-24**: `components/InstallPrompt.tsx` detects iOS Safari (excluding Chrome iOS + in-app webviews) and renders a "Tap Share → Add to Home Screen" variant with the Share icon and shared snooze/dismiss flow. Strings in `pwa.install.iosTitle` / `iosBody` / `iosGotIt`.
- ~~**Per-locale offline shell**: `next.config.js` falls back all unmatched routes to `/en/offline`.~~ **Shipped 2026-05-25**: `components/offline/OfflineLocaleRedirect.tsx` reads the `NEXT_LOCALE` cookie (then `navigator.language`) on mount and hops to `/es/offline` when a Spanish user lands on the English fallback. Both locales prerender via the parent layout's `generateStaticParams` and live in the precache, so the redirect resolves offline. `fallbacks.document` stays `/en/offline` because next-pwa@5 only accepts one string.
- ~~**Push notifications (FCM + Web Push)** on the portal page~~ **Wired 2026-05-25**: client uses `firebase/messaging` `getToken()` (via `lib/firebaseClient.ts`) with a scoped service worker at `/firebase-messaging-sw.js` (scope `/firebase-cloud-messaging-push-scope`) to avoid colliding with the next-pwa SW. `/api/subscribe` POST stores `{ token, locale }` in Upstash Redis (`HSET fcm:subscriptions <token> <json-metadata>`) and DELETE removes. Smoke-tested live (returns `{ok:true}`). Remaining: build the send-side endpoint (`firebase-admin` `messaging().sendEachForMulticast()` with `HGETALL fcm:subscriptions`), localize the notification copy in Spanish, and decide what events trigger pushes (appointment reminders, results-ready). All env vars and infra ready.
- **Vercel production deploy** (live 2026-05-24, custom domain `hearthousenj.app` provisioned 2026-05-25): https://hearthousenj.app (canonical, use for QR / OG / printed materials) ⟶ underlying deploy at https://thh-patient-app.vercel.app. Project is `drdanieltarditi-4799s-projects/thh-patient-app`, currently personal-account scope (Hobby). No GitHub connection — deploys are CLI direct via `npx vercel --prod`. All Google API keys live in Production env vars only (Preview env empty due to Vercel CLI v54.4.1 bug where `--yes`/`--git-branch` don't bypass the Preview branch prompt). Use `--prod` for every deploy until project moves to Pro or v54 ships a fix. Deployment Protection is on by default; preview URLs require Vercel SSO, production URL is public.
- **PWA library swap revisit**: kept `next-pwa@5.6` (already installed and configured) instead of switching to `@ducanh2912/next-pwa`. Revisit if next-pwa stops accepting App Router builds on a Next.js upgrade.

## Stack details

```
Next.js 14.2          App Router, RSC, static generation
Tailwind 3.4          custom theme: thh-red #C8102E, thh-line, thh-surface
next-intl 3.26        EN + ES, locale in URL path
next-pwa 5.6          installable, offline shell
Lucide React          icons (no emoji, no inline SVG paths)
Firebase 11           FCM for push
Sharp 0.33            provider photo resize
Cheerio 1.0           profile page scraping
```

Repo structure:
```
app/
  [locale]/
    (shell)/                 shared layout: header + bottom nav
      page.tsx               home
      doctors/page.tsx       34-provider grid
      doctors/[slug]/page.tsx
      locations/page.tsx     6 offices + hospitals
      education/page.tsx     CardioSmart topic grid
      education/[slug]/page.tsx
      portal/page.tsx        Luma passthrough + push opt-in
      appointment/page.tsx
  api/
    reviews/google/route.ts
    reviews/rater8/route.ts
    subscribe/route.ts
components/                  reusable: Header, BottomNav, TopicIcon, Rater8Testimonials, GoogleReviews, LocationsMap
data/                        providers.ts, locations.ts, education.ts
messages/                    en.json, es.json
scripts/                     scrape-providers.ts
```

## What's stubbed and what's real (Week 1 → Week 4)

### Real and working
- All 8 routes render with full UI
- All 34 cardiologist names, credentials, locations, profile URLs hand-extracted from hearthousenj.com
- All 6 office addresses, phones, lat/lng coordinates
- All 9 hospital affiliations
- 8 CardioSmart education topics with full EN + ES summaries, when-to-call clinical bullets, suggested patient questions
- Complete EN + ES UI translations
- Provider scraper script (`pnpm run scrape:providers`)
- Google Places API route with caching
- Rater8 reviews live for 32 of 33 directory cardiologists (Alex Smith is too new, renders empty-state card). Aggregate score + 5 testimonial quotes per provider, scraped server-side from reviews.rater8.com with a 6h cache. Allowlist in `data/rater8.ts` filters out Shore Heart Group, which shares the same CVA USA listing.
- Web Push registration flow
- Tailwind theme with brand tokens
- PWA manifest for installable app

### Stubbed (week 2-4 work)
- Provider photos: scraper ready but not yet run
- Provider bios: empty until scraper runs
- Provider education and languages: empty
- ~~Rater8 scores: 0 until vendor wires up~~ — done 2026-05-24, scrape live (see "Real and working")
- ~~Google Place IDs: env keys defined, values empty~~ — done 2026-05-24, all canonical, reviews live in dev with `GOOGLE_PLACES_API_KEY` set
- LocationsMap: SVG placeholder; swap for Mapbox week 4
- FCM VAPID key: not yet generated in Firebase Console
- Real appointment submission: currently logs to console, must wire to internal scheduler or Jotform parity (current site uses jotform.com/232886377016161)

## 4-week roadmap

- [x] **Week 1**: scaffold complete. All routes render. Hand-curated data for all 34 providers, 6 locations, 9 hospitals, 8 education topics. EN + ES UI complete. Reviews and push notification flows wired but stubbed.
- [x] **Week 2** (partial, done 2026-05-24): scrape-providers run (photos + bios in `public/providers/` and `data/providers-scraped.json`). Location detail pages built and tightened (compact hours, 2-col provider grid on desktop, backlink). About page built and tightened. **Outstanding**: provider detail polish, subspecialty mapping verification against practice records.
- [ ] **Week 3**: add embedded ACC infographics to education pages (where licensable). Spanish translations medical-reviewed.
- [ ] **Week 4** (partial, done 2026-05-24): Google Places integration live (all 6 Place IDs canonical, all 3 keys deployed and verified rendering). Rater8 live via public-page scrape (32/33 providers, allowlist-gated, 6h cache). Deployed to production at https://thh-patient-app.vercel.app. **Outstanding**: Mapbox swap (or stick with Google Maps JS — current impl uses `@vis.gl/react-google-maps`), push notifications live with FCM (needs VAPID key from Firebase Console), Domain CNAME with IT.

## Constraints and guardrails

- **HIPAA**: no PHI flows through this app. All portal interactions open Luma in a new tab. Push notifications never contain clinical details, only "you have a new message" or "reminder for tomorrow's visit."
- **Copyright**: CardioSmart content is linked, never reproduced. Practice-written summaries are 60-80 words and original. ACC attribution surfaced on the education index page.
- **Google Places attribution**: per [Places API Terms](https://developers.google.com/maps/terms#3-license), the Google G logo and "Reviews powered by Google" must appear wherever Google reviews are displayed. Built in to the `GoogleReviews` component.
- **Spanish content**: machine translation is week 1 placeholder only. All patient-facing Spanish must be medical-translator reviewed before production.
- **No "before-and-after" or other testimonial content** in marketing claims that could trigger state medical board advertising scrutiny. Stick to verified Rater8 quotes.

## Communication preferences (per Dr. Tarditi's user preferences)

- Execute tasks directly, no permission asks
- No placeholders, complete information always
- No em dashes
- Cut padding phrases ("highlights the importance of," "plays a crucial role in," etc.)
- Kill "Not only X but also Y," rule-of-three listings, vague "from X to Y" ranges
- Vary pacing. Short sentences hit. Use "And," "But," "Like" to start sentences
- Active voice, "I" and "you"
- Concrete and opinionated. Name specific vendors, dollar amounts, timelines
- Formatting like salt. Don't bold every term. Paragraphs over lists when prose works
- Smart brevity always. If the point is made, stop

## Reference URLs

- Practice website: https://www.hearthousenj.com/
- Providers: https://www.hearthousenj.com/cardiology-doctors
- Locations: https://www.hearthousenj.com/locations
- Hospital affiliations: https://www.hearthousenj.com/about/hospital-affiliations
- Current patient portal: https://portal.hearthousenj.com/
- Current payment: https://www.patientnotebook.com/hearthousecadv
- Current appointment form: https://form.jotform.com/232886377016161
- CardioSmart: https://www.cardiosmart.org/
- CardioSmart Spanish: https://www.cardiosmart.org/es/

## How to use this file in future Claude sessions

When starting a new conversation about this project:
1. If working from the GitHub repo, Claude reads this automatically.
2. If working in claude.ai chat without the repo, paste the relevant section ("Decisions locked in" + "Open questions" is usually enough) into the first message.
3. Update the "Decisions locked in" table when we settle a new question.
4. Move items from "Open questions" to "Decisions locked in" as they're answered.
5. Check off roadmap items as they ship.

## Contact

- Project lead: Daniel Tarditi, DO, FACC
- Practice main line: 856-546-3003
- Practice fax: 856-547-5337

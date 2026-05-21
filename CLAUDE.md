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

## Open questions still to answer

- **Domain**: `app.hearthousenj.com` or `my.hearthousenj.com`? IT must add CNAME to Vercel.
- **GitHub org**: under `hearthousenj` org, Tarditi personal account, or new org? Determines who has admin.
- **Rater8 integration shape**: vendor API (more control, more work) or embeddable widget (faster ship, less flexible). Awaiting CSM call.
- **Google Place IDs**: need to be fetched once for all 6 offices and pasted into env. ~15 minutes of one-time work.
- **Subspecialty assignments**: I inferred from credentials and profile content; the practice should verify each of the 34 providers' subspecialties against internal records before launch.
- **Map provider**: Mapbox ($0 free tier sufficient for our traffic) vs Google Maps ($200/mo free credit, more familiar). Defer to week 4.
- **Spanish bios**: who translates? Hire a medical Spanish translator (one-time, ~$500-1000 for 34 bios) or use a service like Stepes.
- **Aggregate Rater8 score**: surface on home or only About page? Vendor needs to confirm if they expose a practice-wide score via API.

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
- Rater8 API stub (returns empty until vendor confirms shape)
- Web Push registration flow
- Tailwind theme with brand tokens
- PWA manifest for installable app

### Stubbed (week 2-4 work)
- Provider photos: scraper ready but not yet run
- Provider bios: empty until scraper runs
- Provider education and languages: empty
- Rater8 scores: 0 until vendor wires up
- Google Place IDs: env keys defined, values empty
- LocationsMap: SVG placeholder; swap for Mapbox week 4
- FCM VAPID key: not yet generated in Firebase Console
- Real appointment submission: currently logs to console, must wire to internal scheduler or Jotform parity (current site uses jotform.com/232886377016161)

## 4-week roadmap

- [x] **Week 1**: scaffold complete. All routes render. Hand-curated data for all 34 providers, 6 locations, 9 hospitals, 8 education topics. EN + ES UI complete. Reviews and push notification flows wired but stubbed.
- [ ] **Week 2**: run scrape-providers script for real photos and bios. Build location detail pages. Provider detail polish. Verify subspecialty mapping against practice records.
- [ ] **Week 3**: add embedded ACC infographics to education pages (where licensable). Spanish translations medical-reviewed. Build About page with aggregate NPS / Rater8 score.
- [ ] **Week 4**: Google Places integration live (fetch all 6 Place IDs, add to env). Rater8 API wiring (post-vendor call). Swap LocationsMap for Mapbox. Push notifications live with FCM. Deploy to Vercel staging at `thh-patient-app.vercel.app`. Domain CNAME with IT.

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

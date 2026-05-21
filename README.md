# The Heart House and Vascular Care — Patient App

Mobile-responsive web app for patients of The Heart House and Vascular Care (34 cardiologists, 6 South Jersey offices, 9 hospital affiliations). Built with Next.js 14, Tailwind, and shadcn-style primitives.

## Stack

- **Next.js 14** (App Router, RSC, static generation per locale and per provider/topic)
- **Tailwind CSS** with Heart House brand tokens
- **next-intl** for English and Spanish routing (`/en/...`, `/es/...`)
- **next-pwa** for installable app + offline shell
- **Lucide** icons (replace inline emoji or sprites)
- **Firebase Cloud Messaging** for push notifications
- **Vercel** as the deploy target (image optimization, edge routes, analytics)

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in keys
pnpm dev                     # http://localhost:3000
```

## Project structure

```
app/
  [locale]/
    (shell)/                 # routes that share the bottom-nav + header layout
      page.tsx               # home
      doctors/page.tsx       # 34-provider list with filters
      doctors/[slug]/page.tsx
      locations/page.tsx     # 6 offices + hospital affiliations
      education/page.tsx     # CardioSmart topic grid
      education/[slug]/page.tsx
      portal/page.tsx        # Luma Health passthrough + push opt-in
      appointment/page.tsx
    layout.tsx               # locale root
  api/
    reviews/google/route.ts  # Google Places Details proxy with revalidate
    reviews/rater8/route.ts  # Rater8 stub (replace with vendor API)
    subscribe/route.ts       # push subscription receiver
components/
  layout/                    # Header, BottomNav
  education/                 # TopicIcon
  locations/                 # LocationsMap (swap for Mapbox in week 4)
  reviews/                   # Rater8Testimonials, GoogleReviews
data/
  providers.ts               # 34 cardiologists, hand-mapped subspecialties
  locations.ts               # 6 offices with lat/lng + hours
  education.ts               # 8 CardioSmart topics (EN + ES)
messages/
  en.json
  es.json
scripts/
  scrape-providers.ts        # weekly photo/bio sync from hearthousenj.com
```

## CardioSmart UX flow

Hybrid card-and-linkout model:

1. Topic grid (8 cards) on `/education`
2. Tap a topic → practice-written summary, "When to call us" red callout, "Questions to ask your doctor", related topics
3. Big red CTA → opens cardiosmart.org (Spanish where ACC provides it, English fallback otherwise)
4. Secondary CTA → "Book an appointment about this" with topic prefilled

This adds practice-specific value (who treats this, when to call) without competing with or copying ACC content.

## Reviews layering

- **Home**: NPS 92 badge ("Top 1% of cardiology practices nationally")
- **Per provider**: Rater8 testimonials (verified post-visit, HIPAA-compliant) — primary
- **Per location**: Google reviews via Places Details API with full Google attribution + star icon (legal requirement)
- **About page**: aggregate Rater8 practice score (optional, week 4)

## Spanish toggle

Header globe icon switches between EN and ES. Locale persists in URL (`/es/doctors/...`). CardioSmart links auto-route to ES when available; English fallback shown with a one-line note in Spanish.

## Push notifications

Web Push API + FCM. Opt-in surfaced on the Portal page (not modal-on-load — proven to reduce subscriptions). Subscription POSTed to `/api/subscribe`; wire to your backend in week 4.

## Provider photo sync

`pnpm run scrape:providers` pulls photos and bios from hearthousenj.com profile pages, resizes to 400×400 JPEG via sharp, writes to `public/providers/{slug}.jpg`. Run weekly via Vercel cron or GitHub Action.

## 4-week roadmap

- [x] **Week 1**: scaffold, i18n shell, all 8 routes, providers/locations/education JSON, mockup-parity UI ← **you are here**
- [ ] **Week 2**: run scrape script for real photos and bios, build doctor detail polish, location detail pages
- [ ] **Week 3**: education topic pages with embedded ACC infographics, Spanish translations medical-reviewed
- [ ] **Week 4**: Google Places integration (get all 6 Place IDs), Rater8 API wiring, swap LocationsMap for Mapbox, push notifications live, Vercel staging deploy

## Deployment

```bash
vercel --prod
```

Environment variables in Vercel dashboard. Domain candidate: `app.hearthousenj.com` or `my.hearthousenj.com`.

## Compliance notes

- All portal links open Luma Health in a new tab. No PHI flows through this app.
- Google reviews displayed with Google logo + attribution per [Places API Terms](https://developers.google.com/maps/terms#3-license).
- Rater8 testimonials are practice-owned and HIPAA-compliant by design.
- CardioSmart content linked, not reproduced.
- Spanish translations require medical Spanish translator review before production. Machine translation is a starting point only.

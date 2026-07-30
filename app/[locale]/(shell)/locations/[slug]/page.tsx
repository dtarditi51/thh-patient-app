import type { Metadata } from "next";
import { Link } from "@/navigation";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, MapPin, Phone, Navigation, Clock } from "lucide-react";
import { locations, directionsUrl } from "@/data/locations";
import { providers } from "@/data/providers";
import { locales } from "@/i18n";
import { ProviderCard } from "@/components/doctors/ProviderCard";
import { GoogleReviews } from "@/components/reviews/GoogleReviews";
import { ReviewsSummaryBadge } from "@/components/reviews/ReviewsSummaryBadge";
import { TrackedLink } from "@/components/TrackedLink";
import { JsonLd } from "@/components/JsonLd";
import { locationSchema, breadcrumbSchema } from "@/lib/structuredData";
import { absoluteUrl, truncateDescription, SITE_NAME } from "@/lib/seo";
import { OfficeStatusLabel } from "@/components/locations/OfficeStatusLabel";
import { fetchPlaceDetails } from "@/lib/googlePlaces";
import {
  ORDERED_DAYS,
  formatHoursRange,
  type DayKey,
  type HoursEntry,
  type OfficeHours
} from "@/lib/officeHours";

// Same Mon-Fri hours + Sat/Sun closed is true for every office today, so the
// 7-row table is mostly empty chrome. Collapse to one weekday row + a muted
// "weekend closed" line. If a future office gets irregular hours (e.g.
// half-day Friday), fall back to the per-day table.
function uniformWeekdayHours(hours: OfficeHours): HoursEntry | null {
  const weekdays: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const monday = hours.monday;
  if (!monday) return null;
  for (const d of weekdays) {
    const entry = hours[d];
    if (!entry || entry.open !== monday.open || entry.close !== monday.close) return null;
  }
  return monday;
}

const REVIEWS_ANCHOR_ID = "location-reviews";

export function generateStaticParams() {
  return locales.flatMap((locale) => locations.map((loc) => ({ locale, slug: loc.slug })));
}

export async function generateMetadata({
  params: { slug, locale }
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const location = locations.find((l) => l.slug === slug);
  if (!location) return {};

  const count = providers.filter((p) => p.locations.includes(location.slug)).length;
  const title = `${location.name} Cardiology Office`;
  const description = truncateDescription(
    `Cardiology care in ${location.city}, NJ. ${location.address}, ${location.city}, ${location.state} ${location.zip}. ${count} providers. Open Monday through Friday. Call ${location.phone}.`
  );
  const url = absoluteUrl(locale, `/locations/${location.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `${title} | The Heart House`,
      description,
      url,
      siteName: SITE_NAME
    },
    twitter: { card: "summary", title: `${title} | The Heart House`, description }
  };
}

export default async function LocationDetailPage({
  params: { slug, locale }
}: {
  params: { slug: string; locale: string };
}) {
  setRequestLocale(locale);
  const location = locations.find((l) => l.slug === slug);
  if (!location) notFound();

  const t = await getTranslations("locationDetail");
  const tDoctors = await getTranslations("doctors");
  const tDays = await getTranslations("days");

  const officeProviders = providers.filter((p) => p.locations.includes(location.slug));

  const fullAddress = `${location.address}, ${location.city}, ${location.state} ${location.zip}`;
  // Maps Embed iframe URL ships to the browser; key must be HTTP-referrer-locked.
  // Dedicated key so the Maps JS / Places / Embed keys can each carry the minimal
  // API restriction set for their surface.
  const mapsEmbedKey = process.env.MAPS_EMBED_API_KEY;
  // q=place_id:XXX guarantees the marker pins on this exact business, not on a
  // road-level match from the free-form address (which routinely drops the marker
  // at the wrong building in shared medical complexes).
  const embedSrc = mapsEmbedKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsEmbedKey}&q=place_id:${encodeURIComponent(location.placeId)}&zoom=16`
    : null;
  const directionsHref = directionsUrl(location);
  const externalMapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}&query_place_id=${encodeURIComponent(location.placeId)}`;

  const weekdayHours = uniformWeekdayHours(location.hours);
  const weekendClosed = !location.hours.saturday && !location.hours.sunday;
  const useCompactHours = weekdayHours !== null && weekendClosed;

  // Lifted to the page so the summary badge above providers and the full
  // reviews block at the bottom share one Place Details fetch.
  const placeDetails = await fetchPlaceDetails(location.placeId);

  // Only emit aggregateRating when the same numbers are rendered on the page.
  // schema.org requires the marked-up rating to be visible to the user, and
  // GoogleReviews / ReviewsSummaryBadge below render exactly this result.
  const schemaRating =
    placeDetails?.rating && placeDetails?.user_ratings_total
      ? { ratingValue: placeDetails.rating, reviewCount: placeDetails.user_ratings_total }
      : null;

  return (
    <div className="container-app space-y-6 py-4 pb-12">
      <JsonLd
        data={[
          locationSchema(location, locale, schemaRating),
          breadcrumbSchema(locale, [
            { name: t("backToList"), path: "/locations" },
            { name: location.name, path: `/locations/${location.slug}` }
          ])
        ]}
      />
      <Link
        href="/locations"
        className="inline-flex items-center gap-1 text-sm text-thh-muted hover:text-thh-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToList")}
      </Link>

      <section>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-5 w-5 text-thh-red" />
          <h1 className="text-2xl font-medium">{location.name}</h1>
        </div>
        <address className="mt-2 not-italic text-sm text-thh-ink">
          {location.address}
          <br />
          {location.city}, {location.state} {location.zip}
        </address>
        <TrackedLink
          href={`tel:${location.phone}`}
          event="tel_tap"
          eventProps={{ source: "location_detail", office: location.slug }}
          className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-thh-red"
          aria-label={t("callOffice")}
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          {location.phone}
        </TrackedLink>
      </section>

      <section className="space-y-2">
        <h2 className="flex items-center gap-1.5 text-base font-medium">
          <Clock className="h-4 w-4" />
          {t("hours")}
        </h2>
        <OfficeStatusLabel hours={location.hours} variant="banner" />
        {useCompactHours ? (
          <div className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-thh-line">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{t("weekdayRange")}</span>
              <span className="text-thh-ink">{formatHoursRange(weekdayHours!, locale)}</span>
            </div>
            <div className="mt-1 text-xs text-thh-muted">{t("weekendClosed")}</div>
          </div>
        ) : (
          <ul className="divide-y divide-thh-line rounded-xl bg-white ring-1 ring-thh-line">
            {ORDERED_DAYS.map((day: DayKey) => {
              const entry = location.hours[day];
              return (
                <li key={day} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="font-medium">{tDays(day)}</span>
                  <span className={entry ? "text-thh-ink" : "text-thh-muted"}>
                    {entry ? formatHoursRange(entry, locale) : t("closed")}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        {embedSrc ? (
          <div className="overflow-hidden rounded-xl ring-1 ring-thh-line">
            <iframe
              src={embedSrc}
              title={t("mapTitle", { name: location.name })}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-64 w-full md:h-80"
            />
          </div>
        ) : (
          <a
            href={externalMapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-48 w-full items-center justify-center rounded-xl bg-thh-surface text-sm text-thh-muted ring-1 ring-thh-line"
          >
            {t("viewMap")}
          </a>
        )}
        <div className="grid grid-cols-2 gap-2">
          <TrackedLink
            href={`tel:${location.phone}`}
            event="tel_tap"
            eventProps={{ source: "location_detail_cta", office: location.slug }}
            className="btn-primary w-full justify-center"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {t("callOffice")}
          </TrackedLink>
          <TrackedLink
            href={directionsHref}
            event="directions_click"
            eventProps={{ source: "location_detail", office: location.slug }}
            external
            className="btn-ghost w-full justify-center"
          >
            <Navigation className="h-4 w-4 text-thh-red" aria-hidden="true" />
            {t("needDirections")}
          </TrackedLink>
        </div>
      </section>

      <ReviewsSummaryBadge
        result={placeDetails}
        seeAllLabel={t("reviewsSummarySeeAll")}
        countLabel={(count) => t("reviewsSummaryCount", { count })}
        targetId={REVIEWS_ANCHOR_ID}
      />

      <section>
        <h2 className="mb-2 text-base font-medium">{t("providersHere")}</h2>
        {officeProviders.length === 0 ? (
          <p className="text-sm text-thh-muted">{t("noProviders")}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {officeProviders.map((p) => (
              <li key={p.slug}>
                <ProviderCard provider={p} locale={locale} acceptingNewLabel={tDoctors("acceptingNew")} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id={REVIEWS_ANCHOR_ID} className="scroll-mt-20">
        <GoogleReviews
          placeId={location.placeId}
          result={placeDetails}
          heading={t("reviewsHeading")}
          emptyLabel={t("reviewsEmpty")}
          attribution={t("reviewsAttribution")}
        />
      </section>
    </div>
  );
}

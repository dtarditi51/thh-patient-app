import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin, Phone, Navigation, Clock } from "lucide-react";
import { locations } from "@/data/locations";
import { providers } from "@/data/providers";
import { locales } from "@/i18n";
import { ProviderCard } from "@/components/doctors/ProviderCard";
import { GoogleReviews } from "@/components/reviews/GoogleReviews";
import { OfficeStatusLabel } from "@/components/locations/OfficeStatusLabel";
import { ORDERED_DAYS, formatHoursRange, type DayKey } from "@/lib/officeHours";

export function generateStaticParams() {
  return locales.flatMap((locale) => locations.map((loc) => ({ locale, slug: loc.slug })));
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
  const mapsEmbedKey = process.env.GOOGLE_PLACES_API_KEY;
  const embedSrc = mapsEmbedKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsEmbedKey}&q=${encodeURIComponent(fullAddress)}&center=${location.lat},${location.lng}&zoom=15`
    : null;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}&destination_place_id=${encodeURIComponent(location.placeId)}`;
  const externalMapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}&query_place_id=${encodeURIComponent(location.placeId)}`;

  return (
    <div className="container-app space-y-6 py-4 pb-12">
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
        <a
          href={`tel:${location.phone}`}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-thh-red"
          aria-label={t("callOffice")}
        >
          <Phone className="h-4 w-4" />
          {location.phone}
        </a>
      </section>

      <section className="space-y-2">
        <h2 className="flex items-center gap-1.5 text-base font-medium">
          <Clock className="h-4 w-4" />
          {t("hours")}
        </h2>
        <OfficeStatusLabel hours={location.hours} variant="banner" />
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
      </section>

      <section>
        <h2 className="mb-2 text-base font-medium">{t("providersHere")}</h2>
        {officeProviders.length === 0 ? (
          <p className="text-sm text-thh-muted">{t("noProviders")}</p>
        ) : (
          <ul className="space-y-2">
            {officeProviders.map((p) => (
              <li key={p.slug}>
                <ProviderCard provider={p} locale={locale} acceptingNewLabel={tDoctors("acceptingNew")} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        {embedSrc ? (
          <div className="overflow-hidden rounded-xl ring-1 ring-thh-line">
            <iframe
              src={embedSrc}
              title={`${location.name} office map`}
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
      </section>

      <section className="grid grid-cols-2 gap-2">
        <a href={`tel:${location.phone}`} className="btn-primary w-full justify-center">
          <Phone className="h-4 w-4" />
          {t("callOffice")}
        </a>
        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost w-full justify-center"
        >
          <Navigation className="h-4 w-4" />
          {t("getDirections")}
        </a>
      </section>

      <section>
        <GoogleReviews
          placeId={location.placeId}
          heading={t("reviewsHeading")}
          emptyLabel={t("reviewsEmpty")}
          attribution={t("reviewsAttribution")}
        />
      </section>
    </div>
  );
}

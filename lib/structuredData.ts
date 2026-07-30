import type { Location } from "@/data/locations";
import type { Provider } from "@/data/providers";
import { subspecialtyLabels, type Subspecialty } from "@/data/providers";
import type { OfficeHours } from "@/lib/officeHours";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, PRACTICE_WEBSITE, absoluteUrl } from "@/lib/seo";
import { PRACTICE_MAIN_PHONE } from "@/lib/practiceInfo";

// schema.org JSON-LD for Google's local pack and physician knowledge panels.
//
// Everything here is derived from data already in the repo — verified Place
// IDs, verified lat/lng (see the validate:locations note in CLAUDE.md), office
// hours, and credentials. Nothing is invented. If a field isn't in the data, it
// is omitted rather than guessed: fabricated structured data is a manual-action
// risk, and this is a medical practice.

const DAY_MAP: Record<keyof OfficeHours, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday"
};

function openingHours(hours: OfficeHours) {
  return (Object.keys(DAY_MAP) as (keyof OfficeHours)[])
    .filter((day) => hours[day])
    .map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${DAY_MAP[day]}`,
      opens: hours[day]!.open,
      closes: hours[day]!.close
    }));
}

/** Practice-level identity. Referenced by @id from the per-office nodes. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "The Heart House",
    url: SITE_URL,
    sameAs: [PRACTICE_WEBSITE],
    description: SITE_DESCRIPTION,
    telephone: PRACTICE_MAIN_PHONE,
    medicalSpecialty: "Cardiovascular",
    foundingDate: "1979",
    areaServed: { "@type": "AdministrativeArea", name: "Southern New Jersey" }
  };
}

/**
 * One office. aggregateRating is passed in from the live Google Places result
 * rather than hardcoded — schema.org requires that a rating shown in markup is
 * also visible on the page, and the page renders the same fetched value.
 */
export function locationSchema(
  location: Location,
  locale: string,
  rating?: { ratingValue: number; reviewCount: number } | null
) {
  const url = absoluteUrl(locale, `/locations/${location.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${url}#clinic`,
    name: `${SITE_NAME} — ${location.name}`,
    url,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    medicalSpecialty: "Cardiovascular",
    telephone: location.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: location.city,
      addressRegion: location.state,
      postalCode: location.zip,
      addressCountry: "US"
    },
    geo: { "@type": "GeoCoordinates", latitude: location.lat, longitude: location.lng },
    openingHoursSpecification: openingHours(location.hours),
    ...(rating && rating.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.ratingValue,
            reviewCount: rating.reviewCount,
            bestRating: 5,
            worstRating: 1
          }
        }
      : {})
  };
}

/** One provider. */
export function providerSchema(provider: Provider, locale: string, offices: Location[]) {
  const url = absoluteUrl(locale, `/doctors/${provider.slug}`);
  const lang = locale === "es" ? "es" : "en";
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${url}#physician`,
    name: `${provider.name}, ${provider.credentials}`,
    url,
    ...(provider.photoUrl ? { image: `${SITE_URL}${provider.photoUrl}` } : {}),
    ...(provider.bio ? { description: provider.bio } : {}),
    medicalSpecialty: "Cardiovascular",
    knowsAbout: provider.subspecialties.map(
      (s) => subspecialtyLabels[s as Subspecialty][lang]
    ),
    ...(provider.languages?.length ? { knowsLanguage: provider.languages } : {}),
    memberOf: { "@id": `${SITE_URL}/#organization` },
    ...(provider.profileUrl ? { sameAs: [provider.profileUrl] } : {}),
    workLocation: offices.map((o) => ({
      "@type": "MedicalClinic",
      name: `${SITE_NAME} — ${o.name}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: o.address,
        addressLocality: o.city,
        addressRegion: o.state,
        postalCode: o.zip,
        addressCountry: "US"
      },
      telephone: o.phone
    }))
  };
}

/** Breadcrumbs help Google render the path instead of a bare URL in results. */
export function breadcrumbSchema(locale: string, trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(locale, crumb.path)
    }))
  };
}

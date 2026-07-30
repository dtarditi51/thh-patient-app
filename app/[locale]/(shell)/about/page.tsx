import type { Metadata } from "next";
import { Link } from "@/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Stethoscope, MapPin, ArrowRight, Activity } from "lucide-react";
import { providers } from "@/data/providers";
import { hospitals } from "@/data/locations";
import { TrustBadge } from "@/components/home/TrustBadge";
import { GoogleG } from "@/components/reviews/GoogleG";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema } from "@/lib/structuredData";
import { absoluteUrl, truncateDescription, SITE_NAME } from "@/lib/seo";

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "about" });
  // Just the section name — the root layout template appends "| The Heart House".
  const title = t("hero.eyebrow");
  // Was: translated positioning + a hardcoded English clause, which made the
  // Spanish <meta description> half English. Now fully localized.
  const description = truncateDescription(t("metaDescription"));
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(locale, "/about") },
    openGraph: {
      type: "website",
      title: `${title} | The Heart House`,
      description,
      url: absoluteUrl(locale, "/about"),
      siteName: SITE_NAME
    },
    keywords: [
      "cardiologist southern New Jersey",
      "South Jersey heart doctor",
      "cardiology Camden County NJ",
      "Cooper Jefferson Virtua Inspira cardiology"
    ]
  };
}

export default async function AboutPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tHome = await getTranslations("home");

  const leaders = providers
    .filter((p) => p.leadershipRole)
    .sort((a, b) => (a.leadershipOrder ?? 99) - (b.leadershipOrder ?? 99));

  return (
    <div className="container-app space-y-10 py-4 pb-12">
      {/* Practice-level identity node. Every location's MedicalClinic schema
          points back at this via parentOrganization @id. */}
      <JsonLd data={organizationSchema()} />
      {/* Hero */}
      {/* TODO: replace gradient with a real photo collage of offices or team once available */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-thh-red to-thh-red-dark p-6 text-white md:p-8">
        <p className="text-xs uppercase tracking-wider text-white/80">{t("hero.eyebrow")}</p>
        <h1 className="mt-2 text-2xl font-medium leading-tight md:text-3xl">{t("hero.title")}</h1>
        <p className="mt-3 text-sm text-white/90 md:text-base">{t("hero.positioning")}</p>
      </section>

      {/* Story */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">{t("story.heading")}</h2>
        <p className="text-sm leading-relaxed text-thh-ink">{t("story.p1")}</p>
        <p className="text-sm leading-relaxed text-thh-ink">{t("story.p2")}</p>
      </section>

      {/* By the numbers */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">{t("stats.heading")}</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <TrustBadge size="large" value={tHome("trust.nps")} label={tHome("trust.npsLabel")} icon="star" />
          <TrustBadge
            size="large"
            value={tHome("trust.physicians")}
            label={tHome("trust.physiciansLabel")}
            icon="docs"
          />
          <TrustBadge
            size="large"
            value={tHome("trust.locations")}
            label={tHome("trust.locationsLabel")}
            icon="map"
          />
          <TrustBadge
            size="large"
            value={tHome("trust.hospitals")}
            label={tHome("trust.hospitalsLabel")}
            icon="hospital"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl bg-thh-red-50 p-4 ring-1 ring-thh-red/20">
            <Activity className="mt-0.5 h-5 w-5 flex-shrink-0 text-thh-red" />
            <div>
              <div className="text-sm font-medium text-thh-ink">{t("stats.petCalloutTitle")}</div>
              <p className="mt-1 text-xs leading-relaxed text-thh-muted">{t("stats.petCalloutBody")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-thh-line">
            <GoogleG className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-thh-ink">{t("stats.reviewsCalloutTitle")}</div>
              <p className="mt-1 text-xs leading-relaxed text-thh-muted">{t("stats.reviewsCalloutBody")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-medium">{t("leadership.heading")}</h2>
          <p className="text-xs text-thh-muted">{t("leadership.subhead")}</p>
        </div>
        {leaders.length === 0 ? (
          <p className="text-xs text-thh-muted">
            {/* TODO (dev-only): leadership cards will appear once leadershipRole is set on providers */}
            {t("leadership.pending")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {leaders.map((leader) => (
              <Link
                key={leader.slug}
                href={`/doctors/${leader.slug}`}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-thh-line hover:bg-thh-surface"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-thh-red-50">
                  {leader.photoUrl && (
                    <Image
                      src={leader.photoUrl}
                      alt={leader.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-thh-ink">
                    {leader.name}, {leader.credentials}
                  </div>
                  <div className="mt-0.5 text-xs text-thh-red">{leader.leadershipRole}</div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-thh-muted">
                    {t("leadership.viewProfile")} <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Hospital affiliations */}
      {/* TODO: capture affiliation type (admitting / consulting / courtesy) per hospital from practice records */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-medium">{t("affiliations.heading")}</h2>
          <p className="text-xs text-thh-muted">{t("affiliations.subhead")}</p>
        </div>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {hospitals.map((h) => (
            <li key={h.name}>
              <a
                href={h.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-thh-line hover:bg-thh-surface"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-thh-ink">{h.name}</div>
                  <div className="text-[11px] text-thh-muted">{h.system}</div>
                </div>
                <ArrowRight className="ml-3 h-4 w-4 flex-shrink-0 text-thh-muted" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA footer */}
      <section className="space-y-3 rounded-2xl bg-thh-surface p-5 ring-1 ring-thh-line">
        <h2 className="text-lg font-medium">{t("cta.heading")}</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link href="/doctors" className="btn-primary w-full justify-center">
            <Stethoscope className="h-4 w-4" />
            {t("cta.findDoctor")}
          </Link>
          <Link href="/locations" className="btn-ghost w-full justify-center">
            <MapPin className="h-4 w-4" />
            {t("cta.findLocation")}
          </Link>
        </div>
      </section>
    </div>
  );
}

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Phone, Calendar, MapPin, GraduationCap, Languages } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { providers, subspecialtyLabels, type Subspecialty } from "@/data/providers";
import { locations } from "@/data/locations";
import { Rater8Testimonials } from "@/components/reviews/Rater8Testimonials";

export function generateStaticParams() {
  return providers.map((p) => ({ slug: p.slug }));
}

export default async function DoctorPage({ params: { slug, locale } }: { params: { slug: string; locale: string } }) {
  setRequestLocale(locale);
  const provider = providers.find((p) => p.slug === slug);
  if (!provider) notFound();
  const t = await getTranslations("doctors");
  const lang = locale as "en" | "es";
  const locs = locations.filter((l) => provider.locations.includes(l.slug));

  return (
    <div className="container-app space-y-6 py-4 pb-12">
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-thh-red-50 md:h-32 md:w-32">
          {provider.photoUrl && (
            <Image src={provider.photoUrl} alt={provider.name} fill className="object-cover" sizes="(min-width: 768px) 128px, 96px" priority />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-medium md:text-2xl">{provider.name}</h1>
          <p className="text-sm text-thh-muted">{provider.credentials}</p>
          <p className="mt-1 text-xs text-thh-muted">
            {provider.subspecialties.map((s) => subspecialtyLabels[s as Subspecialty][lang]).join(" · ")}
          </p>
          {provider.acceptingNew && <span className="pill mt-2 bg-green-50 text-green-800">{t("acceptingNew")}</span>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={`/${locale}/appointment?provider=${provider.slug}`} className="btn-primary">
          <Calendar className="h-4 w-4" />
          {t("bookWith", { name: provider.name })}
        </Link>
        <a href={`tel:${process.env.NEXT_PUBLIC_MAIN_PHONE || "856-546-3003"}`} className="btn-ghost">
          <Phone className="h-4 w-4" />
          856-546-3003
        </a>
      </div>

      {provider.bio && (
        <section>
          <h2 className="mb-2 text-base font-medium">{t("bio")}</h2>
          <p className="text-sm leading-relaxed text-thh-ink">
            {(lang === "es" && provider.bioEs) || provider.bio}
          </p>
        </section>
      )}

      {provider.education?.length ? (
        <section>
          <h2 className="mb-2 flex items-center gap-2 text-base font-medium">
            <GraduationCap className="h-4 w-4" /> {t("education")}
          </h2>
          <ul className="space-y-1 text-sm text-thh-ink">
            {provider.education.map((e) => <li key={e}>· {e}</li>)}
          </ul>
        </section>
      ) : null}

      {provider.languages?.length ? (
        <section>
          <h2 className="mb-2 flex items-center gap-2 text-base font-medium">
            <Languages className="h-4 w-4" /> {t("languages")}
          </h2>
          <p className="text-sm">{provider.languages.join(", ")}</p>
        </section>
      ) : null}

      <section>
        <h2 className="mb-2 flex items-center gap-2 text-base font-medium">
          <MapPin className="h-4 w-4" /> {locs.length === 1 ? "Practices at" : "Practices at"}
        </h2>
        <div className="space-y-2">
          {locs.map((loc) => (
            <Link key={loc.slug} href={`/${locale}/locations/${loc.slug}`} className="block rounded-xl bg-white p-3 ring-1 ring-thh-line hover:bg-thh-surface">
              <div className="text-sm font-medium">{loc.name}</div>
              <div className="text-xs text-thh-muted">{loc.address}, {loc.city}, NJ {loc.zip}</div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-base font-medium">{t("reviews")}</h2>
        <Rater8Testimonials providerSlug={provider.slug} providerName={provider.name} />
      </section>
    </div>
  );
}

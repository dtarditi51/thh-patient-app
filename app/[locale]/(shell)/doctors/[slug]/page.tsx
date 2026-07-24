import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Languages,
  ExternalLink
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { providers, subspecialtyLabels, type Subspecialty } from "@/data/providers";
import { locations } from "@/data/locations";
import { Rater8Testimonials } from "@/components/reviews/Rater8Testimonials";

export function generateStaticParams() {
  return providers.map((p) => ({ slug: p.slug }));
}

// Some scraped bios use `\n\n` to separate paragraphs. Rendering the whole
// string inside one <p> collapses those breaks visually and turns long bios
// into a wall of text. Split here so each paragraph gets its own block.
function bioParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// Education strings are formatted "Label: value" upstream (e.g.
// "Medical School: Temple University"). Splitting on the first colon lets us
// bold the label so the list scans like a definition list rather than a wall
// of equally-weighted text. Entries that don't follow the convention render
// as plain text.
function splitEducation(entry: string): { label?: string; value: string } {
  const idx = entry.indexOf(":");
  if (idx === -1) return { value: entry };
  return { label: entry.slice(0, idx).trim(), value: entry.slice(idx + 1).trim() };
}

export default async function DoctorPage({ params: { slug, locale } }: { params: { slug: string; locale: string } }) {
  setRequestLocale(locale);
  const provider = providers.find((p) => p.slug === slug);
  if (!provider) notFound();
  const t = await getTranslations("doctors");
  const lang = locale as "en" | "es";
  const locs = locations.filter((l) => provider.locations.includes(l.slug));
  const bioText = (lang === "es" && provider.bioEs) || provider.bio;
  const paragraphs = bioText ? bioParagraphs(bioText) : [];

  return (
    <div className="container-app space-y-6 py-4 pb-12">
      <Link
        href={`/${locale}/doctors`}
        className="inline-flex items-center gap-1 text-sm text-thh-muted hover:text-thh-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToList")}
      </Link>

      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-thh-red-50 md:h-32 md:w-32">
          {provider.photoUrl && (
            <Image src={provider.photoUrl} alt={provider.name} fill className="object-cover" sizes="(min-width: 768px) 128px, 96px" priority />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-medium md:text-2xl">{provider.name}</h1>
          <p className="text-sm text-thh-muted">{provider.credentials}</p>
          {provider.leadershipRole && (
            <p className="mt-0.5 text-xs font-medium text-thh-red">{provider.leadershipRole}</p>
          )}
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

      {provider.profileUrl && (
        <a
          href={provider.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-thh-muted hover:text-thh-ink"
        >
          <ExternalLink className="h-3 w-3" />
          {t("viewOnSite")}
        </a>
      )}

      {paragraphs.length > 0 && (
        <section>
          <h2 className="mb-2 text-base font-medium">{t("bio")}</h2>
          <div className="space-y-2 text-sm leading-relaxed text-thh-ink">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {provider.education?.length ? (
        <section>
          <h2 className="mb-2 flex items-center gap-2 text-base font-medium">
            <GraduationCap className="h-4 w-4" /> {t("education")}
          </h2>
          <ul className="space-y-1.5 text-sm text-thh-ink">
            {provider.education.map((e) => {
              const { label, value } = splitEducation(e);
              return (
                <li key={e} className="flex gap-2">
                  <span aria-hidden className="select-none text-thh-muted">·</span>
                  <span className="min-w-0 flex-1">
                    {label && <span className="font-medium">{label}: </span>}
                    {value}
                  </span>
                </li>
              );
            })}
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
          <MapPin className="h-4 w-4" /> {t("practicesAt")}
        </h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {locs.map((loc) => (
            <Link
              key={loc.slug}
              href={`/${locale}/locations/${loc.slug}`}
              className="block rounded-xl bg-white p-3 ring-1 ring-thh-line hover:bg-thh-surface"
            >
              <div className="text-sm font-medium">{loc.name}</div>
              <div className="text-xs text-thh-muted">{loc.address}, {loc.city}, NJ {loc.zip}</div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-base font-medium">{t("reviews")}</h2>
        <Rater8Testimonials
          providerSlug={provider.slug}
          providerName={provider.name}
          emptyLabel={t("reviewsComingSoon")}
        />
      </section>
    </div>
  );
}

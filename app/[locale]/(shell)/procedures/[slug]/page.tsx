import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeartPulse, Scan, Activity, FileDown, Phone, Clock, ChevronLeft } from "lucide-react";
import { procedures } from "@/data/procedures";
import { absoluteUrl, truncateDescription, SITE_NAME } from "@/lib/seo";

const ICONS = { "heart-pulse": HeartPulse, scan: Scan, activity: Activity };

export function generateStaticParams() {
  return procedures.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params: { slug, locale }
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const p = procedures.find((x) => x.slug === slug);
  if (!p) return {};
  const lang = locale === "es" ? "es" : "en";
  const title = `${lang === "es" ? p.titleEs : p.titleEn} — How to Prepare`;
  const description = truncateDescription(lang === "es" ? p.summaryEs : p.summaryEn);
  const url = absoluteUrl(locale, `/procedures/${p.slug}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${title} | The Heart House`,
      description,
      url,
      siteName: SITE_NAME
    },
    twitter: { card: "summary", title: `${title} | The Heart House`, description }
  };
}

export default async function ProcedureDetailPage({ params: { slug, locale } }: { params: { slug: string; locale: string } }) {
  setRequestLocale(locale);
  const p = procedures.find((x) => x.slug === slug);
  if (!p) notFound();
  const t = await getTranslations("procedures");
  const lang = locale as "en" | "es";
  const Icon = ICONS[p.icon];

  const title = lang === "es" ? p.titleEs : p.titleEn;
  const summary = lang === "es" ? p.summaryEs : p.summaryEn;
  const duration = lang === "es" ? p.durationEs : p.durationEn;

  return (
    <div className="container-app space-y-6 py-4 pb-12">
      <Link href="/procedures" className="inline-flex items-center gap-1 text-xs text-thh-red">
        <ChevronLeft className="h-4 w-4" />
        {t("backToList")}
      </Link>

      <div className={`flex items-center gap-4 rounded-xl p-5 procedure-hero-${p.color}`}>
        <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full procedure-heroicon-${p.color}`}>
          <Icon className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-xl font-medium md:text-2xl">{title}</h1>
        </div>
      </div>

      <section>
        <p className="text-sm leading-relaxed">{summary}</p>
      </section>

      <section className="flex items-start gap-2 rounded-lg bg-thh-surface p-3 text-xs text-thh-ink">
        <Clock className="h-4 w-4 flex-shrink-0 mt-0.5 text-thh-red" />
        <span>{duration}</span>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-medium">{t("howToPrepare")}</h2>
        {p.prep.map((s, i) => (
          <div key={i}>
            <h3 className="text-sm font-medium text-thh-ink">{lang === "es" ? s.titleEs : s.titleEn}</h3>
            <p className="mt-1 text-sm leading-relaxed text-thh-ink/90">{lang === "es" ? s.bodyEs : s.bodyEn}</p>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-medium">{t("printableLabel")}</h2>
        {p.pdfs.map((pdf, i) => {
          const label = lang === "es" ? pdf.labelEs : pdf.labelEn;
          const url = lang === "es" ? pdf.urlEs : pdf.urlEn;
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-thh-line hover:bg-thh-surface"
            >
              <div className="flex items-center gap-3">
                <FileDown className="h-5 w-5 text-thh-red" />
                <div className="text-sm font-medium">{label}</div>
              </div>
            </a>
          );
        })}
      </section>

      <section>
        <a
          href={`tel:${p.phone},${p.phoneExt}`}
          className="flex items-center justify-between rounded-xl bg-thh-red p-4 text-white hover:bg-thh-red-dark"
        >
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5" />
            <div>
              <div className="text-sm font-medium">{t("questionsLabel")}</div>
              <div className="text-xs text-white/80">
                {p.phone} {t("ext")} {p.phoneExt}
              </div>
            </div>
          </div>
        </a>
      </section>

    </div>
  );
}

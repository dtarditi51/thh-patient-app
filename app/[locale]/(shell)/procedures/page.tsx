import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeartPulse, Scan, Activity, Info, ChevronRight } from "lucide-react";
import { procedures } from "@/data/procedures";
import { absoluteUrl, truncateDescription, SITE_NAME } from "@/lib/seo";

const ICONS = { "heart-pulse": HeartPulse, scan: Scan, activity: Activity };

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "procedures" });
  const title = t("title");
  const description = truncateDescription(t("subtitle"));
  const url = absoluteUrl(locale, "/procedures");
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

export default async function ProceduresPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("procedures");
  const lang = locale as "en" | "es";

  return (
    <div className="container-app space-y-4 py-4 pb-12">
      <div>
        <h1 className="text-2xl font-medium">{t("title")}</h1>
        <p className="mt-1 text-sm text-thh-muted">{t("subtitle")}</p>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>{t("confirmationCallout")}</span>
      </div>

      <div className="grid gap-3">
        {procedures.map((p) => {
          const Icon = ICONS[p.icon];
          return (
            <Link
              key={p.slug}
              href={`/procedures/${p.slug}`}
              className="block overflow-hidden rounded-xl bg-white ring-1 ring-thh-line hover:bg-thh-surface"
            >
              <div className="flex items-center gap-4 p-4">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full procedure-chip-${p.color}`}>
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{lang === "es" ? p.titleEs : p.titleEn}</div>
                  <div className="mt-0.5 text-xs leading-snug text-thh-muted line-clamp-2">{lang === "es" ? p.summaryEs : p.summaryEn}</div>
                </div>
                <ChevronRight className="h-5 w-5 flex-shrink-0 text-thh-muted" aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

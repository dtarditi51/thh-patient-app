import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeartPulse, Scan, Activity, Info, ChevronRight } from "lucide-react";
import { procedures } from "@/data/procedures";

const ICONS = { "heart-pulse": HeartPulse, scan: Scan, activity: Activity };

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
              href={`/${locale}/procedures/${p.slug}`}
              className={`block overflow-hidden rounded-xl bg-white ring-1 ring-thh-line hover:bg-thh-surface procedure-bg-${p.color}`}
            >
              <div className="flex items-center gap-4 p-4">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full procedure-icon-${p.color}`}>
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{lang === "es" ? p.titleEs : p.titleEn}</div>
                  <div className="mt-0.5 text-xs leading-snug text-thh-muted line-clamp-2">{lang === "es" ? p.summaryEs : p.summaryEn}</div>
                </div>
                <ChevronRight className="h-5 w-5 flex-shrink-0 text-thh-muted" />
              </div>
            </Link>
          );
        })}
      </div>

      <style>{`
        .procedure-bg-red { background:#FFFFFF; }
        .procedure-bg-blue { background:#FFFFFF; }
        .procedure-bg-purple { background:#FFFFFF; }
        .procedure-icon-red { background:#FFE8EC; color:#C8102E; }
        .procedure-icon-blue { background:#E6F1FB; color:#1A6FBB; }
        .procedure-icon-purple { background:#EEEDFE; color:#6B5BD3; }
      `}</style>
    </div>
  );
}

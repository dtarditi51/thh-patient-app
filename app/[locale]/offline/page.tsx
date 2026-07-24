import { HeartPulse, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PRACTICE_MAIN_PHONE, PRACTICE_MAIN_PHONE_DISPLAY } from "@/lib/practiceInfo";
import { RetryButton } from "@/components/offline/RetryButton";
import { OfflineLocaleRedirect } from "@/components/offline/OfflineLocaleRedirect";

// Served as the SW document fallback when the user is offline and hits a route
// that isn't cached. Kept outside the (shell) route group so it doesn't depend
// on the header / bottom-nav chrome (which may itself be uncached).
export default async function OfflinePage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("pwa.offline");

  return (
    <div className="flex min-h-screen items-center justify-center bg-thh-surface px-4 py-8">
      <OfflineLocaleRedirect currentLocale={locale} />
      <div className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-6 ring-1 ring-thh-line">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-thh-red">
            <HeartPulse className="h-5 w-5 text-white" strokeWidth={2} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-thh-ink">The Heart House</span>
            <span className="text-[10px] text-thh-muted">& Vascular Care</span>
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-medium text-thh-ink">{t("heading")}</h1>
          <p className="text-sm leading-relaxed text-thh-muted">{t("body")}</p>
        </div>

        <RetryButton label={t("retry")} />

        <div className="border-t border-thh-line pt-4">
          <p className="text-xs text-thh-muted">{t("phoneIntro")}</p>
          <a
            href={`tel:${PRACTICE_MAIN_PHONE}`}
            className="mt-1 inline-flex items-center gap-1.5 text-base font-medium text-thh-red"
          >
            <Phone className="h-4 w-4" />
            {PRACTICE_MAIN_PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </div>
  );
}

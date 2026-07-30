"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/navigation";
import { Phone, Globe, HeartPulse } from "lucide-react";
import { PRACTICE_MAIN_PHONE, PRACTICE_MAIN_PHONE_DISPLAY } from "@/lib/practiceInfo";
import { SHOW_LANGUAGE_TOGGLE } from "@/lib/launchFlags";
import { track } from "@/lib/analytics";

export function Header() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLanguage(next: "en" | "es") {
    // pathname is locale-agnostic here, so the router just re-renders the same
    // route under the other locale. No manual segment splicing.
    router.replace(pathname, { locale: next });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-thh-line bg-white">
      <div className="container-app flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-thh-red">
            <HeartPulse className="h-5 w-5 text-white" strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-thh-ink">The Heart House</span>
            <span className="text-[10px] text-thh-muted">&amp; Vascular Care</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {SHOW_LANGUAGE_TOGGLE && (
            <button
              onClick={() => switchLanguage(locale === "en" ? "es" : "en")}
              className="flex min-h-[44px] items-center gap-1 rounded-full px-3 text-xs text-thh-muted hover:bg-thh-surface"
              aria-label={t("language")}
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              {locale === "en" ? "ES" : "EN"}
            </button>
          )}
          <a
            href={`tel:${PRACTICE_MAIN_PHONE}`}
            onClick={() => track("tel_tap", { source: "header" })}
            className="flex min-h-[44px] items-center gap-1.5 rounded-full bg-thh-red-50 px-3 text-xs font-medium text-thh-red"
            aria-label={t("callAria", { phone: PRACTICE_MAIN_PHONE_DISPLAY })}
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{PRACTICE_MAIN_PHONE_DISPLAY}</span>
            <span className="sm:hidden">{t("call")}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

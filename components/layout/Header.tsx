"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Phone, Globe, HeartPulse } from "lucide-react";

export function Header() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLanguage(next: "en" | "es") {
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "es") segments[1] = next;
    else segments.splice(1, 0, next);
    router.push(segments.join("/") || "/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-thh-line bg-white">
      <div className="container-app flex h-14 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-thh-red">
            <HeartPulse className="h-5 w-5 text-white" strokeWidth={2} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-thh-ink">The Heart House</span>
            <span className="text-[10px] text-thh-muted">& Vascular Care</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <button
            onClick={() => switchLanguage(locale === "en" ? "es" : "en")}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-thh-muted hover:bg-thh-surface"
            aria-label={t("language")}
          >
            <Globe className="h-3.5 w-3.5" />
            {locale === "en" ? "ES" : "EN"}
          </button>
          <a
            href={`tel:${process.env.NEXT_PUBLIC_MAIN_PHONE || "856-546-3003"}`}
            className="flex items-center gap-1.5 rounded-full bg-thh-red-50 px-3 py-1.5 text-xs font-medium text-thh-red"
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">856-546-3003</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Home, Stethoscope, MapPin, BookOpen, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const tabs = [
    { key: "home", href: `/${locale}`, label: t("home"), Icon: Home },
    { key: "doctors", href: `/${locale}/doctors`, label: t("doctors"), Icon: Stethoscope },
    { key: "locations", href: `/${locale}/locations`, label: t("locations"), Icon: MapPin },
    { key: "learn", href: `/${locale}/education`, label: t("learn"), Icon: BookOpen },
    { key: "portal", href: `/${locale}/portal`, label: t("portal"), Icon: UserCircle }
  ];

  function isActive(href: string) {
    if (href === `/${locale}`) return pathname === `/${locale}` || pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-thh-line bg-white md:hidden">
      <div className="flex">
        {tabs.map(({ key, href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={key}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5",
                active ? "tab-active" : "tab-inactive"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

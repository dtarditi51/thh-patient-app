"use client";

import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { Home, Stethoscope, MapPin, BookOpen, UserCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const t = useTranslations("nav");
  // Locale-agnostic pathname: "/doctors" in both languages. Comparing against a
  // hand-built `/${locale}/doctors` is what left every tab unhighlighted in English.
  const pathname = usePathname();

  const tabs = [
    { key: "home", href: "/", label: t("home"), Icon: Home },
    { key: "doctors", href: "/doctors", label: t("doctors"), Icon: Stethoscope },
    { key: "locations", href: "/locations", label: t("locations"), Icon: MapPin },
    { key: "learn", href: "/education", label: t("learn"), Icon: BookOpen },
    { key: "portal", href: "/portal", label: t("portal"), Icon: UserCircle },
    { key: "about", href: "/about", label: t("about"), Icon: Info }
  ];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
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
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5",
                active ? "tab-active" : "tab-inactive"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} aria-hidden="true" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

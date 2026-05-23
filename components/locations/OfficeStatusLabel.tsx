"use client";

import { useTranslations, useLocale } from "next-intl";
import { Clock } from "lucide-react";
import { nextOpenInfo, type OfficeHours } from "@/lib/officeHours";
import { useOfficeStatusTick } from "./OfficeStatusTickProvider";

export function OfficeStatusLabel({
  hours,
  variant = "inline"
}: {
  hours: OfficeHours;
  variant?: "inline" | "banner";
}) {
  const t = useTranslations("locations");
  const locale = useLocale();
  const now = useOfficeStatusTick();

  if (!now) {
    return variant === "banner" ? <div className="h-6" /> : <span className="text-xs text-thh-muted">&nbsp;</span>;
  }

  const info = nextOpenInfo(hours, now, locale);
  const isOpen = info.status === "open";

  let text: string;
  switch (info.status) {
    case "open":
      text = t("openUntil", { time: info.closeTime });
      break;
    case "closedOpensToday":
      text = t("closedOpensToday", { time: info.openTime });
      break;
    case "closedOpensTomorrow":
      text = t("closedOpensTomorrow", { time: info.openTime });
      break;
    case "closedOpensWeekday":
      text = t("closedOpensWeekday", { weekday: info.weekday, time: info.openTime });
      break;
    case "alwaysClosed":
      text = t("closed");
      break;
  }

  if (variant === "banner") {
    return (
      <div
        className={`flex items-center gap-2 rounded-xl p-3 text-sm ring-1 ${
          isOpen
            ? "bg-green-50 text-green-800 ring-green-200"
            : "bg-thh-surface text-thh-ink ring-thh-line"
        }`}
      >
        <Clock className="h-4 w-4" />
        <span>{text}</span>
      </div>
    );
  }

  return (
    <span className={`text-xs ${isOpen ? "text-green-700" : "text-thh-muted"}`}>{text}</span>
  );
}

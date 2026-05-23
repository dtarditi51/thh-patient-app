"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const LocationsMapImpl = dynamic(
  () => import("./LocationsMapImpl").then((m) => m.LocationsMapImpl),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 animate-pulse rounded-xl bg-thh-surface ring-1 ring-thh-line md:h-96" />
    )
  }
);

export function LocationsMap({ apiKey }: { apiKey: string | undefined }) {
  const t = useTranslations("locations");
  if (!apiKey) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-xl bg-thh-surface text-sm text-thh-muted ring-1 ring-thh-line">
        {t("mapUnavailable")}
      </div>
    );
  }
  return <LocationsMapImpl apiKey={apiKey} />;
}

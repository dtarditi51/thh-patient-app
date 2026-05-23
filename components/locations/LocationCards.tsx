"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { MapPin, Phone, Navigation2 } from "lucide-react";
import { locations } from "@/data/locations";
import { haversineMiles } from "@/lib/officeHours";
import { OfficeStatusLabel } from "./OfficeStatusLabel";

type GeoState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "granted"; coords: { lat: number; lng: number } }
  | { status: "denied" };

export function LocationCards() {
  const t = useTranslations("locations");
  const locale = useLocale();
  const [geo, setGeo] = useState<GeoState>({ status: "idle" });

  const sorted = useMemo(() => {
    if (geo.status !== "granted") {
      return locations.map((loc) => ({ loc, miles: null as number | null }));
    }
    return locations
      .map((loc) => ({ loc, miles: haversineMiles(geo.coords, { lat: loc.lat, lng: loc.lng }) }))
      .sort((a, b) => (a.miles ?? 0) - (b.miles ?? 0));
  }, [geo]);

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setGeo({ status: "denied" });
      return;
    }
    setGeo({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo({ status: "granted", coords: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
      () => setGeo({ status: "denied" }),
      { timeout: 10_000, maximumAge: 60_000 }
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        {geo.status === "granted" ? (
          <span className="text-xs text-thh-muted">{t("showNearMe")} ✓</span>
        ) : (
          <button
            type="button"
            onClick={requestLocation}
            disabled={geo.status === "locating"}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-thh-red ring-1 ring-thh-line hover:bg-thh-surface disabled:opacity-60"
          >
            <Navigation2 className="h-3.5 w-3.5" />
            {geo.status === "locating" ? t("locating") : t("showNearMe")}
          </button>
        )}
        {geo.status === "denied" && (
          <span className="text-[11px] text-thh-muted">{t("locationDenied")}</span>
        )}
      </div>

      <div className="space-y-2">
        {sorted.map(({ loc, miles }) => (
          <div
            key={loc.slug}
            className="relative rounded-xl bg-white p-4 ring-1 ring-thh-line hover:bg-thh-surface"
          >
            <Link
              href={`/${locale}/locations/${loc.slug}`}
              className="absolute inset-0 rounded-xl"
              aria-label={loc.name}
            />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-thh-red" />
                  <span className="text-sm font-medium">{loc.name}</span>
                  {miles !== null && (
                    <span className="pill bg-thh-red-50 text-thh-red-dark">
                      {t("distanceMiles", { distance: miles.toFixed(1) })}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs text-thh-muted">{loc.address}</div>
                <div className="text-xs text-thh-muted">{loc.city}, NJ {loc.zip}</div>
                <div className="mt-2">
                  <OfficeStatusLabel hours={loc.hours} />
                </div>
              </div>
              <a
                href={`tel:${loc.phone}`}
                className="relative z-10 flex flex-col items-end gap-1"
              >
                <Phone className="h-5 w-5 text-thh-red" />
                <span className="text-[11px] text-thh-muted">{loc.phone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

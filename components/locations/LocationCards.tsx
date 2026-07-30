"use client";

import { useMemo, useState } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Navigation2 } from "lucide-react";
import { locations, directionsUrl } from "@/data/locations";
import { haversineMiles } from "@/lib/officeHours";
import { track } from "@/lib/analytics";
import { OfficeStatusLabel } from "./OfficeStatusLabel";
import { OfficeStatusTickProvider } from "./OfficeStatusTickProvider";

type GeoState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "granted"; coords: { lat: number; lng: number } }
  | { status: "denied" };

export function LocationCards() {
  const t = useTranslations("locations");
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

      <OfficeStatusTickProvider>
        <div className="space-y-2">
          {sorted.map(({ loc, miles }) => (
            <div
              key={loc.slug}
              className="relative rounded-xl bg-white p-4 ring-1 ring-thh-line hover:bg-thh-surface"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 shrink-0 text-thh-red" aria-hidden="true" />
                    {/*
                      The whole card is tappable via after:inset-0 on this link
                      rather than a separate absolutely-positioned overlay <Link>.
                      The overlay version gave screen readers a bare "Haddon
                      Heights, link" and orphaned the address and open/closed
                      status from it. Here the link keeps its place in the reading
                      order and the pseudo-element carries the hit area.
                    */}
                    <Link
                      href={`/locations/${loc.slug}`}
                      className="text-sm font-medium after:absolute after:inset-0 after:rounded-xl"
                    >
                      {loc.name}
                    </Link>
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

                {/* z-10 lifts these above the card-wide pseudo-element hit area. */}
                <div className="relative z-10 flex shrink-0 flex-col items-stretch gap-1.5">
                  <a
                    href={`tel:${loc.phone}`}
                    onClick={() => track("tel_tap", { source: "location_list", office: loc.slug })}
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full bg-thh-red-50 px-3 text-xs font-medium text-thh-red"
                    aria-label={`${t("call")} ${loc.name}: ${loc.phone}`}
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {t("call")}
                  </a>
                  <a
                    href={directionsUrl(loc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track("directions_click", { source: "location_list", office: loc.slug })
                    }
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium text-thh-ink ring-1 ring-thh-line hover:bg-thh-surface"
                    aria-label={`${t("directions")} — ${loc.name}`}
                  >
                    <Navigation2 className="h-4 w-4" aria-hidden="true" />
                    {t("directions")}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </OfficeStatusTickProvider>
    </div>
  );
}

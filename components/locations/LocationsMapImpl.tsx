"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap
} from "@vis.gl/react-google-maps";
import { locations } from "@/data/locations";

const HEART_RED = "#C8102E";

function centroid(points: { lat: number; lng: number }[]): { lat: number; lng: number } {
  const sum = points.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 }
  );
  return { lat: sum.lat / points.length, lng: sum.lng / points.length };
}

function HeartPin() {
  return (
    <div
      className="relative flex h-10 w-10 items-center justify-center rounded-full"
      style={{
        backgroundColor: HEART_RED,
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        border: "2px solid white"
      }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white" aria-hidden="true">
        <path d="M12 21s-7-4.35-9.5-9C1.05 9.5 2.5 6 6 6c1.74 0 3.41 1 4 2.35C10.59 7 12.26 6 14 6c3.5 0 4.95 3.5 3.5 6-2.5 4.65-9.5 9-9.5 9z" />
      </svg>
    </div>
  );
}

function MapRecenter() {
  // Kept for future use (re-center when user grants geolocation). Currently passive.
  useMap();
  return null;
}

export function LocationsMapImpl({ apiKey }: { apiKey: string }) {
  const t = useTranslations("locations");
  const locale = useLocale();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const center = centroid(locations.map((l) => ({ lat: l.lat, lng: l.lng })));
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "thh_locations_map";

  return (
    <APIProvider apiKey={apiKey}>
      <div className="overflow-hidden rounded-xl ring-1 ring-thh-line">
        <Map
          mapId={mapId}
          defaultCenter={center}
          defaultZoom={10}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="h-72 w-full md:h-96"
        >
          <MapRecenter />
          {locations.map((loc) => (
            <AdvancedMarker
              key={loc.slug}
              position={{ lat: loc.lat, lng: loc.lng }}
              onClick={() => setActiveSlug(loc.slug)}
              title={loc.name}
            >
              <HeartPin />
            </AdvancedMarker>
          ))}
          {activeSlug && (() => {
            const loc = locations.find((l) => l.slug === activeSlug);
            if (!loc) return null;
            return (
              <InfoWindow
                position={{ lat: loc.lat, lng: loc.lng }}
                onCloseClick={() => setActiveSlug(null)}
                pixelOffset={[0, -40]}
              >
                <div className="min-w-[180px] space-y-1 text-sm">
                  <div className="font-medium text-thh-ink">{loc.name}</div>
                  <div className="text-xs text-thh-muted">
                    {loc.address}
                    <br />
                    {loc.city}, {loc.state} {loc.zip}
                  </div>
                  <a href={`tel:${loc.phone}`} className="block text-xs font-medium text-thh-red">
                    {loc.phone}
                  </a>
                  <Link
                    href={`/${locale}/locations/${loc.slug}`}
                    className="inline-block pt-1 text-xs font-medium text-thh-red"
                  >
                    {t("viewDetails")} →
                  </Link>
                </div>
              </InfoWindow>
            );
          })()}
        </Map>
      </div>
    </APIProvider>
  );
}

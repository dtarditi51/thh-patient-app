"use client";

import { locations } from "@/data/locations";

// SVG placeholder map. Swap for react-map-gl + Mapbox or @vis.gl/react-google-maps
// before production launch. Coordinates here are normalized to SVG space.
export function LocationsMap() {
  const minLat = 39.4, maxLat = 40.0, minLng = -75.2, maxLng = -74.8;
  const w = 700, h = 280;

  function project(lat: number, lng: number) {
    const x = ((lng - minLng) / (maxLng - minLng)) * w;
    const y = h - ((lat - minLat) / (maxLat - minLat)) * h;
    return { x, y };
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-emerald-50 ring-1 ring-thh-line">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-48 w-full md:h-64">
        <rect width={w} height={h} fill="#E8F0E8" />
        <path d="M 0 100 Q 200 80 400 110 T 700 130" stroke="#A8C8A8" strokeWidth={1.5} fill="none" />
        <path d="M 0 180 Q 200 160 400 200 T 700 220" stroke="#A8C8A8" strokeWidth={1.5} fill="none" />
        {locations.map((loc) => {
          const { x, y } = project(loc.lat, loc.lng);
          return (
            <g key={loc.slug}>
              <circle cx={x} cy={y} r={11} fill="#C8102E" stroke="white" strokeWidth={2} />
              <text x={x} y={y + 4} fontSize={10} fontWeight={500} fill="white" textAnchor="middle">
                {loc.name[0]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

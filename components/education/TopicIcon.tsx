"use client";

import {
  Activity,
  Zap,
  Droplet,
  Gauge,
  HeartCrack,
  Heart,
  HeartHandshake,
  Footprints,
  type LucideIcon
} from "lucide-react";

// Explicit map, not `import * as Icons from "lucide-react"`.
//
// The barrel import pulled the entire lucide icon set into a "use client"
// component that renders on the home page, the education index, AND every
// education detail page — the largest avoidable bundle cost in the app. This
// mirrors the pattern already used correctly by the ICONS const in
// app/[locale]/(shell)/procedures/page.tsx.
//
// Keys must match the `icon` values in data/education.ts.
//
// NOTE: data/education.ts specifies "ShieldHeart" for the prevention topic, but
// that icon does not exist in this version of lucide-react. The old barrel
// lookup silently fell through to Heart, so prevention has always rendered a
// plain Heart — the same icon as another topic. Mapping it to Heart here keeps
// the rendering identical. If you want the shield the name implies, ShieldCheck
// exists and is already used on the portal page.
const ICONS: Record<string, LucideIcon> = {
  Activity,
  Zap,
  Droplet,
  Gauge,
  HeartCrack,
  Heart,
  HeartHandshake,
  Footprints,
  ShieldHeart: Heart
};

const colorMap: Record<string, string> = {
  red: "#C8102E",
  blue: "#185FA5",
  green: "#3B6D11",
  purple: "#534AB7",
  teal: "#0F6E56",
  pink: "#993556",
  amber: "#BA7517",
  rose: "#A32D2D"
};

export function TopicIcon({
  name,
  color,
  size = 24
}: {
  name: string;
  color: string;
  size?: number;
}) {
  const Icon = ICONS[name] ?? Heart;
  return (
    <Icon
      color={colorMap[color] ?? "#C8102E"}
      size={size}
      strokeWidth={1.75}
      aria-hidden="true"
    />
  );
}

"use client";

import * as Icons from "lucide-react";

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

export function TopicIcon({ name, color, size = 24 }: { name: string; color: string; size?: number }) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ color?: string; size?: number; strokeWidth?: number }>>)[name] || Icons.Heart;
  return <Icon color={colorMap[color] ?? "#C8102E"} size={size} strokeWidth={1.75} />;
}

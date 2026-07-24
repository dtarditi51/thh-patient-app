import { Star, Stethoscope, MapPin, Building2 } from "lucide-react";

type IconKey = "star" | "docs" | "map" | "hospital";

const ICONS: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  star: Star,
  docs: Stethoscope,
  map: MapPin,
  hospital: Building2
};

export function TrustBadge({
  value,
  label,
  icon,
  size = "default"
}: {
  value: string;
  label: string;
  icon: IconKey;
  size?: "default" | "large";
}) {
  const isLarge = size === "large";

  if (!isLarge) {
    return (
      <div className="rounded-xl bg-white p-3 ring-1 ring-thh-line">
        <div className="flex items-center gap-1.5">
          {icon === "star" && <Star className="h-4 w-4 fill-thh-red text-thh-red" />}
          <div className="text-base font-medium text-thh-ink">{value}</div>
        </div>
        <div className="mt-1 text-[11px] leading-tight text-thh-muted">{label}</div>
      </div>
    );
  }

  const Icon = ICONS[icon];
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-thh-line">
      <div className="flex items-center gap-2">
        <Icon className={icon === "star" ? "h-5 w-5 fill-thh-red text-thh-red" : "h-5 w-5 text-thh-red"} />
        <div className="text-2xl font-medium text-thh-ink md:text-3xl">{value}</div>
      </div>
      <div className="mt-1.5 text-sm leading-tight text-thh-muted">{label}</div>
    </div>
  );
}

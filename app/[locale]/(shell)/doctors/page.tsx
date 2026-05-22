"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Search } from "lucide-react";
import { providers, subspecialtyLabels, type Subspecialty } from "@/data/providers";
import { locations } from "@/data/locations";
import { ProviderCard } from "@/components/doctors/ProviderCard";

export default function DoctorsPage() {
  const t = useTranslations("doctors");
  const locale = useLocale();
  const lang = locale as "en" | "es";

  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [specFilter, setSpecFilter] = useState<Subspecialty | "all">("all");

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      if (locationFilter !== "all" && !p.locations.includes(locationFilter)) return false;
      if (specFilter !== "all" && !p.subspecialties.includes(specFilter)) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, locationFilter, specFilter]);

  return (
    <div className="container-app space-y-4 py-4">
      <div>
        <h1 className="text-2xl font-medium">{t("title")}</h1>
        <p className="text-sm text-thh-muted">{t("count", { count: providers.length })}</p>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-thh-line">
        <Search className="h-4 w-4 text-thh-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Chip label={t("filterAll")} active={locationFilter === "all"} onClick={() => setLocationFilter("all")} />
        {locations.map((loc) => (
          <Chip key={loc.slug} label={loc.name} active={locationFilter === loc.slug} onClick={() => setLocationFilter(loc.slug)} />
        ))}
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Chip label={t("filterSpecialty")} active={specFilter === "all"} onClick={() => setSpecFilter("all")} />
        {(Object.keys(subspecialtyLabels) as Subspecialty[]).map((s) => (
          <Chip key={s} label={subspecialtyLabels[s][lang]} active={specFilter === s} onClick={() => setSpecFilter(s)} />
        ))}
      </div>

      <ul className="space-y-2">
        {filtered.map((p) => (
          <li key={p.slug}>
            <ProviderCard provider={p} locale={locale} acceptingNewLabel={t("acceptingNew")} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${active ? "bg-thh-red text-white" : "bg-white text-thh-ink ring-1 ring-thh-line"}`}
    >
      {label}
    </button>
  );
}

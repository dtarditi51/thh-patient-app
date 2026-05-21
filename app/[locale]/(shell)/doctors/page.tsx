"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Search, Calendar, Star } from "lucide-react";
import { providers, subspecialtyLabels, type Subspecialty } from "@/data/providers";
import { locations } from "@/data/locations";

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
            <Link
              href={`/${locale}/doctors/${p.slug}`}
              className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-thh-line hover:bg-thh-surface"
            >
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-thh-red-50">
                {p.photoUrl ? (
                  <Image src={p.photoUrl} alt={p.name} fill className="object-cover" sizes="56px" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-sm font-medium text-thh-red">
                    {p.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{p.name}, {p.credentials}</div>
                <div className="truncate text-xs text-thh-muted">
                  {p.subspecialties.map((s) => subspecialtyLabels[s][lang]).join(" · ")}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  {p.rater8Score && (
                    <span className="inline-flex items-center gap-0.5 text-xs text-thh-muted">
                      <Star className="h-3 w-3 fill-thh-red text-thh-red" />
                      {p.rater8Score.toFixed(1)} ({p.rater8Count})
                    </span>
                  )}
                  {p.acceptingNew && <span className="pill bg-green-50 text-green-800">{t("acceptingNew")}</span>}
                </div>
              </div>
              <Calendar className="h-5 w-5 text-thh-red" />
            </Link>
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

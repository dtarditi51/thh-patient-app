import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Clock } from "lucide-react";
import { locations, hospitals } from "@/data/locations";
import { isOpenNow } from "@/lib/utils";
import { LocationsMap } from "@/components/locations/LocationsMap";

export default async function LocationsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("locations");

  return (
    <div className="container-app space-y-6 py-4">
      <div>
        <h1 className="text-2xl font-medium">{t("title")}</h1>
        <p className="text-sm text-thh-muted">{t("subtitle")}</p>
      </div>

      <LocationsMap />

      <div className="space-y-2">
        {locations.map((loc) => {
          const status = isOpenNow(loc.hours);
          return (
            <Link key={loc.slug} href={`/${locale}/locations/${loc.slug}`} className="block rounded-xl bg-white p-4 ring-1 ring-thh-line hover:bg-thh-surface">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-thh-red" />
                    <span className="text-sm font-medium">{loc.name}</span>
                  </div>
                  <div className="mt-1 text-xs text-thh-muted">{loc.address}</div>
                  <div className="text-xs text-thh-muted">{loc.city}, NJ {loc.zip}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span className={`text-xs ${status.open ? "text-green-700" : "text-thh-muted"}`}>
                      {status.open ? t("openUntil", { time: status.closesAt || "5:00 PM" }) : t("closed")}
                    </span>
                  </div>
                </div>
                <a href={`tel:${loc.phone}`} className="flex flex-col items-end gap-1">
                  <Phone className="h-5 w-5 text-thh-red" />
                  <span className="text-[11px] text-thh-muted">{loc.phone}</span>
                </a>
              </div>
            </Link>
          );
        })}
      </div>

      <section>
        <h2 className="mb-3 text-base font-medium">Hospital affiliations</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {hospitals.map((h) => (
            <a key={h.name} href={h.url} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white p-3 text-sm ring-1 ring-thh-line hover:bg-thh-surface">
              <div className="font-medium">{h.name}</div>
              <div className="text-xs text-thh-muted">{h.system}</div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

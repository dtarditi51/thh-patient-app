import { getTranslations, setRequestLocale } from "next-intl/server";
import { hospitals } from "@/data/locations";
import { LocationsMap } from "@/components/locations/LocationsMap";
import { LocationCards } from "@/components/locations/LocationCards";

export default async function LocationsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("locations");

  return (
    <div className="container-app space-y-6 py-4">
      <div>
        <h1 className="text-2xl font-medium">{t("title")}</h1>
        <p className="text-sm text-thh-muted">{t("subtitle")}</p>
      </div>

      <LocationsMap apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} />

      <LocationCards />

      <section>
        <h2 className="mb-3 text-base font-medium">{t("hospitalAffiliations")}</h2>
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

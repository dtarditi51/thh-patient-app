import { getTranslations } from "next-intl/server";
import { HandHeart } from "lucide-react";

// Original practice-designed infographic. Facts summarized in our own words;
// never embed or reproduce the ACC/CardioSmart infographic itself.
const TILE_KEYS = ["rate", "prevalence", "onset", "cure"] as const;

export async function SVTInfographic() {
  const t = await getTranslations("education.svtInfographic");

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {TILE_KEYS.map((key) => (
          <div key={key} className="rounded-xl border-t-2 border-thh-red bg-white p-3 ring-1 ring-thh-line">
            <div className="text-base font-semibold leading-snug">{t(`${key}Value`)}</div>
            <div className="mt-1 text-xs text-thh-muted">{t(`${key}Label`)}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-thh-surface p-4 ring-1 ring-thh-line">
        <h3 className="mb-1.5 flex items-center gap-2 text-sm font-medium">
          <HandHeart className="h-4 w-4 text-thh-red" />
          {t("calloutTitle")}
        </h3>
        <p className="text-sm leading-relaxed text-thh-ink">{t("calloutBody")}</p>
      </div>
    </section>
  );
}

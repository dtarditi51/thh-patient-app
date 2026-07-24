import { Star, ChevronDown } from "lucide-react";
import { GoogleG } from "./GoogleG";
import type { PlaceDetailsResult } from "@/lib/googlePlaces";

// Compact rating + count + in-page "See all" anchor. Renders nothing when
// Place Details are unavailable so we don't dangle a "Patient reviews" heading
// over an empty state.
export function ReviewsSummaryBadge({
  result,
  seeAllLabel,
  countLabel,
  targetId
}: {
  result: PlaceDetailsResult | null;
  seeAllLabel: string;
  countLabel: (count: number) => string;
  targetId: string;
}) {
  if (!result || result.rating == null) return null;
  const rating = result.rating;
  const total = result.user_ratings_total ?? 0;

  return (
    <a
      href={`#${targetId}`}
      className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-thh-line transition-colors hover:bg-thh-surface"
    >
      <div className="flex items-center gap-3">
        <GoogleG />
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-medium">{rating.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? "fill-amber-500 text-amber-500" : "text-thh-line"}`}
                />
              ))}
            </div>
          </div>
          <div className="text-xs text-thh-muted">{countLabel(total)}</div>
        </div>
      </div>
      <span className="inline-flex items-center gap-1 text-xs font-medium text-thh-red">
        {seeAllLabel}
        <ChevronDown className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}

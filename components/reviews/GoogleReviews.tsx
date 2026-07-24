import { Star } from "lucide-react";
import { GoogleG } from "./GoogleG";
import { fetchPlaceDetails, type PlaceDetailsResult } from "@/lib/googlePlaces";

export async function GoogleReviews({
  placeId,
  result: prefetched,
  heading,
  emptyLabel,
  attribution,
  limit = 3
}: {
  placeId: string;
  // When the page has already fetched Place Details (e.g. to render a summary
  // badge above the fold), pass the result in to skip the second fetch.
  result?: PlaceDetailsResult | null;
  heading?: string;
  emptyLabel: string;
  attribution: string;
  limit?: number;
}) {
  const result = prefetched !== undefined ? prefetched : await fetchPlaceDetails(placeId);

  return (
    <div className="space-y-3">
      {heading && (
        <div className="flex items-center gap-2">
          <GoogleG />
          <h3 className="text-base font-medium">{heading}</h3>
        </div>
      )}

      {!result ? (
        <p className="text-xs text-thh-muted">{emptyLabel}</p>
      ) : (
        <>
          <div className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-thh-line">
            <div className="flex items-center gap-3">
              <GoogleG />
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-medium">{(result.rating ?? 0).toFixed(1)}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i <= Math.round(result.rating ?? 0) ? "fill-amber-500 text-amber-500" : "text-thh-line"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-thh-muted">{result.user_ratings_total ?? 0} Google reviews</div>
              </div>
            </div>
            {result.url && (
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-thh-red">
                View all →
              </a>
            )}
          </div>

          <div className="space-y-2">
            {(result.reviews ?? [])
              .filter((r) => r.text?.trim())
              .slice(0, limit)
              .map((r, i) => (
              <div key={i} className="rounded-xl bg-white p-3 ring-1 ring-thh-line">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Star
                      key={j}
                      className={`h-3 w-3 ${j <= r.rating ? "fill-amber-500 text-amber-500" : "text-thh-line"}`}
                    />
                  ))}
                  <span className="ml-1 text-xs text-thh-muted">{r.relative_time_description}</span>
                </div>
                <p className="mt-1.5 line-clamp-3 text-sm">{r.text}</p>
                <p className="mt-1 text-xs text-thh-muted">— {r.author_name}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="text-[11px] text-thh-muted">{attribution}</p>
    </div>
  );
}

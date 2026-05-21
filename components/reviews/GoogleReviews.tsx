"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

type GoogleReview = { rating: number; text: string; authorName: string; relativeTime: string };
type GooglePayload = { rating: number; userRatingsTotal: number; reviews: GoogleReview[]; placeUrl: string };

export function GoogleReviews({ placeIdEnvKey }: { placeIdEnvKey: string }) {
  const [data, setData] = useState<GooglePayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reviews/google?key=${placeIdEnvKey}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [placeIdEnvKey]);

  if (loading) return <div className="text-xs text-thh-muted">Loading Google reviews…</div>;
  if (!data) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-thh-line">
        <div className="flex items-center gap-3">
          <GoogleG />
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-medium">{data.rating.toFixed(1)}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(data.rating) ? "fill-amber-500 text-amber-500" : "text-thh-line"}`} />
                ))}
              </div>
            </div>
            <div className="text-xs text-thh-muted">{data.userRatingsTotal} Google reviews</div>
          </div>
        </div>
        <a href={data.placeUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-thh-red">
          View all →
        </a>
      </div>
      <div className="space-y-2">
        {data.reviews.slice(0, 3).map((r, i) => (
          <div key={i} className="rounded-xl bg-white p-3 ring-1 ring-thh-line">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((j) => (
                <Star key={j} className={`h-3 w-3 ${j <= r.rating ? "fill-amber-500 text-amber-500" : "text-thh-line"}`} />
              ))}
              <span className="ml-1 text-xs text-thh-muted">{r.relativeTime}</span>
            </div>
            <p className="mt-1.5 line-clamp-3 text-sm">{r.text}</p>
            <p className="mt-1 text-xs text-thh-muted">— {r.authorName}</p>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-thh-muted">Reviews powered by Google. Attribution required per Google API terms.</p>
    </div>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-label="Google">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4c-.2 1.3-1 2.4-2.1 3.1v2.5h3.4c2-1.8 3.2-4.6 3.2-7.5z" />
      <path fill="#34A853" d="M12 22c2.9 0 5.3-1 7-2.6l-3.4-2.5c-1 .6-2.2 1-3.6 1-2.8 0-5.1-1.9-5.9-4.4H2.6v2.6C4.3 19.5 7.9 22 12 22z" />
      <path fill="#FBBC05" d="M6.1 13.4c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V6.8H2.6C1.9 8.4 1.5 10.1 1.5 12s.4 3.6 1.1 5.2l3.5-3.8z" />
      <path fill="#EA4335" d="M12 5.6c1.6 0 3 .6 4.1 1.6l3-3C17.3 2.6 14.9 1.5 12 1.5c-4.1 0-7.7 2.5-9.4 6.3l3.5 2.6C7 7.4 9.2 5.6 12 5.6z" />
    </svg>
  );
}

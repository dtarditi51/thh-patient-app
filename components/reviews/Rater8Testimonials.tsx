"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

type Review = { rating: number; text: string; author: string; date: string };

export function Rater8Testimonials({ providerSlug, providerName }: { providerSlug: string; providerName: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState<number | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reviews/rater8?provider=${providerSlug}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setAvg(data.average ?? null);
        setCount(data.count ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [providerSlug]);

  if (loading) return <div className="text-xs text-thh-muted">Loading reviews…</div>;
  if (!reviews.length && !avg) return <div className="text-xs text-thh-muted">Verified reviews coming soon for Dr. {providerName.split(" ").slice(-1)}.</div>;

  return (
    <div className="space-y-3">
      {avg !== null && (
        <div className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-thh-line">
          <div className="text-2xl font-medium">{avg.toFixed(1)}</div>
          <div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`h-4 w-4 ${i <= Math.round(avg) ? "fill-thh-red text-thh-red" : "text-thh-line"}`} />
              ))}
            </div>
            <div className="text-xs text-thh-muted">Based on {count} verified patient reviews</div>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-xl bg-white p-3 ring-1 ring-thh-line">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((j) => (
                <Star key={j} className={`h-3 w-3 ${j <= r.rating ? "fill-thh-red text-thh-red" : "text-thh-line"}`} />
              ))}
              <span className="ml-1 text-xs text-thh-muted">{r.date}</span>
            </div>
            <p className="mt-1.5 text-sm text-thh-ink">"{r.text}"</p>
            <p className="mt-1 text-xs text-thh-muted">— {r.author}</p>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-thh-muted">Verified by Rater8 from post-visit surveys. HIPAA-compliant.</p>
    </div>
  );
}

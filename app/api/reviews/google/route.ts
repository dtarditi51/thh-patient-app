import { NextRequest, NextResponse } from "next/server";

// Google Places Details API. Cache for 1 day to stay within quota.
export const revalidate = 86400;

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing place ID env key" }, { status: 400 });

  const placeId = process.env[key];
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!placeId || !apiKey) return NextResponse.json({ error: "Place ID or API key not configured" }, { status: 500 });

  const fields = "rating,user_ratings_total,reviews,url";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}&reviews_sort=newest&reviews_no_translations=true`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    if (data.status !== "OK") return NextResponse.json({ error: data.status }, { status: 500 });

    return NextResponse.json({
      rating: data.result.rating ?? 0,
      userRatingsTotal: data.result.user_ratings_total ?? 0,
      placeUrl: data.result.url ?? "",
      reviews: (data.result.reviews || []).map((r: { rating: number; text: string; author_name: string; relative_time_description: string }) => ({
        rating: r.rating,
        text: r.text,
        authorName: r.author_name,
        relativeTime: r.relative_time_description
      }))
    });
  } catch (err) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

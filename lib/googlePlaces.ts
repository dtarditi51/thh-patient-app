// Shared Google Places Details fetcher. Lifting this out of GoogleReviews
// lets a page fetch once and pass the same result into both a summary badge
// and the full reviews list without a second network round-trip.

export type GoogleReview = {
  rating: number;
  text: string;
  author_name: string;
  relative_time_description: string;
};

export type PlaceDetailsResult = {
  rating?: number;
  user_ratings_total?: number;
  url?: string;
  reviews?: GoogleReview[];
};

type PlaceDetailsResponse = {
  status: string;
  result?: PlaceDetailsResult;
};

export async function fetchPlaceDetails(placeId: string): Promise<PlaceDetailsResult | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || !placeId) return null;
  const fields = "rating,user_ratings_total,reviews,url";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${fields}&key=${apiKey}&reviews_sort=newest&reviews_no_translations=true`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data: PlaceDetailsResponse = await res.json();
    if (data.status !== "OK" || !data.result) return null;
    return data.result;
  } catch {
    return null;
  }
}

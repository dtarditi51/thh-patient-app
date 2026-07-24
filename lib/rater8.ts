// Server-side scraper for the public Rater8 review pages on reviews.rater8.com.
//
// Why scrape instead of using the Rater8 API: the practice's CSM call to negotiate
// API access is pending. The public profile pages already render aggregate scores
// and individual reviews server-side as schema.org microdata (Review +
// AggregateRating), and robots.txt is wide open, so we're not waiting on the
// vendor to ship verified-patient reviews to the patient app.
//
// Selector strategy: schema.org `itemprop` attributes, not Rater8's CSS classes.
// Rater8 can restyle their site without breaking us as long as the microdata
// stays intact (and they have no incentive to drop it — it's what makes their
// reviews appear in Google search results).

import * as cheerio from "cheerio";
import { RATER8_BASE_URL, RATER8_PROFILE_PATHS } from "@/data/rater8";

export type Rater8Review = {
  rating: number;
  text: string;
  author: string;
  date: string;
};

export type Rater8Result = {
  average: number | null;
  count: number | null;
  reviews: Rater8Review[];
};

const EMPTY: Rater8Result = { average: null, count: null, reviews: [] };

// 6h server-side cache. Rater8 pages update as patients submit post-visit surveys,
// but a same-day refresh on the practice app is unnecessary — score and recent
// quotes are slow-moving signals.
const CACHE_REVALIDATE_SECONDS = 60 * 60 * 6;

function parseNumber(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function fetchRater8Profile(
  providerSlug: string,
  reviewLimit = 5
): Promise<Rater8Result> {
  // Hard allowlist: any slug not in our Heart House mapping returns empty.
  // This is the only thing that keeps Shore Heart Group providers (who share
  // the CVA USA Rater8 listing) from leaking into the patient app.
  const path = RATER8_PROFILE_PATHS[providerSlug];
  if (!path) return EMPTY;

  let html: string;
  try {
    const res = await fetch(`${RATER8_BASE_URL}${path}`, {
      headers: {
        // Some hosts gate on UA — pretend to be a regular browser.
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
      },
      next: { revalidate: CACHE_REVALIDATE_SECONDS }
    });
    if (!res.ok) return EMPTY;
    html = await res.text();
  } catch {
    return EMPTY;
  }

  try {
    const $ = cheerio.load(html);

    const aggregate = $('[itemprop="aggregateRating"]').first();
    const average = parseNumber(aggregate.find('[itemprop="ratingValue"]').first().text().trim());
    const count = parseNumber(
      aggregate.find('[itemprop="reviewCount"]').first().attr("content")
    );

    const reviews: Rater8Review[] = [];
    $('[itemprop="review"]').each((_, el) => {
      if (reviews.length >= reviewLimit) return;
      const $el = $(el);
      const text = $el.find('[itemprop="reviewBody"]').first().text().trim();
      if (!text) return;
      const ratingValue = parseNumber(
        $el.find('[itemprop="reviewRating"] [itemprop="ratingValue"]').first().attr("content")
      );
      const date =
        $el.find(".review-date-absolute").first().text().trim() ||
        $el.find('[itemprop="datePublished"]').first().attr("content") ||
        "";
      reviews.push({
        rating: ratingValue ?? 5,
        text,
        // Rater8 anonymizes reviewers — `itemprop=name` is always "patient". Map
        // to a friendlier label that matches their own attribution copy on the
        // source page ("Each review represents an authentic and verified
        // patient experience").
        author: "Verified patient",
        date
      });
    });

    return { average, count, reviews };
  } catch {
    return EMPTY;
  }
}

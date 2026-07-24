import { NextRequest, NextResponse } from "next/server";
import { fetchRater8Profile } from "@/lib/rater8";

// Public Rater8 reviews for our cardiologists. We scrape the SSR'd profile pages
// at reviews.rater8.com (rather than the vendor API) so the patient app doesn't
// depend on the still-pending CSM contract. The provider-slug → profile-path
// allowlist in data/rater8.ts is the trust boundary; this route just forwards.

export const revalidate = 21600; // 6h

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("provider");
  if (!slug) {
    return NextResponse.json({ error: "Missing provider slug" }, { status: 400 });
  }
  const data = await fetchRater8Profile(slug);
  return NextResponse.json(data);
}

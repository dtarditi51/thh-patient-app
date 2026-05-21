import { NextRequest, NextResponse } from "next/server";

// Rater8 API integration stub. Replace with real Rater8 endpoint once CSM provides:
//   - API token (or per-provider widget IDs for iframe embed fallback)
//   - Provider slug → Rater8 provider ID mapping
// Rater8 typically offers either a REST API for testimonials or embeddable widgets.
// Decide with vendor: API gives more control; widget is faster to ship.

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("provider");
  if (!slug) return NextResponse.json({ error: "Missing provider slug" }, { status: 400 });

  const token = process.env.RATER8_API_TOKEN;
  if (!token) {
    // Dev fallback: return empty so UI shows the "coming soon" placeholder.
    return NextResponse.json({ reviews: [], average: null, count: null });
  }

  // Placeholder: hit Rater8 API once endpoint and provider ID mapping is confirmed.
  // const r = await fetch(`https://api.rater8.com/v1/providers/${rater8Id}/reviews`, {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  return NextResponse.json({ reviews: [], average: null, count: null });
}

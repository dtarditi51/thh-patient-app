import { NextRequest, NextResponse } from "next/server";

// Receives Web Push subscriptions. Stores them in your backend.
// For v1, log only. Wire to Firestore or your DB later.

export async function POST(req: NextRequest) {
  try {
    const sub = await req.json();
    console.log("[push] new subscription:", JSON.stringify(sub).slice(0, 200));
    // TODO: persist subscription with user id / locale / categories opted in
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }
}

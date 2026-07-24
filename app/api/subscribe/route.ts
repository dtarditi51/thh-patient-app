import { NextRequest, NextResponse } from "next/server";
import { redis, FCM_SUBSCRIPTIONS_KEY } from "@/lib/redis";

// Receives FCM registration tokens from clients that opted in to push.
// Stores them in a Redis hash keyed by token, value is JSON metadata.
// Schema: HSET fcm:subscriptions <token> '{"locale":"en","optedInAt":"..."}'
// Send path (later): HGETALL → multicast via firebase-admin.

type SubscribeBody = {
  token: string;
  locale?: "en" | "es";
};

type Metadata = {
  locale: "en" | "es";
  optedInAt: string;
  userAgent?: string;
};

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: SubscribeBody;
  try {
    body = (await req.json()) as SubscribeBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = body.token?.trim();
  if (!token || token.length < 32 || token.length > 4096) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const locale = body.locale === "es" ? "es" : "en";
  const metadata: Metadata = {
    locale,
    optedInAt: new Date().toISOString(),
    userAgent: req.headers.get("user-agent") ?? undefined
  };

  await redis.hset(FCM_SUBSCRIPTIONS_KEY, { [token]: JSON.stringify(metadata) });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  let body: { token?: string };
  try {
    body = (await req.json()) as { token?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const token = body.token?.trim();
  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
  await redis.hdel(FCM_SUBSCRIPTIONS_KEY, token);
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getAdminMessaging } from "@/lib/firebaseAdmin";
import { redis, FCM_SUBSCRIPTIONS_KEY } from "@/lib/redis";
import type { MulticastMessage } from "firebase-admin/messaging";

// Admin-only fanout to all subscribed FCM tokens. Groups tokens by stored
// locale and sends a localized notification per group. Dead tokens (unregistered
// or invalid) are pruned from Redis in the same pass.
//
// Auth: Bearer PUSH_ADMIN_TOKEN. The token never lands in logs.
// Per FCM limits, multicast fan-out is chunked at 500 tokens per call.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LocalePayload = { title: string; body: string };

type SendBody = {
  en: LocalePayload;
  es: LocalePayload;
  url?: string;
  data?: Record<string, string>;
};

type StoredMetadata = { locale?: "en" | "es" };

type LocaleResult = {
  attempted: number;
  successCount: number;
  failureCount: number;
};

const MULTICAST_CHUNK = 500;
const DEAD_TOKEN_CODES = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
  "messaging/invalid-argument"
]);

function authorize(req: NextRequest): boolean {
  const expected = process.env.PUSH_ADMIN_TOKEN;
  if (!expected) return false;
  const header = req.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  const provided = match[1].trim();
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function validatePayload(input: unknown): SendBody | null {
  if (!input || typeof input !== "object") return null;
  const obj = input as Record<string, unknown>;
  const en = obj.en as Partial<LocalePayload> | undefined;
  const es = obj.es as Partial<LocalePayload> | undefined;
  if (!en?.title || !en?.body || !es?.title || !es?.body) return null;
  const url = typeof obj.url === "string" ? obj.url : undefined;
  const data =
    obj.data && typeof obj.data === "object"
      ? (Object.fromEntries(
          Object.entries(obj.data as Record<string, unknown>).filter(
            ([, v]) => typeof v === "string"
          )
        ) as Record<string, string>)
      : undefined;
  return {
    en: { title: en.title, body: en.body },
    es: { title: es.title, body: es.body },
    url,
    data
  };
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = validatePayload(raw);
  if (!payload) {
    return NextResponse.json(
      { error: "Body must include en {title, body} and es {title, body}" },
      { status: 400 }
    );
  }

  const all = (await redis.hgetall<Record<string, string | StoredMetadata>>(
    FCM_SUBSCRIPTIONS_KEY
  )) ?? {};

  const buckets: Record<"en" | "es", string[]> = { en: [], es: [] };
  for (const [token, metaRaw] of Object.entries(all)) {
    let locale: "en" | "es" = "en";
    try {
      const meta =
        typeof metaRaw === "string"
          ? (JSON.parse(metaRaw) as StoredMetadata)
          : metaRaw;
      if (meta?.locale === "es") locale = "es";
    } catch {
      // Malformed metadata defaults to English.
    }
    buckets[locale].push(token);
  }

  const totalSubscribers = buckets.en.length + buckets.es.length;
  if (totalSubscribers === 0) {
    return NextResponse.json({
      ok: true,
      sent: 0,
      failed: 0,
      removed: 0,
      perLocale: {
        en: { attempted: 0, successCount: 0, failureCount: 0 },
        es: { attempted: 0, successCount: 0, failureCount: 0 }
      }
    });
  }

  const messaging = getAdminMessaging();
  const deadTokens: string[] = [];
  const perLocale: Record<"en" | "es", LocaleResult> = {
    en: { attempted: buckets.en.length, successCount: 0, failureCount: 0 },
    es: { attempted: buckets.es.length, successCount: 0, failureCount: 0 }
  };

  for (const locale of ["en", "es"] as const) {
    const tokens = buckets[locale];
    if (tokens.length === 0) continue;
    const { title, body } = payload[locale];
    const data: Record<string, string> = {
      ...(payload.data ?? {}),
      ...(payload.url ? { url: payload.url } : {}),
      locale
    };

    for (const batch of chunk(tokens, MULTICAST_CHUNK)) {
      const message: MulticastMessage = {
        tokens: batch,
        notification: { title, body },
        data,
        webpush: {
          notification: { title, body, icon: "/icon-192.png" },
          fcmOptions: payload.url ? { link: payload.url } : undefined
        }
      };
      const result = await messaging.sendEachForMulticast(message);
      perLocale[locale].successCount += result.successCount;
      perLocale[locale].failureCount += result.failureCount;
      result.responses.forEach((resp, idx) => {
        if (!resp.success && resp.error) {
          const code = resp.error.code;
          if (DEAD_TOKEN_CODES.has(code)) deadTokens.push(batch[idx]);
        }
      });
    }
  }

  let removed = 0;
  if (deadTokens.length > 0) {
    removed = (await redis.hdel(FCM_SUBSCRIPTIONS_KEY, ...deadTokens)) ?? 0;
  }

  const sent = perLocale.en.successCount + perLocale.es.successCount;
  const failed = perLocale.en.failureCount + perLocale.es.failureCount;

  return NextResponse.json({
    ok: true,
    sent,
    failed,
    removed,
    perLocale
  });
}

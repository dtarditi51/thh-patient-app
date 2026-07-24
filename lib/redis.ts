import { Redis } from "@upstash/redis";

// Upstash Redis via Vercel Marketplace provisions KV_REST_API_URL/TOKEN
// rather than the SDK's default UPSTASH_REDIS_REST_URL/TOKEN. Constructing
// explicitly keeps both naming conventions working.
export const redis = new Redis({
  url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN!
});

export const FCM_SUBSCRIPTIONS_KEY = "fcm:subscriptions";

"use client";

import { track as vercelTrack } from "@vercel/analytics";

// The ONLY place the analytics vendor is named. Every call site imports `track`
// from here, so swapping Vercel Analytics for Plausible (or anything else) is a
// change to this file alone rather than a hunt across a dozen components.
//
// Vendor-swap triggers, per the launch plan:
//   1. We build an in-app appointment request. A URL carrying provider + topic
//      tied to a session starts to smell like health context, and a
//      self-hostable vendor with a BAA becomes the better story.
//   2. The practice wants to read the dashboard themselves. Plausible does
//      shareable public links; Vercel requires project access.
//
// No PHI, no patient identifiers, no free-text. Props are enum-ish values only
// (slugs, source names, counts). Keep it that way.

// Only CUSTOM events belong here. Page views are captured automatically by the
// <Analytics /> component in app/[locale]/layout.tsx, so "which provider pages
// get read" and "which education topics get read" are already answered by the
// pageview report. Firing provider_view / education_topic_view on top of that
// would double-count and burn the Hobby-tier event cap for nothing.
//
// What custom events add is INTENT that leaves the app — a tap that hands the
// patient off to a phone line, a scheduling form, or the portal. Those are
// invisible to pageview tracking, and they're the whole point.
export type AnalyticsEvent =
  // Conversion. appointment_handoff_click vs tel_tap is the deflection ratio —
  // the number that says whether the app is reducing call volume.
  | "appointment_handoff_click"
  | "tel_tap"
  // Portal handoff
  | "portal_signin_click"
  // Navigation intent
  | "directions_click"
  // External quick actions
  | "forms_click"
  | "paybill_click"
  // Engagement
  | "pwa_install_accepted"
  | "push_optin";

type AnalyticsProps = Record<string, string | number | boolean | null>;

export function track(event: AnalyticsEvent, props?: AnalyticsProps) {
  try {
    vercelTrack(event, props);
  } catch {
    // Analytics must never break a patient's path to a phone number or a
    // scheduling link. Swallow and move on.
  }
}

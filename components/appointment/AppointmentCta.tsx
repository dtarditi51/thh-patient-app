"use client";

import { ExternalLink } from "lucide-react";
import { track } from "@/lib/analytics";

// The scheduling handoff. This is THE conversion event for the app — the number
// that, against tel_tap, tells you whether the app is deflecting phone calls.
//
// Provider and topic pages link here as /appointment?provider=slug and
// ?topic=slug. Those params are currently dropped by the hearthousenj.com form
// (we don't know its query contract, so we don't forward them). But we can at
// least record which provider or topic drove the intent, which answers "is an
// in-app booking flow worth building, and for whom?"
//
// Params are read from window.location at CLICK time rather than via
// useSearchParams() at render time, so this page stays statically prerendered
// and needs no Suspense boundary.
export function AppointmentCta({
  href,
  label,
  className
}: {
  href: string;
  label: string;
  className?: string;
}) {
  function handleClick() {
    let provider: string | null = null;
    let topic: string | null = null;
    try {
      const params = new URLSearchParams(window.location.search);
      provider = params.get("provider");
      topic = params.get("topic");
    } catch {
      // Non-fatal: fall through and record the click without attribution.
    }
    track("appointment_handoff_click", {
      provider: provider ?? "none",
      topic: topic ?? "none"
    });
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {label}
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

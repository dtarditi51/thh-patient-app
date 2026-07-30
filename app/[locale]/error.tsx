"use client";

import { useEffect } from "react";
import { MessageScreen } from "@/components/MessageScreen";

// Error boundaries are client components rendered outside NextIntlClientProvider,
// so next-intl hooks would throw here. Strings are hardcoded English, which is
// consistent with the EN-only pilot launch (see lib/launchFlags.ts). When
// Spanish launches, thread the copy through as props from a server wrapper.
export default function LocaleError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in Vercel runtime logs with the digest for correlation.
    console.error("Route error boundary:", error.digest ?? error.message);
  }, [error]);

  return (
    <MessageScreen
      title="Something went wrong"
      body="We hit an unexpected problem loading this page. Trying again usually fixes it."
      callIntro="Need to reach us?"
      actions={
        <>
          <button onClick={reset} className="btn-primary w-full justify-center">
            Try again
          </button>
          <a href="/" className="btn-ghost w-full justify-center">
            Go to home page
          </a>
        </>
      }
    />
  );
}

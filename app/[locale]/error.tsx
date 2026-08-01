"use client";

import { useEffect } from "react";
import { MessageScreen } from "@/components/MessageScreen";
import { hardResetAndReload, isChunkLoadError, reloadOnChunkError } from "@/lib/chunkReload";

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
    // Deploy skew is not a real error, it is a stale tab. Reload before showing
    // anything, because reset() provably cannot recover it. See lib/chunkReload.
    if (reloadOnChunkError(error)) return;
    // Surfaces in Vercel runtime logs with the digest for correlation.
    console.error("Route error boundary:", error.digest ?? error.message);
  }, [error]);

  const staleBuild = isChunkLoadError(error);

  return (
    <MessageScreen
      title={staleBuild ? "Let's refresh the app" : "Something went wrong"}
      body={
        staleBuild
          ? "A newer version of the app is available. Refreshing loads it and should clear this."
          : "We hit an unexpected problem loading this page. Trying again usually fixes it."
      }
      callIntro="Need to reach us?"
      actions={
        <>
          <button
            onClick={staleBuild ? () => void hardResetAndReload() : reset}
            className="btn-primary w-full justify-center"
          >
            {staleBuild ? "Refresh" : "Try again"}
          </button>
          <a href="/" className="btn-ghost w-full justify-center">
            Go to home page
          </a>
        </>
      }
    />
  );
}

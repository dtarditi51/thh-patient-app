// Deploy-skew recovery.
//
// Every deploy rehashes all ~98 JS chunks. next-pwa runs with skipWaiting: true
// (next.config.js), so the new service worker activates immediately, seizes
// pages that are already open, and purges the previous precache. Those pages
// still reference the OLD chunk filenames, which now miss in the precache and
// eventually 404 on the network too. React surfaces that as ChunkLoadError.
//
// The error boundary's reset() CANNOT recover from this: it re-renders the same
// tree, which requests the same missing chunk, which fails again. Only a full
// document reload pulls fresh HTML pointing at the new chunks.

const RELOAD_STAMP_KEY = "thh:chunk-reload-at";
const RELOAD_COOLDOWN_MS = 60_000;

const CHUNK_ERROR_PATTERNS = [
  /loading chunk \S+ failed/i,
  /loading css chunk/i,
  /failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /importing a module script failed/i
];

export function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const { name = "", message = "" } = error as { name?: string; message?: string };
  if (name === "ChunkLoadError") return true;
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

/**
 * Reloads the document once per cooldown window when the error is deploy skew.
 * The cooldown is the loop guard: if a reload does not clear the error, the next
 * occurrence falls through to the UI instead of cycling the patient forever.
 *
 * Returns true when a reload was triggered, so callers can skip rendering.
 */
export function reloadOnChunkError(error: unknown): boolean {
  if (typeof window === "undefined") return false;
  if (!isChunkLoadError(error)) return false;

  try {
    const last = Number(window.sessionStorage.getItem(RELOAD_STAMP_KEY)) || 0;
    if (Date.now() - last < RELOAD_COOLDOWN_MS) return false;
    window.sessionStorage.setItem(RELOAD_STAMP_KEY, String(Date.now()));
  } catch {
    // Safari private mode can throw on sessionStorage. Without a working guard
    // an auto-reload could loop, so bail and leave the user the manual button.
    return false;
  }

  window.location.reload();
  return true;
}

/**
 * Last resort behind the "Try again" button, reached only after the automatic
 * reload above already failed to clear things. Discards the app service worker
 * and every Cache Storage bucket, then reloads cold.
 *
 * Deliberately leaves the Firebase messaging worker registered: it lives on its
 * own scope, holds no precache, and unregistering it would silently drop the
 * user's push subscription until they revisited /portal.
 */
export async function hardResetAndReload(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations
          .filter((r) => !r.scope.includes("firebase-cloud-messaging-push-scope"))
          .map((r) => r.unregister())
      );
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch {
    // Reload regardless. Fresh HTML alone clears most of these.
  }

  window.location.reload();
}

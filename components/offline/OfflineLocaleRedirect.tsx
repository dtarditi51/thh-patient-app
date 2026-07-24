"use client";

import { useEffect } from "react";

// next-pwa@5 fallbacks.document only accepts one string, so the SW always
// serves /en/offline when a Spanish route misses the cache. This client
// effect re-reads the user's preferred locale (NEXT_LOCALE cookie that
// next-intl sets, then navigator.language) and hops to /es/offline if the
// rendered page doesn't match. Both locale variants are statically generated
// and precached at build time, so the redirect resolves offline.
export function OfflineLocaleRedirect({ currentLocale }: { currentLocale: string }) {
  useEffect(() => {
    const cookieMatch = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
    const cookieLocale = cookieMatch?.[1];
    const navLocale = navigator.language?.slice(0, 2).toLowerCase();
    const preferred = cookieLocale ?? navLocale;
    if ((preferred === "en" || preferred === "es") && preferred !== currentLocale) {
      window.location.replace(`/${preferred}/offline`);
    }
  }, [currentLocale]);
  return null;
}

const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./i18n.ts");

// Using next-pwa@5 (already installed). Spec suggested @ducanh2912/next-pwa but
// the existing config works; staying with what's installed avoids a SW-library
// swap on a shipping app. See CLAUDE.md "On the horizon" for revisit criteria.
//
// fallbacks.document is /en/offline because next-pwa@5 only accepts one
// string here. /es/offline is statically generated and precached, and the
// rendered offline page hops there client-side via OfflineLocaleRedirect when
// the user's NEXT_LOCALE / navigator.language is Spanish.
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/en/offline"
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/maps\.googleapis\.com\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "google-maps",
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }
      }
    },
    {
      urlPattern: /^https:\/\/.*\.googleapis\.com\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "google-apis",
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }
      }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
      }
    }
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.hearthousenj.com" },
      { protocol: "https", hostname: "hearthousenj.com" },
      { protocol: "https", hostname: "www.acc.org" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" }
    ]
  },
  experimental: { serverActions: { bodySizeLimit: "2mb" } }
};

module.exports = withPWA(withNextIntl(nextConfig));

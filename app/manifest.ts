import type { MetadataRoute } from "next";

// Brand tokens come from tailwind.config.ts:
//   thh-red:     #C8102E  (primary)
//   thh-surface: #F7F7F5  (background neutral)
// Confirm with design before publishing to App Store / Play Store listings.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Heart House and Vascular Care",
    short_name: "Heart House",
    description: "Cardiovascular care across southern New Jersey",
    // "/" not "/en" — localePrefix is "as-needed", so /en 307s to /. A prefixed
    // start_url costs a redirect on every PWA cold launch.
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F7F7F5",
    theme_color: "#C8102E",
    categories: ["medical", "health"],
    lang: "en",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}

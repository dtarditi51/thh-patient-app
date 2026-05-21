const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./i18n.ts");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development"
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

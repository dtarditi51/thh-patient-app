import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { locales } from "@/i18n";
import { isIndexableLocale } from "@/lib/launchFlags";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const indexable = isIndexableLocale(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      // Child routes supply just their own name; this appends the practice.
      template: `%s | The Heart House`
    },
    description: SITE_DESCRIPTION,
    manifest: "/manifest.webmanifest",
    appleWebApp: { capable: true, statusBarStyle: "default", title: "Heart House" },
    // Spanish is machine translation pending medical-translator review, so it
    // stays out of the index during the pilot. See lib/launchFlags.ts.
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    icons: {
      icon: [
        { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
      ],
      apple: [{ url: "/apple-icon-180.png", sizes: "180x180", type: "image/png" }]
    }
  };
}

export const viewport: Viewport = {
  themeColor: "#C8102E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover"
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("common");

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        {/* First focusable element on every page. Without it, keyboard and
            switch-control users tab through the sticky header and the six-tab
            bottom nav before reaching content, on every navigation. */}
        <a href="#main-content" className="skip-link">
          {t("skipToContent")}
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

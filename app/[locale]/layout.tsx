import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { locales } from "@/i18n";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL("https://hearthousenj.app"),
  title: "The Heart House and Vascular Care",
  description: "Premier cardiology care in southern New Jersey. 34 cardiologists, 6 offices, same-day appointments.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Heart House" },
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

export const viewport: Viewport = {
  themeColor: "#C8102E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover"
};

export default function RootLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  setRequestLocale(locale);
  return (
    <html lang={locale} className={inter.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "The Heart House and Vascular Care",
  description: "Premier cardiology care in southern New Jersey. 34 cardiologists, 6 offices, same-day appointments.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Heart House" }
};

export const viewport: Viewport = {
  themeColor: "#C8102E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  setRequestLocale(locale);
  return (
    <html lang={locale} className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}

import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { InstallPrompt } from "@/components/InstallPrompt";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen pb-20 md:pb-0">
        <Header />
        {/* Target for the skip link in app/[locale]/layout.tsx. tabIndex={-1}
            lets the anchor jump move real focus here, not just the scroll
            position — without it, Tab after activating the skip link resumes
            from the header. */}
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <InstallPrompt />
        <BottomNav />
      </div>
    </NextIntlClientProvider>
  );
}

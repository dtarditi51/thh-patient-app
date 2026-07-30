import type { Metadata } from "next";
import { Link } from "@/navigation";
import { Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppointmentCta } from "@/components/appointment/AppointmentCta";
import { TrackedLink } from "@/components/TrackedLink";
import { absoluteUrl, truncateDescription, SITE_NAME } from "@/lib/seo";
import {
  APPOINTMENT_CONFIRMATION_WINDOW,
  PRACTICE_HOURS_DISPLAY,
  PRACTICE_MAIN_PHONE,
  PRACTICE_MAIN_PHONE_DISPLAY,
  PRACTICE_SCHEDULING_URL
} from "@/lib/practiceInfo";

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "appointment" });
  const title = t("hero.title");
  const description = truncateDescription(t("hero.subtitle"));
  const url = absoluteUrl(locale, "/appointment");
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `${title} | The Heart House`,
      description,
      url,
      siteName: SITE_NAME
    },
    twitter: { card: "summary", title: `${title} | The Heart House`, description }
  };
}

export default async function AppointmentPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("appointment");

  return (
    <div className="container-app space-y-6 py-4 pb-12">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-thh-red to-thh-red-dark p-6 text-white md:p-8">
        <h1 className="text-2xl font-medium leading-tight md:text-3xl">{t("hero.title")}</h1>
        <p className="mt-3 text-sm text-white/90 md:text-base">{t("hero.subtitle")}</p>
      </section>

      <section className="space-y-3 rounded-2xl bg-white p-5 ring-1 ring-thh-line">
        <h2 className="sr-only">{t("primaryCta.heading")}</h2>
        <AppointmentCta
          href={PRACTICE_SCHEDULING_URL}
          label={t("primaryCta.button")}
          className="btn-primary w-full justify-center text-base"
        />
        <p className="text-xs leading-relaxed text-thh-muted">
          {t("primaryCta.context", { window: APPOINTMENT_CONFIRMATION_WINDOW })}
        </p>
      </section>

      <section className="space-y-2 rounded-2xl bg-white p-5 ring-1 ring-thh-line">
        <h2 className="text-base font-medium">{t("phoneFallback.heading")}</h2>
        <TrackedLink
          href={`tel:${PRACTICE_MAIN_PHONE}`}
          event="tel_tap"
          eventProps={{ source: "appointment" }}
          className="flex min-h-[44px] items-center gap-2 text-xl font-medium text-thh-red"
          aria-label={t("phoneFallback.callAria", { phone: PRACTICE_MAIN_PHONE_DISPLAY })}
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          {PRACTICE_MAIN_PHONE_DISPLAY}
        </TrackedLink>
        <p className="text-xs text-thh-muted">
          {t("phoneFallback.hoursLine", { hours: PRACTICE_HOURS_DISPLAY })}
        </p>
      </section>

      <p className="text-xs text-thh-muted">
        {t.rich("returningPatient.text", {
          link: (chunks) => (
            <Link href="/portal" className="font-medium text-thh-red underline">
              {chunks}
            </Link>
          )
        })}
      </p>
    </div>
  );
}

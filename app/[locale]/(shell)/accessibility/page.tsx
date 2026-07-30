import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Phone } from "lucide-react";
import {
  PRACTICE_MAIN_PHONE,
  PRACTICE_MAIN_PHONE_DISPLAY,
  TTY_NUMBER
} from "@/lib/practiceInfo";
import { TrackedLink } from "@/components/TrackedLink";
import { absoluteUrl, truncateDescription, SITE_NAME } from "@/lib/seo";

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "accessibility" });
  const title = t("title");
  const description = truncateDescription(t("commitment"));
  const url = absoluteUrl(locale, "/accessibility");
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
    }
  };
}

export default async function AccessibilityPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("accessibility");

  return (
    <div className="container-app max-w-2xl space-y-8 py-6 pb-12">
      <h1 className="text-2xl font-medium md:text-3xl">{t("title")}</h1>

      <p className="text-sm leading-relaxed text-thh-ink">{t("commitment")}</p>

      <section className="space-y-2">
        <h2 className="text-base font-medium">{t("standardHeading")}</h2>
        <p className="text-sm leading-relaxed text-thh-ink">{t("standardBody")}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-medium">{t("limitationsHeading")}</h2>
        <p className="text-sm leading-relaxed text-thh-ink">{t("limitationsBody")}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-medium">{t("feedbackHeading")}</h2>
        <p className="text-sm leading-relaxed text-thh-ink">
          {t("feedbackBody", { phone: PRACTICE_MAIN_PHONE_DISPLAY, tty: TTY_NUMBER })}
        </p>
        <TrackedLink
          href={`tel:${PRACTICE_MAIN_PHONE}`}
          event="tel_tap"
          eventProps={{ source: "accessibility" }}
          className="btn-primary"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          {PRACTICE_MAIN_PHONE_DISPLAY}
        </TrackedLink>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-medium">{t("alternativeHeading")}</h2>
        <p className="text-sm leading-relaxed text-thh-ink">
          {t("alternativeBody", { phone: PRACTICE_MAIN_PHONE_DISPLAY })}
        </p>
      </section>
    </div>
  );
}

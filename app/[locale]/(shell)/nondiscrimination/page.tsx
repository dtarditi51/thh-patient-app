import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Phone, ExternalLink } from "lucide-react";
import { OCR_CONTACT } from "@/data/legal";
import {
  PRACTICE_MAIN_PHONE,
  PRACTICE_MAIN_PHONE_DISPLAY,
  TTY_NUMBER
} from "@/lib/practiceInfo";
import { TrackedLink } from "@/components/TrackedLink";
import { absoluteUrl, truncateDescription, SITE_NAME } from "@/lib/seo";

// Section 1557 notice of nondiscrimination, grievance procedure, OCR complaint
// channel, and the notice of availability of language assistance in the 15
// languages most commonly spoken by LEP individuals in New Jersey.

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "nondiscrimination" });
  const title = t("title");
  const description = truncateDescription(t("intro"));
  const url = absoluteUrl(locale, "/nondiscrimination");
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

export default async function NondiscriminationPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("nondiscrimination");

  return (
    <div className="container-app max-w-2xl space-y-8 py-6 pb-12">
      <h1 className="text-2xl font-medium md:text-3xl">{t("title")}</h1>

      <p className="text-sm leading-relaxed text-thh-ink">{t("intro")}</p>

      <section className="space-y-3">
        <h2 className="text-base font-medium">{t("weProvideHeading")}</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-thh-ink">
          <li className="flex gap-2">
            <span aria-hidden="true" className="select-none text-thh-red">
              ·
            </span>
            <span>{t("aids")}</span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="select-none text-thh-red">
              ·
            </span>
            <span>{t("languageServices")}</span>
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-thh-ink">
          {t("requestServices", { phone: PRACTICE_MAIN_PHONE_DISPLAY, tty: TTY_NUMBER })}
        </p>
        <TrackedLink
          href={`tel:${PRACTICE_MAIN_PHONE}`}
          event="tel_tap"
          eventProps={{ source: "nondiscrimination" }}
          className="btn-primary"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          {PRACTICE_MAIN_PHONE_DISPLAY}
        </TrackedLink>
      </section>

      {/* Grievances route to the main office line. A named Section 1557
          coordinator has not been designated yet — see the TODO in
          lib/practiceInfo.ts. Publishing a placeholder contact would be worse
          than publishing none. */}
      <section className="space-y-3">
        <h2 className="text-base font-medium">{t("grievanceHeading")}</h2>
        <p className="text-sm leading-relaxed text-thh-ink">
          {t("grievanceBody", { phone: PRACTICE_MAIN_PHONE_DISPLAY, tty: TTY_NUMBER })}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-medium">{t("ocrHeading")}</h2>
        <p className="text-sm leading-relaxed text-thh-ink">{t("ocrBody")}</p>
        <address className="space-y-0.5 rounded-xl bg-white p-4 text-sm not-italic ring-1 ring-thh-line">
          <div className="font-medium">{OCR_CONTACT.name}</div>
          <div className="text-thh-muted">{OCR_CONTACT.address}</div>
          <div className="text-thh-muted">
            {OCR_CONTACT.phone} · TDD {OCR_CONTACT.tdd}
          </div>
        </address>
        <div className="flex flex-wrap gap-2">
          <a
            href={OCR_CONTACT.complaintPortal}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs"
          >
            {t("ocrPortal")}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <a
            href={OCR_CONTACT.complaintForms}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs"
          >
            {t("ocrForms")}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* The 15 translated taglines that belong here are in data/legal.ts but
          are NOT rendered pending a compliance review of the translations.
          See the note on LANGUAGE_TAGLINES for how to restore them. */}
      <section className="space-y-3">
        <h2 className="text-base font-medium">{t("taglinesHeading")}</h2>
        <p className="text-sm leading-relaxed text-thh-ink">
          {t("taglinesIntro", { phone: PRACTICE_MAIN_PHONE_DISPLAY, tty: TTY_NUMBER })}
        </p>
      </section>
    </div>
  );
}

import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { Phone, AlertTriangle } from "lucide-react";
import { POLICY_LINKS } from "@/data/legal";
import {
  PRACTICE_MAIN_PHONE,
  PRACTICE_MAIN_PHONE_DISPLAY,
  TTY_NUMBER
} from "@/lib/practiceInfo";
import { TrackedLink } from "@/components/TrackedLink";

// Legal / compliance footer.
//
// Carries what a healthcare web property is expected to publish and what the
// app previously had nowhere to put: privacy + HIPAA + NPP links, terms, an
// accessibility statement, the Section 1557 nondiscrimination notice, and the
// notice of availability of free language assistance in the 15 languages most
// commonly spoken by LEP individuals in New Jersey.
//
// The taglines sit inside a <details> so the footer stays scannable, but they
// are in the DOM on every page (not lazy-loaded, not behind a route) so they
// are actually discoverable and crawlable, which is the point of the notice.

const POLICY_LABEL_KEYS: Record<string, string> = {
  privacy: "privacy",
  hipaa: "hipaa",
  npp: "npp",
  nppEs: "nppEs",
  terms: "terms"
};

export async function Footer() {
  const t = await getTranslations("footer");
  // Build-time year. This is a statically prerendered server component, so
  // using new Date() here stamps the build date rather than the request date —
  // fine for a copyright line, and it avoids a client component.
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-thh-line bg-white">
      <div className="container-app space-y-6 py-8">
        {/* Emergency guidance. A cardiology app should distinguish "chest pain
            right now" from "call the office" somewhere persistent. */}
        <div
          role="note"
          className="flex items-start gap-2 rounded-xl bg-thh-red-50 p-3 text-xs leading-relaxed text-thh-red-dark ring-1 ring-thh-red/20"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>{t("emergency")}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-thh-ink">{t("practiceName")}</p>
            <p className="text-xs leading-relaxed text-thh-muted">{t("tagline")}</p>
          </div>

          <nav aria-labelledby="footer-policies">
            <h2 id="footer-policies" className="text-xs font-medium uppercase tracking-wide text-thh-muted">
              {t("policiesHeading")}
            </h2>
            <ul className="mt-2 space-y-1.5">
              {POLICY_LINKS.map((p) => (
                <li key={p.key}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    hrefLang={p.lang}
                    lang={p.lang}
                    className="text-xs text-thh-ink underline decoration-thh-line underline-offset-2 hover:text-thh-red"
                  >
                    {t(POLICY_LABEL_KEYS[p.key])}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/nondiscrimination"
                  className="text-xs text-thh-ink underline decoration-thh-line underline-offset-2 hover:text-thh-red"
                >
                  {t("nondiscrimination")}
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-xs text-thh-ink underline decoration-thh-line underline-offset-2 hover:text-thh-red"
                >
                  {t("accessibility")}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-medium uppercase tracking-wide text-thh-muted">
              {t("contactHeading")}
            </h2>
            <div className="mt-2 space-y-1.5">
              <TrackedLink
                href={`tel:${PRACTICE_MAIN_PHONE}`}
                event="tel_tap"
                eventProps={{ source: "footer" }}
                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-thh-red"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {PRACTICE_MAIN_PHONE_DISPLAY}
              </TrackedLink>
              <p className="text-xs text-thh-muted">
                {t("tty")}: {TTY_NUMBER}
              </p>
            </div>
          </div>
        </div>

        {/* Section 1557 notice of nondiscrimination + notice of availability of
            language assistance. */}
        <div className="space-y-3 border-t border-thh-line pt-5">
          <p className="text-xs leading-relaxed text-thh-muted">
            {t("nondiscriminationShort")}{" "}
            <Link href="/nondiscrimination" className="underline underline-offset-2 hover:text-thh-red">
              {t("nondiscrimination")}
            </Link>
          </p>

          {/* Notice of availability of free language assistance. The 15
              translated taglines that belong alongside this are in
              data/legal.ts but are NOT rendered pending a compliance review of
              the translations — see the note on LANGUAGE_TAGLINES. */}
          <p className="text-xs leading-relaxed text-thh-muted">
            <span className="font-medium text-thh-ink">{t("languageAssistanceHeading")}:</span>{" "}
            {t("languageAssistanceIntro", {
              phone: PRACTICE_MAIN_PHONE_DISPLAY,
              tty: TTY_NUMBER
            })}
          </p>
        </div>

        <div className="space-y-2 border-t border-thh-line pt-5">
          <p className="text-[11px] leading-relaxed text-thh-muted">{t("notMedicalAdvice")}</p>
          <p className="text-[11px] text-thh-muted">{t("copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}

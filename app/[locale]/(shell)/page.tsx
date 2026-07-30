import { Link } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Phone, FileText, CreditCard, ChevronRight, Calendar, ClipboardList } from "lucide-react";
import { educationTopics } from "@/data/education";
import { TopicIcon } from "@/components/education/TopicIcon";
import { GoogleReviews } from "@/components/reviews/GoogleReviews";
import { TrustBadge } from "@/components/home/TrustBadge";
import { TrackedLink } from "@/components/TrackedLink";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema } from "@/lib/structuredData";
import type { AnalyticsEvent } from "@/lib/analytics";
import { locations } from "@/data/locations";
import { PRACTICE_MAIN_PHONE, PRACTICE_MAIN_PHONE_DISPLAY } from "@/lib/practiceInfo";

const marlton = locations.find((l) => l.slug === "marlton")!;

export default function HomePage({ params: { locale: routeLocale } }: { params: { locale: string } }) {
  setRequestLocale(routeLocale);
  const t = useTranslations("home");
  const tNav = useTranslations("nav");
  const tReviews = useTranslations("reviews");
  const tLocDetail = useTranslations("locationDetail");
  const locale = useLocale();
  const lang = locale as "en" | "es";

  return (
    <div className="container-app space-y-8 pb-8 pt-4">
      <JsonLd data={organizationSchema()} />
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-thh-red to-thh-red-dark p-6 text-white md:p-8">
        <p className="text-xs uppercase tracking-wider text-white/80">{t("hero.eyebrow")}</p>
        <h1 className="mt-2 text-2xl font-medium leading-tight md:text-3xl">{t("hero.title")}</h1>
        <p className="mt-2 text-sm text-white/90 md:text-base">{t("hero.subtitle")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/appointment" className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-thh-red hover:bg-white/90">
            {t("hero.cta")}
          </Link>
          <Link href="/doctors" className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10">
            {t("hero.ctaSecondary")}
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <TrustBadge value={t("trust.nps")} label={t("trust.npsLabel")} icon="star" />
        <TrustBadge value={t("trust.physicians")} label={t("trust.physiciansLabel")} icon="docs" />
        <TrustBadge value={t("trust.locations")} label={t("trust.locationsLabel")} icon="map" />
        <TrustBadge value={t("trust.hospitals")} label={t("trust.hospitalsLabel")} icon="hospital" />
      </section>

      <section>
        <h2 className="text-lg font-medium">{tReviews("homepageHeading")}</h2>
        <p className="mt-1 mb-3 text-xs text-thh-muted">{tReviews("homepageSubhead")}</p>
        <GoogleReviews
          placeId={marlton.placeId}
          emptyLabel={tLocDetail("reviewsEmpty")}
          attribution={tLocDetail("reviewsAttribution")}
          limit={3}
        />
        <div className="mt-3">
          <Link href="/locations/marlton" className="text-xs font-medium text-thh-red">
            {tReviews("seeAllAtMarlton")} →
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-medium">{t("education.title")}</h2>
          <Link href="/education" className="text-xs text-thh-red">
            {t("education.seeAll")} →
          </Link>
        </div>
        <p className="mb-3 text-xs text-thh-muted">{t("education.subtitle")}</p>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
          {educationTopics.slice(0, 4).map((topic) => (
            <Link key={topic.slug} href={`/education/${topic.slug}`} className={`min-w-[150px] rounded-xl p-4 md:min-w-0 topic-bg-${topic.color}`}>
              <TopicIcon name={topic.icon} color={topic.color} size={26} />
              <div className="mt-2 text-sm font-medium">{topic.title[lang]}</div>
              <div className="mt-0.5 text-xs text-thh-muted">{topic.blurb[lang]}</div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">{t("quickActions.title")}</h2>
        <div className="space-y-2">
          <QuickActionRow
            href={`tel:${PRACTICE_MAIN_PHONE}`}
            outbound
            event="tel_tap"
            eventProps={{ source: "home_quick_action" }}
            Icon={Phone}
            title={t("quickActions.call")}
            subtitle={PRACTICE_MAIN_PHONE_DISPLAY}
          />
          <QuickActionRow href="/appointment" Icon={Calendar} title={tNav("appointment")} subtitle={t("quickActions.appointmentSubtitle")} />
          <QuickActionRow href="/procedures" Icon={ClipboardList} title={t("quickActions.testPrep")} subtitle={t("quickActions.testPrepSubtitle")} />
          <QuickActionRow
            href="https://www.hearthousenj.com/patient-resources/patient-forms"
            outbound
            external
            event="forms_click"
            Icon={FileText}
            title={t("quickActions.forms")}
            subtitle={t("quickActions.formsSubtitle")}
          />
          <QuickActionRow
            href="https://www.patientnotebook.com/hearthousecadv"
            outbound
            external
            event="paybill_click"
            Icon={CreditCard}
            title={t("quickActions.pay")}
            subtitle={t("quickActions.paySubtitle")}
          />
        </div>
      </section>

    </div>
  );
}

// `outbound` rows (tel:, external https:) render a plain tracked <a>. Only
// in-app paths go through next-intl's <Link>, which is the thing that applies
// locale prefixing — handing it a tel: or absolute URL is meaningless at best.
function QuickActionRow({
  href,
  outbound,
  external,
  event,
  eventProps,
  Icon,
  title,
  subtitle
}: {
  href: string;
  outbound?: boolean;
  external?: boolean;
  event?: AnalyticsEvent;
  eventProps?: Record<string, string | number | boolean | null>;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  title: string;
  subtitle: string;
}) {
  const className =
    "flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-thh-line hover:bg-thh-surface";
  const inner = (
    <>
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-thh-red" aria-hidden="true" />
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-thh-muted">{subtitle}</div>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-thh-muted" aria-hidden="true" />
    </>
  );

  if (outbound && event) {
    return (
      <TrackedLink href={href} event={event} eventProps={eventProps} external={external} className={className}>
        {inner}
      </TrackedLink>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

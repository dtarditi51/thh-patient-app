import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Phone, FileText, CreditCard, ChevronRight, Calendar, Star } from "lucide-react";
import { educationTopics } from "@/data/education";
import { TopicIcon } from "@/components/education/TopicIcon";

export default function HomePage({ params: { locale: routeLocale } }: { params: { locale: string } }) {
  setRequestLocale(routeLocale);
  const t = useTranslations("home");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const lang = locale as "en" | "es";

  return (
    <div className="container-app space-y-8 pb-8 pt-4">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-thh-red to-thh-red-dark p-6 text-white md:p-8">
        <p className="text-xs uppercase tracking-wider text-white/80">{t("hero.eyebrow")}</p>
        <h1 className="mt-2 text-2xl font-medium leading-tight md:text-3xl">{t("hero.title")}</h1>
        <p className="mt-2 text-sm text-white/90 md:text-base">{t("hero.subtitle")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/${locale}/appointment`} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-thh-red hover:bg-white/90">
            {t("hero.cta")}
          </Link>
          <Link href={`/${locale}/doctors`} className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10">
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
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-medium">{t("education.title")}</h2>
          <Link href={`/${locale}/education`} className="text-xs text-thh-red">
            {t("education.seeAll")} →
          </Link>
        </div>
        <p className="mb-3 text-xs text-thh-muted">{t("education.subtitle")}</p>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
          {educationTopics.slice(0, 4).map((topic) => (
            <Link key={topic.slug} href={`/${locale}/education/${topic.slug}`} className={`min-w-[150px] rounded-xl p-4 md:min-w-0 topic-bg-${topic.color}`}>
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
          <QuickActionRow href={`tel:${process.env.NEXT_PUBLIC_MAIN_PHONE || "856-546-3003"}`} Icon={Phone} title={t("quickActions.call")} subtitle="856-546-3003" />
          <QuickActionRow href={`/${locale}/patient-resources/forms`} Icon={FileText} title={t("quickActions.forms")} subtitle="Complete before your visit" />
          <QuickActionRow href="https://www.patientnotebook.com/hearthousecadv" external Icon={CreditCard} title={t("quickActions.pay")} subtitle="Patient Notebook" />
          <QuickActionRow href={`/${locale}/appointment`} Icon={Calendar} title={tNav("appointment")} subtitle={t("quickActions.appointmentSubtitle")} />
        </div>
      </section>

      <style>{`
        .topic-bg-red { background:#FFE8EC; }
        .topic-bg-blue { background:#E6F1FB; }
        .topic-bg-green { background:#EAF3DE; }
        .topic-bg-purple { background:#EEEDFE; }
        .topic-bg-teal { background:#E1F5EE; }
        .topic-bg-pink { background:#FBEAF0; }
        .topic-bg-amber { background:#FAEEDA; }
        .topic-bg-rose { background:#FCEBEB; }
      `}</style>
    </div>
  );
}

function TrustBadge({ value, label, icon }: { value: string; label: string; icon: "star" | "docs" | "map" | "hospital" }) {
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-thh-line">
      <div className="flex items-center gap-1.5">
        {icon === "star" && <Star className="h-4 w-4 fill-thh-red text-thh-red" />}
        <div className="text-base font-medium text-thh-ink">{value}</div>
      </div>
      <div className="mt-1 text-[11px] leading-tight text-thh-muted">{label}</div>
    </div>
  );
}

function QuickActionRow({ href, external, Icon, title, subtitle }: { href: string; external?: boolean; Icon: React.ComponentType<{ className?: string }>; title: string; subtitle: string }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-thh-line hover:bg-thh-surface"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-thh-red" />
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-thh-muted">{subtitle}</div>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-thh-muted" />
    </Link>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AlertCircle, ExternalLink, ChevronRight } from "lucide-react";
import { educationTopics } from "@/data/education";
import { TopicIcon } from "@/components/education/TopicIcon";

export function generateStaticParams() {
  return educationTopics.map((t) => ({ slug: t.slug }));
}

export default async function TopicPage({ params: { slug, locale } }: { params: { slug: string; locale: string } }) {
  const topic = educationTopics.find((t) => t.slug === slug);
  if (!topic) notFound();
  const t = await getTranslations("education");
  const lang = locale as "en" | "es";

  const cardioSmartUrl = lang === "es" && topic.cardioSmartUrl.es ? topic.cardioSmartUrl.es : topic.cardioSmartUrl.en;
  const spanishFallback = lang === "es" && !topic.cardioSmartUrl.es;

  return (
    <div className="container-app space-y-6 py-4 pb-12">
      <div className={`flex items-center gap-4 rounded-xl p-5 topic-bg-${topic.color}`}>
        <TopicIcon name={topic.icon} color={topic.color} size={56} />
        <div>
          <h1 className="text-xl font-medium md:text-2xl">{topic.title[lang]}</h1>
          <p className="text-sm text-thh-muted">{topic.blurb[lang]}</p>
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-base font-medium">{t("summary")}</h2>
        <p className="text-sm leading-relaxed">{topic.summary[lang]}</p>
      </section>

      <section className="rounded-xl border-l-4 border-thh-red bg-thh-red-50 p-4">
        <h2 className="mb-2 flex items-center gap-2 text-base font-medium text-thh-red-dark">
          <AlertCircle className="h-4 w-4" />
          {t("whenToCall")}
        </h2>
        <ul className="space-y-1.5 text-sm text-thh-ink">
          {topic.whenToCall[lang].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-thh-red">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-base font-medium">{t("questionsToAsk")}</h2>
        <ul className="space-y-1.5 text-sm">
          {topic.questionsToAsk[lang].map((q, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-thh-muted">{i + 1}.</span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <a
          href={cardioSmartUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl bg-thh-red p-4 text-white hover:bg-thh-red-dark"
        >
          <div>
            <div className="text-sm font-medium">{spanishFallback ? t("fullGuide") + " (English only)" : t("fullGuide")}</div>
            <div className="text-xs text-white/80">cardiosmart.org</div>
          </div>
          <ExternalLink className="h-5 w-5" />
        </a>
        {spanishFallback && (
          <p className="text-xs text-thh-muted">Esta guía aún no está disponible en español en CardioSmart. Le ofrecemos la versión en inglés.</p>
        )}
        <Link
          href={`/${locale}/appointment?topic=${topic.slug}`}
          className="flex items-center justify-between rounded-xl bg-white p-4 ring-1 ring-thh-line hover:bg-thh-surface"
        >
          <div className="text-sm font-medium">{t("bookAppointment")}</div>
          <ChevronRight className="h-5 w-5 text-thh-red" />
        </Link>
      </section>

      {topic.relatedSlugs.length > 0 && (
        <section>
          <h2 className="mb-2 text-base font-medium">{t("relatedTopics")}</h2>
          <div className="grid grid-cols-2 gap-2">
            {topic.relatedSlugs.map((relSlug) => {
              const rel = educationTopics.find((tt) => tt.slug === relSlug);
              if (!rel) return null;
              return (
                <Link key={relSlug} href={`/${locale}/education/${relSlug}`} className="rounded-xl bg-white p-3 ring-1 ring-thh-line hover:bg-thh-surface">
                  <TopicIcon name={rel.icon} color={rel.color} size={20} />
                  <div className="mt-1.5 text-sm font-medium">{rel.title[lang]}</div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

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

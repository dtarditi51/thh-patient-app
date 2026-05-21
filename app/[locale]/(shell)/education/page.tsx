import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Info } from "lucide-react";
import { educationTopics } from "@/data/education";
import { TopicIcon } from "@/components/education/TopicIcon";

export default async function EducationPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("education");
  const lang = locale as "en" | "es";

  return (
    <div className="container-app space-y-4 py-4 pb-12">
      <div>
        <h1 className="text-2xl font-medium">{t("title")}</h1>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
        <Info className="h-4 w-4 flex-shrink-0" />
        <span>{t("attribution")}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {educationTopics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/${locale}/education/${topic.slug}`}
            className="overflow-hidden rounded-xl bg-white ring-1 ring-thh-line hover:bg-thh-surface"
          >
            <div className={`flex h-24 items-center justify-center topic-bg-${topic.color}`}>
              <TopicIcon name={topic.icon} color={topic.color} size={40} />
            </div>
            <div className="p-3">
              <div className="text-sm font-medium">{topic.title[lang]}</div>
              <div className="mt-0.5 text-xs text-thh-muted">{topic.blurb[lang]}</div>
            </div>
          </Link>
        ))}
      </div>

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

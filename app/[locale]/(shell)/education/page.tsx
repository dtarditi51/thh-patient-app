import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Info } from "lucide-react";
import { educationTopics } from "@/data/education";
import { TopicIcon } from "@/components/education/TopicIcon";
import { absoluteUrl, truncateDescription, SITE_NAME } from "@/lib/seo";

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "education" });
  const title = t("title");
  const description = truncateDescription(t("attribution"));
  const url = absoluteUrl(locale, "/education");
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
            href={`/education/${topic.slug}`}
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

    </div>
  );
}

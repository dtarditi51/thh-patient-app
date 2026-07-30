import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { absoluteUrl, truncateDescription, SITE_NAME } from "@/lib/seo";

// This segment's page.tsx is a "use client" component, and client components
// cannot export generateMetadata. A pass-through layout is the standard way to
// attach metadata to a client-rendered route. Child routes (e.g. [slug]) set
// their own title/description, which override these.
export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "doctors" });
  const title = t("title");
  const description = truncateDescription(
    `${t("title")} at The Heart House and Vascular Care. Browse board-certified cardiologists and advanced practice nurses by office and subspecialty across southern New Jersey.`
  );
  const url = absoluteUrl(locale, "/doctors");
  return {
    // Object form, not a plain string: a plain string here consumes the root
    // layout's title template and stops it propagating, which left child
    // routes like /doctors/[slug] with an unbranded <title>.
    title: { default: title, template: "%s | The Heart House" },
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

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}

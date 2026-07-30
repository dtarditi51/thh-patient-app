import { getTranslations } from "next-intl/server";
import { MessageScreen } from "@/components/MessageScreen";

// Catches notFound() from every [slug] page — a retired provider, a renamed
// office, a stale QR code. Before this existed, those landed on Next's
// unstyled default 404 with no phone number and no way back.
export default async function LocaleNotFound() {
  const t = await getTranslations("errors");

  return (
    <MessageScreen
      title={t("notFound.title")}
      body={t("notFound.body")}
      callIntro={t("callIntro")}
      actions={
        <>
          <a href="/" className="btn-primary w-full justify-center">
            {t("notFound.home")}
          </a>
          <a href="/doctors" className="btn-ghost w-full justify-center">
            {t("notFound.findDoctor")}
          </a>
        </>
      }
    />
  );
}

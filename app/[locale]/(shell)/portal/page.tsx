"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ShieldCheck, TestTube, MessageCircle, Pill, CalendarCheck, Bell, ExternalLink } from "lucide-react";
import { track } from "@/lib/analytics";

type PushStatus = NotificationPermission | "unsupported" | "enabling" | "error";

export default function PortalPage() {
  const t = useTranslations("portal");
  const locale = useLocale();
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.hearthousenj.com";
  const [pushStatus, setPushStatus] = useState<PushStatus>("default");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPushStatus("unsupported");
      return;
    }
    setPushStatus(Notification.permission);
  }, []);

  async function enablePush() {
    if (pushStatus === "unsupported") return;
    const perm = await Notification.requestPermission();
    if (perm !== "granted") {
      setPushStatus(perm);
      return;
    }
    setPushStatus("enabling");
    try {
      // Dynamic import: lib/firebaseClient pulls in firebase/app +
      // firebase/messaging at module scope. Statically importing it made every
      // visitor to this tab download the Firebase SDK, including iOS users
      // where web push is unsupported and the majority who never opt in.
      const { getFcmToken } = await import("@/lib/firebaseClient");
      const token = await getFcmToken();
      if (!token) {
        setPushStatus("error");
        return;
      }
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, locale: locale === "es" ? "es" : "en" })
      });
      if (!res.ok) throw new Error(`subscribe failed: ${res.status}`);
      setPushStatus("granted");
      track("push_optin", { locale });
    } catch (err) {
      console.error("[push] enable failed", err);
      setPushStatus("error");
    }
  }

  return (
    <div className="container-app space-y-4 py-4 pb-12">
      <h1 className="text-2xl font-medium">{t("title")}</h1>

      <a
        href={portalUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("portal_signin_click", { destination: "home" })}
        className="block rounded-2xl bg-gradient-to-br from-thh-red to-thh-red-dark p-5 text-white"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          <h2 className="text-base font-medium">{t("subtitle")}</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/90">{t("description")}</p>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-thh-red">
          {t("signIn")} <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </div>
      </a>

      <div className="space-y-2">
        <PortalRow Icon={TestTube} title={t("testResults")} href={`${portalUrl}/results`} destination="results" />
        <PortalRow Icon={MessageCircle} title={t("messages")} href={`${portalUrl}/messages`} destination="messages" />
        <PortalRow Icon={Pill} title={t("refills")} href={`${portalUrl}/medications`} destination="medications" />
        <PortalRow Icon={CalendarCheck} title={t("appointments")} href={`${portalUrl}/appointments`} destination="appointments" />
      </div>

      {pushStatus !== "unsupported" && pushStatus !== "granted" && (
        <div className="rounded-xl bg-white p-4 ring-1 ring-thh-line">
          <div className="flex items-start gap-3">
            <Bell className="mt-0.5 h-5 w-5 text-thh-red" aria-hidden="true" />
            <div className="flex-1">
              <div className="text-sm font-medium">{t("push.title")}</div>
              <div className="mt-1 text-xs text-thh-muted">{t("push.body")}</div>
              {pushStatus === "denied" ? (
                <p className="mt-3 text-xs text-thh-muted">{t("push.blocked")}</p>
              ) : (
                <>
                  <button
                    onClick={enablePush}
                    disabled={pushStatus === "enabling"}
                    className="btn-primary mt-3 disabled:opacity-60"
                  >
                    {pushStatus === "enabling" ? t("push.enabling") : t("push.enable")}
                  </button>
                  {pushStatus === "error" && (
                    <p className="mt-2 text-xs text-thh-red" role="alert">
                      {t("push.error")}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PortalRow({
  Icon,
  title,
  href,
  destination
}: {
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  title: string;
  href: string;
  destination: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("portal_signin_click", { destination })}
      className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-thh-line hover:bg-thh-surface"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-thh-red" aria-hidden="true" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <ExternalLink className="h-4 w-4 text-thh-muted" aria-hidden="true" />
    </a>
  );
}

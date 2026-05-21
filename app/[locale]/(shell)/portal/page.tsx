"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck, TestTube, MessageCircle, Pill, CalendarCheck, Bell, ExternalLink } from "lucide-react";

export default function PortalPage() {
  const t = useTranslations("portal");
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.hearthousenj.com";
  const [pushStatus, setPushStatus] = useState<NotificationPermission | "unsupported">("default");

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
    setPushStatus(perm);
    if (perm === "granted") {
      // TODO: register FCM token with /api/subscribe endpoint
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });
      await fetch("/api/subscribe", { method: "POST", body: JSON.stringify(sub) });
    }
  }

  return (
    <div className="container-app space-y-4 py-4 pb-12">
      <h1 className="text-2xl font-medium">{t("title")}</h1>

      <a
        href={portalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl bg-gradient-to-br from-thh-red to-thh-red-dark p-5 text-white"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          <h2 className="text-base font-medium">{t("subtitle")}</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/90">{t("description")}</p>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-thh-red">
          {t("signIn")} <ExternalLink className="h-4 w-4" />
        </div>
      </a>

      <div className="space-y-2">
        <PortalRow Icon={TestTube} title={t("testResults")} href={portalUrl + "/results"} />
        <PortalRow Icon={MessageCircle} title={t("messages")} href={portalUrl + "/messages"} />
        <PortalRow Icon={Pill} title={t("refills")} href={portalUrl + "/medications"} />
        <PortalRow Icon={CalendarCheck} title={t("appointments")} href={portalUrl + "/appointments"} />
      </div>

      {pushStatus !== "unsupported" && pushStatus !== "granted" && (
        <div className="rounded-xl bg-white p-4 ring-1 ring-thh-line">
          <div className="flex items-start gap-3">
            <Bell className="mt-0.5 h-5 w-5 text-thh-red" />
            <div className="flex-1">
              <div className="text-sm font-medium">Get appointment reminders</div>
              <div className="mt-1 text-xs text-thh-muted">
                Optional push notifications for upcoming appointments, refill reminders, and important updates from your care team.
              </div>
              <button onClick={enablePush} className="mt-3 btn-primary">
                Enable notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PortalRow({ Icon, title, href }: { Icon: React.ComponentType<{ className?: string }>; title: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-thh-line hover:bg-thh-surface">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-thh-red" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <ExternalLink className="h-4 w-4 text-thh-muted" />
    </a>
  );
}

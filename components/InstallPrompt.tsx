"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Download, Share, X } from "lucide-react";
import { track } from "@/lib/analytics";

// Chrome / Android event interface (not in lib.dom.d.ts).
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSAL_KEY = "thh_install_dismissed_until";
const DISMISSAL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

// iOS Safari can pin to the home screen via Share → "Add to Home Screen,"
// but it never fires beforeinstallprompt, so we have to detect and instruct
// manually. Exclude in-app webviews (Instagram, FB Messenger) and Chrome iOS
// since those can't add to home from the share sheet.
function isIosSafariInstallable(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!isIos) return false;
  if (/CriOS|FxiOS|EdgiOS|Instagram|FBAN|FBAV|Line\/|GSA\//.test(ua)) return false;
  return true;
}

export function InstallPrompt() {
  const t = useTranslations("pwa.install");
  const pathname = usePathname();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosMode, setIosMode] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already installed.
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if ((navigator as Navigator & { standalone?: boolean }).standalone) return;

    // Previously dismissed and still within the snooze window.
    const until = Number(localStorage.getItem(DISMISSAL_KEY) || 0);
    if (until && Date.now() < until) return;

    if (isIosSafariInstallable()) {
      setIosMode(true);
      setHidden(false);
      return;
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setHidden(false);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  // Hide on the portal route — no install nag while patients are trying to
  // reach their records. Pathname check runs every render but is trivial.
  if (hidden) return null;
  if (pathname.includes("/portal")) return null;
  if (!iosMode && !deferred) return null;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "dismissed") snooze();
    else track("pwa_install_accepted", { platform: "android" });
    setDeferred(null);
    setHidden(true);
  }

  function snooze() {
    localStorage.setItem(DISMISSAL_KEY, String(Date.now() + DISMISSAL_MS));
    setHidden(true);
  }

  if (iosMode) {
    return (
      <div className="fixed inset-x-0 bottom-16 z-50 px-3 md:hidden">
        <div className="rounded-2xl border border-thh-line bg-white p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-thh-red-50">
              <Share className="h-4 w-4 text-thh-red" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-thh-ink">{t("iosTitle")}</p>
              <p className="mt-0.5 text-xs text-thh-muted">{t("iosBody")}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={snooze} className="btn-primary flex-1 justify-center text-xs">
                  {t("iosGotIt")}
                </button>
              </div>
            </div>
            <button
              onClick={snooze}
              aria-label={t("dismissAria")}
              className="-mr-1 -mt-1 flex h-11 w-11 items-center justify-center rounded-full text-thh-muted hover:bg-thh-surface"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-16 z-50 px-3 md:hidden">
      <div className="rounded-2xl border border-thh-line bg-white p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-thh-red-50">
            <Download className="h-4 w-4 text-thh-red" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-thh-ink">{t("title")}</p>
            <p className="mt-0.5 text-xs text-thh-muted">{t("body")}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={install} className="btn-primary flex-1 justify-center text-xs">
                {t("install")}
              </button>
              <button
                onClick={snooze}
                className="btn-ghost flex-1 justify-center text-xs"
                aria-label={t("dismissAria")}
              >
                {t("dismiss")}
              </button>
            </div>
          </div>
          <button
            onClick={snooze}
            aria-label={t("dismissAria")}
            className="-mr-1 -mt-1 flex h-11 w-11 items-center justify-center rounded-full text-thh-muted hover:bg-thh-surface"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

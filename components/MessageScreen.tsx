import { HeartPulse, Phone } from "lucide-react";
import { PRACTICE_MAIN_PHONE, PRACTICE_MAIN_PHONE_DISPLAY } from "@/lib/practiceInfo";

// Shared full-page message shell for 404 / error / offline states. These render
// OUTSIDE the (shell) route group, so there is no Header or BottomNav — the
// brand lockup and the phone number have to live here instead.
//
// Deliberately uses plain <a> rather than next-intl's <Link>: error boundaries
// are client components rendered outside NextIntlClientProvider, where
// useLocale() would throw. A full navigation is also the safer recovery after
// an error than a client-side transition.
export function MessageScreen({
  title,
  body,
  callIntro,
  children,
  actions
}: {
  title: string;
  body: string;
  callIntro: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-thh-surface px-4 py-8">
      <div className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-6 ring-1 ring-thh-line">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-thh-red">
            <HeartPulse className="h-5 w-5 text-white" strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-thh-ink">The Heart House</span>
            <span className="text-[10px] text-thh-muted">&amp; Vascular Care</span>
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-medium text-thh-ink">{title}</h1>
          <p className="text-sm leading-relaxed text-thh-muted">{body}</p>
        </div>

        {actions ? <div className="flex flex-col gap-2">{actions}</div> : null}
        {children}

        <div className="border-t border-thh-line pt-4">
          <p className="text-xs text-thh-muted">{callIntro}</p>
          <a
            href={`tel:${PRACTICE_MAIN_PHONE}`}
            className="mt-1 inline-flex min-h-[44px] items-center gap-1.5 text-base font-medium text-thh-red"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {PRACTICE_MAIN_PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </div>
  );
}

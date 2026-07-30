"use client";

import { track, type AnalyticsEvent } from "@/lib/analytics";

// Client wrapper so server-rendered pages can fire an analytics event on an
// outbound link without becoming client components themselves.
//
// Stays a real <a>: no preventDefault, no router.push, no onClick-only
// navigation. Middle-click, cmd-click, "copy link address", and screen-reader
// link lists all keep working, and if the analytics call throws the navigation
// still happens (track() swallows its own errors).
export function TrackedLink({
  href,
  event,
  eventProps,
  external,
  className,
  children,
  ...rest
}: {
  href: string;
  event: AnalyticsEvent;
  eventProps?: Record<string, string | number | boolean | null>;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => track(event, eventProps)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

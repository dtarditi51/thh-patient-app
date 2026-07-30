import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation. Import Link/useRouter/usePathname/redirect from HERE,
// never from next/link or next/navigation, and write hrefs WITHOUT a locale
// prefix ("/doctors", not `/${locale}/doctors`). These helpers add the prefix
// only when the routing config calls for it, and usePathname() returns the
// locale-agnostic path so active-state checks work in both languages.
export const { Link, useRouter, usePathname, redirect, getPathname } =
  createNavigation(routing);

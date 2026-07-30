import createMiddleware from "next-intl/middleware";
import { routing } from "./routing";

export default createMiddleware(routing);

export const config = {
  // The `.*\..*` clause already excludes anything with a file extension
  // (sitemap.xml, robots.txt, manifest.webmanifest, /providers/*.jpg).
  // `opengraph-image` has NO extension, so without an explicit exclusion the
  // middleware rewrote it into a locale segment that has no such route and the
  // OG card 404'd — silently, since nothing renders it inline.
  matcher: ["/((?!api|_next|_vercel|opengraph-image|.*\\..*).*)"]
};

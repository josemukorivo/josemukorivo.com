import { NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_REQUEST_HEADER,
  getLocaleFromPathname,
  isSupportedLocale,
  localizePath,
  stripLocaleFromPathname
} from "./lib/i18n-config";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const pathnameHasLocale = isSupportedLocale(firstSegment);
  const requestHeaders = new Headers(request.headers);

  if (pathnameHasLocale) {
    if (firstSegment === DEFAULT_LOCALE) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = stripLocaleFromPathname(pathname);
      return NextResponse.redirect(redirectUrl);
    }

    requestHeaders.set(LOCALE_REQUEST_HEADER, firstSegment);
    const rewrittenUrl = request.nextUrl.clone();
    rewrittenUrl.pathname = stripLocaleFromPathname(pathname);

    return NextResponse.rewrite(rewrittenUrl, {
      request: { headers: requestHeaders }
    });
  }

  const storedLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;

  if (isSupportedLocale(storedLocale) && storedLocale !== DEFAULT_LOCALE) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = localizePath(pathname, storedLocale);
    return NextResponse.redirect(redirectUrl);
  }

  requestHeaders.set(
    LOCALE_REQUEST_HEADER,
    getLocaleFromPathname(pathname)
  );

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|mosaic|favicon.ico|robots.txt|sitemap.xml|feed.xml|manifest.webmanifest|.*\\..*).*)"
  ]
};

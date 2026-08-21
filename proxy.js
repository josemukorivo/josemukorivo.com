import { NextResponse } from "next/server";
import { appendVary, preferredRepresentation } from "./lib/accept";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_REQUEST_HEADER,
  getLocaleFromPathname,
  isSupportedLocale,
  localizePath,
  stripLocaleFromPathname
} from "./lib/i18n-config";

function prepareResponse(response) {
  appendVary(response.headers);
  response.headers.set("Link", "</llms.txt>; rel=\"describedby\"");
  return response;
}

function negotiateResponse(request, pathname, requestHeaders, response) {
  const representation = preferredRepresentation(
    request.headers.get("accept")
  );

  if (representation === null) {
    return prepareResponse(
      new NextResponse(
        "Not Acceptable\n\nAvailable representations: text/html, text/markdown\n",
        {
          status: 406,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        }
      )
    );
  }

  if (representation === "text/markdown") {
    const markdownUrl = request.nextUrl.clone();
    const normalizedPathname = stripLocaleFromPathname(pathname);
    markdownUrl.pathname =
      normalizedPathname === "/"
        ? "/api/agent-content"
        : `/api/agent-content${normalizedPathname}`;

    return prepareResponse(
      NextResponse.rewrite(markdownUrl, {
        request: { headers: requestHeaders }
      })
    );
  }

  return prepareResponse(response);
}

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

    return negotiateResponse(
      request,
      pathname,
      requestHeaders,
      NextResponse.rewrite(rewrittenUrl, {
        request: { headers: requestHeaders }
      })
    );
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

  return negotiateResponse(
    request,
    pathname,
    requestHeaders,
    NextResponse.next({ request: { headers: requestHeaders } })
  );
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|mosaic|favicon.ico|robots.txt|sitemap.xml|feed.xml|manifest.webmanifest|.*\\..*).*)"
  ]
};

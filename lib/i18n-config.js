export const DEFAULT_LOCALE = "en";
export const LOCALE_COOKIE_NAME = "joseph-site-locale";
export const LOCALE_REQUEST_HEADER = "x-joseph-site-locale";
export const SHONA_PROMPT_FLAG = "shona-language-prompt";

export const LOCALES = Object.freeze(["en", "sn", "fr", "es"]);

export const LOCALE_DETAILS = Object.freeze({
  en: {
    flag: "🇬🇧",
    htmlLang: "en-ZW",
    label: "English",
    openGraphLocale: "en_ZW"
  },
  sn: {
    flag: "🇿🇼",
    htmlLang: "sn-ZW",
    label: "ChiShona",
    openGraphLocale: "sn_ZW"
  },
  fr: {
    flag: "🇫🇷",
    htmlLang: "fr",
    label: "Français",
    openGraphLocale: "fr_FR"
  },
  es: {
    flag: "🇪🇸",
    htmlLang: "es",
    label: "Español",
    openGraphLocale: "es_ES"
  }
});

export function isSupportedLocale(locale) {
  return LOCALES.includes(locale);
}

export function getLocaleFromPathname(pathname = "/") {
  const locale = pathname.split("/").filter(Boolean)[0];
  return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
}

export function stripLocaleFromPathname(pathname = "/") {
  const segments = pathname.split("/").filter(Boolean);

  if (!isSupportedLocale(segments[0])) {
    return pathname || "/";
  }

  const strippedPathname = `/${segments.slice(1).join("/")}`;
  return strippedPathname === "/" ? "/" : strippedPathname.replace(/\/$/, "");
}

export function localizePath(href, locale) {
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    /^[a-z][a-z\d+.-]*:/i.test(href)
  ) {
    return href;
  }

  const url = new URL(href, "https://portfolio.local");
  const pathname = stripLocaleFromPathname(url.pathname);
  const localizedPathname =
    locale === DEFAULT_LOCALE
      ? pathname
      : `/${locale}${pathname === "/" ? "" : pathname}`;

  return `${localizedPathname}${url.search}${url.hash}`;
}

export function getLanguageAlternates(pathname) {
  return {
    "x-default": localizePath(pathname, DEFAULT_LOCALE),
    ...Object.fromEntries(
      LOCALES.map((locale) => [
        LOCALE_DETAILS[locale].htmlLang,
        localizePath(pathname, locale)
      ])
    )
  };
}

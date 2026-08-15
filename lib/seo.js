import {
  SITE_DESCRIPTION,
  SITE_HANDLE,
  SITE_LOCALE,
  SITE_NAME
} from "./site";
import {
  DEFAULT_LOCALE,
  LOCALE_DETAILS,
  getLanguageAlternates
} from "./i18n-config";

export function createPageMetadata({
  title,
  socialTitle = title,
  description = SITE_DESCRIPTION,
  path,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  locale = DEFAULT_LOCALE,
  languageAlternates = true,
  canonicalPath = path,
  robots
}) {
  const openGraph = {
    title: socialTitle,
    description,
    url: path,
    siteName: SITE_NAME,
    locale: LOCALE_DETAILS[locale]?.openGraphLocale ?? SITE_LOCALE,
    type
  };

  if (type === "article") {
    openGraph.publishedTime = publishedTime;
    openGraph.modifiedTime = modifiedTime;
    openGraph.authors = [SITE_NAME];
    openGraph.tags = tags;
  }

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
      ...(languageAlternates
        ? { languages: getLanguageAlternates(path) }
        : {})
    },
    ...(robots ? { robots } : {}),
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      creator: SITE_HANDLE
    }
  };
}

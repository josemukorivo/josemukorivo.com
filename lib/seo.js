import {
  SITE_DESCRIPTION,
  SITE_HANDLE,
  SITE_LOCALE,
  SITE_NAME
} from "./site";

export function createPageMetadata({
  title,
  socialTitle = title,
  description = SITE_DESCRIPTION,
  path,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  tags
}) {
  const openGraph = {
    title: socialTitle,
    description,
    url: path,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
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
      canonical: path
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      creator: SITE_HANDLE
    }
  };
}

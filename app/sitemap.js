import { getArticles } from "../lib/blog";
import { SITE_URL } from "../lib/site";
import { LOCALES, localizePath } from "../lib/i18n-config";

export default async function sitemap() {
  const articles = await getArticles();
  const latestUpdate = articles.reduce(
    (latest, article) =>
      !latest || new Date(article.updatedAt) > new Date(latest)
        ? article.updatedAt
        : latest,
    null
  );

  const localizedPages = LOCALES.flatMap((locale) => [
    {
      url: `${SITE_URL}${localizePath("/", locale)}`,
      ...(latestUpdate ? { lastModified: latestUpdate } : {}),
      changeFrequency: "monthly",
      priority: locale === "en" ? 1 : 0.9
    },
    {
      url: `${SITE_URL}${localizePath("/blog", locale)}`,
      ...(latestUpdate ? { lastModified: latestUpdate } : {}),
      changeFrequency: "weekly",
      priority: locale === "en" ? 0.8 : 0.7
    },
    {
      url: `${SITE_URL}${localizePath("/projects", locale)}`,
      changeFrequency: "monthly",
      priority: locale === "en" ? 0.8 : 0.7
    }
  ]);

  return [
    ...localizedPages,
    ...articles.map((article) => ({
      url: `${SITE_URL}/blog/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7
    }))
  ];
}

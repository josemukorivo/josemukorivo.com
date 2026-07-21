import { getArticles } from "../lib/blog";
import { SITE_URL } from "../lib/site";

export default async function sitemap() {
  const articles = await getArticles();
  const latestUpdate = articles.reduce(
    (latest, article) =>
      !latest || new Date(article.updatedAt) > new Date(latest)
        ? article.updatedAt
        : latest,
    null
  );

  return [
    {
      url: SITE_URL,
      ...(latestUpdate ? { lastModified: latestUpdate } : {}),
      changeFrequency: "monthly",
      priority: 1
    },
    {
      url: `${SITE_URL}/blog`,
      ...(latestUpdate ? { lastModified: latestUpdate } : {}),
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${SITE_URL}/projects`,
      changeFrequency: "monthly",
      priority: 0.8
    },
    ...articles.map((article) => ({
      url: `${SITE_URL}/blog/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7
    }))
  ];
}

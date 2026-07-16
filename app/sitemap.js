import { getArticles } from "../lib/blog";

const SITE_URL = "https://www.josemukorivo.com";

export default async function sitemap() {
  const articles = await getArticles();

  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "weekly",
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

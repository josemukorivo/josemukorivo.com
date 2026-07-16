import { getArticles } from "../../lib/blog";
import {
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_URL
} from "../../lib/site";

export const dynamic = "force-static";

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const articles = await getArticles();
  const lastBuildDate = articles[0]?.updatedAt ?? new Date().toISOString();
  const items = articles
    .map((article) => {
      const articleUrl = `${SITE_URL}/blog/${article.slug}`;

      return [
        "<item>",
        `<title>${escapeXml(article.title)}</title>`,
        `<link>${articleUrl}</link>`,
        `<guid isPermaLink="true">${articleUrl}</guid>`,
        `<description>${escapeXml(article.description)}</description>`,
        `<pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>`,
        ...article.tags.map(
          (tag) => `<category>${escapeXml(tag)}</category>`
        ),
        "</item>"
      ].join("");
    })
    .join("");
  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(`${SITE_NAME} — Writing`)}</title>`,
    `<link>${SITE_URL}/blog</link>`,
    `<description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    `<language>${SITE_LANGUAGE}</language>`,
    `<lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>`,
    `<atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />`,
    items,
    "</channel>",
    "</rss>"
  ].join("");

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}

import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");
const MARKDOWN_EXTENSION = ".md";
const VALID_SLUG_PATTERN = /^[a-z0-9-]+$/;
const ARTICLE_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric"
});

function toArticle(slug, source) {
  const { data, content } = matter(source);

  if (!data.title || !data.publishedAt) {
    throw new Error(
      `Blog article "${slug}" must define title and publishedAt frontmatter.`
    );
  }

  const readingStats = readingTime(content);

  return {
    id: data.id ?? slug,
    slug,
    title: data.title,
    description: data.description ?? "",
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt ?? data.publishedAt,
    tags: Array.isArray(data.tags) ? data.tags : [],
    socialImage: data.socialImage ?? null,
    originalUrl: data.originalUrl ?? null,
    readingTimeMinutes: Math.max(1, Math.ceil(readingStats.minutes)),
    wordCount: readingStats.words,
    content
  };
}

async function readArticle(slug) {
  if (!VALID_SLUG_PATTERN.test(slug)) {
    return null;
  }

  try {
    const source = await readFile(
      path.join(BLOG_DIRECTORY, `${slug}${MARKDOWN_EXTENSION}`),
      "utf8"
    );

    return toArticle(slug, source);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export const getArticle = cache(readArticle);

export const getArticles = cache(async () => {
  const filenames = await readdir(BLOG_DIRECTORY);
  const articlePromises = [];

  for (const filename of filenames) {
    if (!filename.endsWith(MARKDOWN_EXTENSION)) {
      continue;
    }

    articlePromises.push(
      readArticle(filename.slice(0, -MARKDOWN_EXTENSION.length))
    );
  }

  const loadedArticles = await Promise.all(articlePromises);
  const articles = [];

  for (const article of loadedArticles) {
    if (article) {
      articles.push(article);
    }
  }

  return articles.sort(
    (first, second) =>
      new Date(second.publishedAt).getTime() -
      new Date(first.publishedAt).getTime()
  );
});

export function formatArticleDate(date) {
  return ARTICLE_DATE_FORMATTER.format(new Date(date));
}

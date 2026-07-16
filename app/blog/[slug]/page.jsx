import { notFound } from "next/navigation";
import { CodeCopyEnhancer } from "../_components/code-copy-enhancer";
import { IndexLink } from "../_components/index-link";
import {
  formatArticleDate,
  getArticle,
  getArticles
} from "../../../lib/blog";
import { renderMarkdown } from "../../../lib/markdown";
import styles from "../blog.module.css";

const SITE_URL = "https://www.josemukorivo.com";
const ARTICLE_BODY_ID = "article-body";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {};
  }

  const canonicalUrl = `/blog/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    keywords: article.tags,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url: canonicalUrl,
      publishedTime: article.publishedAt,
      authors: ["Joseph Mukorivo"],
      tags: article.tags,
      images: article.socialImage
        ? [{ url: article.socialImage, alt: article.title }]
        : []
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      creator: "@josemukorivo",
      images: article.socialImage ? [article.socialImage] : []
    }
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const articleHtml = await renderMarkdown(article.content);
  const articleUrl = `${SITE_URL}/blog/${article.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.socialImage,
    url: articleUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: "Joseph Mukorivo",
      url: SITE_URL
    },
    publisher: {
      "@type": "Person",
      name: "Joseph Mukorivo",
      url: SITE_URL
    }
  };

  return (
    <main className={styles.articleShell}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c")
        }}
      />

      <article>
        <header className={styles.articleHeader}>
          <IndexLink href="/blog" />
          <div className={styles.articleMeta}>
            <time dateTime={article.publishedAt}>
              {formatArticleDate(article.publishedAt)}
            </time>
            <span>
              {article.readingTimeMinutes} min
              {article.readingTimeMinutes === 1 ? "" : "s"} read
            </span>
          </div>
          <h1 className={styles.articleTitle}>{article.title}</h1>
        </header>

        <div
          id={ARTICLE_BODY_ID}
          className={styles.articleBody}
          dangerouslySetInnerHTML={{ __html: articleHtml }}
        />
        <CodeCopyEnhancer containerId={ARTICLE_BODY_ID} />
      </article>
    </main>
  );
}

import { notFound } from "next/navigation";
import { IndexLink } from "../../_components/index-link";
import { JsonLd } from "../../_components/json-ld";
import { PageShell } from "../../_components/page-shell";
import { ArticleMap } from "../_components/article-map";
import { ArticleNavigation } from "../_components/article-navigation";
import { CodeCopyEnhancer } from "../_components/code-copy-enhancer";
import { ScrollToTop } from "../_components/scroll-to-top";
import {
  formatArticleDate,
  getArticle,
  getArticles
} from "../../../lib/blog";
import { getArticleHeadings, renderMarkdown } from "../../../lib/markdown";
import { createPageMetadata } from "../../../lib/seo";
import {
  BLOG_ID,
  PERSON_ID,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID
} from "../../../lib/site";
import styles from "../article.module.css";

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

  return createPageMetadata({
    title: article.title,
    description: article.description,
    path: `/blog/${article.slug}`,
    keywords: article.tags,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    tags: article.tags
  });
}

export default async function ArticlePage({ params }) {
  const [{ slug }, articles] = await Promise.all([params, getArticles()]);
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  const [articleHtml, articleHeadings] = await Promise.all([
    renderMarkdown(article.content),
    getArticleHeadings(article.content)
  ]);
  const articleUrl = `${SITE_URL}/blog/${article.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    url: articleUrl,
    headline: article.title,
    description: article.description,
    image: article.socialImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: "en",
    wordCount: article.wordCount,
    timeRequired: `PT${article.readingTimeMinutes}M`,
    keywords: article.tags.join(", "),
    articleSection: article.tags,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
      isPartOf: {
        "@id": WEBSITE_ID
      }
    },
    isPartOf: {
      "@id": BLOG_ID
    },
    author: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE_NAME,
      url: SITE_URL
    },
    publisher: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE_NAME,
      url: SITE_URL
    }
  };

  return (
    <PageShell variant="article">
      <JsonLd data={articleSchema} />
      <ArticleMap headings={articleHeadings} />

      <article className="m-0">
        <header className="mb-11 text-ink" data-reveal="article-header">
          <div data-reveal-item>
            <IndexLink href="/blog" />
          </div>
          <div
            className="reveal-article-meta mb-[18px] mt-11 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-muted max-[680px]:mt-9"
            data-reveal-item
          >
            <time dateTime={article.publishedAt}>
              {formatArticleDate(article.publishedAt)}
            </time>
            <span>
              {article.readingTimeMinutes} min
              {article.readingTimeMinutes === 1 ? "" : "s"} read
            </span>
          </div>
          <h1
            className="reveal-article-title max-w-[600px] text-[clamp(26px,3.5vw,32px)] font-medium leading-[1.15] tracking-[-0.025em] max-[680px]:text-[26px]"
            data-reveal-item
          >
            {article.title}
          </h1>
        </header>

        <div
          className={styles.articleBody}
          dangerouslySetInnerHTML={{ __html: articleHtml }}
          id={ARTICLE_BODY_ID}
        />
        <CodeCopyEnhancer containerId={ARTICLE_BODY_ID} />
        <ArticleNavigation articles={articles} currentSlug={article.slug} />
      </article>
      <ScrollToTop />
    </PageShell>
  );
}

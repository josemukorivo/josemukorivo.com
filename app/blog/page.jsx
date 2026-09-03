import { BackLink } from "../_components/back-link";
import { JsonLd } from "../_components/json-ld";
import { PageShell } from "../_components/page-shell";
import { WritingList } from "../_components/writing-list";
import { getArticles } from "../../lib/blog";
import { LOCALE_DETAILS, localizePath } from "../../lib/i18n-config";
import { getMessages, getRequestLocale } from "../../lib/i18n-server";
import { createPageMetadata } from "../../lib/seo";
import {
  BLOG_ID,
  PERSON_ID,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID,
  absoluteUrl
} from "../../lib/site";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return createPageMetadata({
    title: messages.writing.title,
    socialTitle: `${messages.writing.title} — Joseph Mukorivo`,
    description: messages.writing.description,
    path: localizePath("/blog", locale),
    locale,
    keywords: [
      "AI product engineering",
      "AI agents",
      "conversational AI",
      "software engineering writing",
      "Next.js architecture",
      "Go programming",
      "Joseph Mukorivo"
    ]
  });
}

export default async function BlogPage() {
  const [articles, locale] = await Promise.all([
    getArticles(),
    getRequestLocale()
  ]);
  const messages = getMessages(locale);
  const articleDateFormatter = new Intl.DateTimeFormat(
    LOCALE_DETAILS[locale].htmlLang,
    { month: "short", year: "numeric" }
  );
  const writingItems = articles.map((article) => ({
    id: article.id,
    href: localizePath(`/blog/${article.slug}`, locale),
    title: article.title,
    date: articleDateFormatter.format(new Date(article.publishedAt)),
    dateTime: article.publishedAt
  }));
  const blogSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": BLOG_ID,
        url: absoluteUrl(localizePath("/blog", locale)),
        name: `${SITE_NAME} — ${messages.writing.title}`,
        description: messages.writing.description,
        inLanguage: locale,
        isPartOf: {
          "@id": WEBSITE_ID
        },
        author: {
          "@id": PERSON_ID
        },
        publisher: {
          "@id": PERSON_ID
        },
        blogPost: articles.map((article) => ({
          "@type": "BlogPosting",
          "@id": `${SITE_URL}/blog/${article.slug}#article`,
          url: `${SITE_URL}/blog/${article.slug}`,
          headline: article.title,
          description: article.description,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt
        }))
      },
      {
        "@type": "ItemList",
        name: `${SITE_NAME} ${messages.writing.title}`,
        numberOfItems: articles.length,
        itemListElement: articles.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/blog/${article.slug}`,
          name: article.title
        }))
      }
    ]
  };

  return (
    <PageShell variant="writing">
      <JsonLd data={blogSchema} />

      <header
        className="grid grid-cols-[160px_minmax(0,1fr)] items-center gap-x-10 max-[680px]:grid-cols-1"
        data-reveal="page-header"
      >
        <div data-reveal-item>
          <BackLink
            href={localizePath("/", locale)}
            label={messages.navigation.home}
          />
        </div>
        <div
          className="reveal-page-heading max-[680px]:mt-10"
          data-reveal-item
        >
          <h1 className="text-base font-medium leading-6">
            {messages.writing.title}
          </h1>
        </div>
      </header>

      <section
        className="ml-[200px] mt-[72px] max-w-[640px] max-[680px]:ml-0 max-[680px]:mt-12 max-[680px]:max-w-none"
        data-reveal="writing-list"
      >
        {articles.length > 0 ? (
          <WritingList articles={writingItems} revealItems />
        ) : (
          <p
            className="border-y border-rule py-12 text-subtle"
            data-reveal-item
          >
            {messages.writing.empty}
          </p>
        )}
      </section>
    </PageShell>
  );
}

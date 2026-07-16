import { IndexLink } from "../_components/index-link";
import { JsonLd } from "../_components/json-ld";
import { PageShell } from "../_components/page-shell";
import { WritingList } from "../_components/writing-list";
import { getArticles } from "../../lib/blog";
import { createPageMetadata } from "../../lib/seo";
import {
  BLOG_ID,
  PERSON_ID,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID,
  absoluteUrl
} from "../../lib/site";

const description =
  "Joseph Mukorivo’s writing on software engineering, product development, AI, cloud infrastructure, and building complex systems.";

export const metadata = createPageMetadata({
  title: "Writing",
  socialTitle: "Writing — Joseph Mukorivo",
  description,
  path: "/blog",
  keywords: [
    "software engineering writing",
    "AI product development",
    "Next.js architecture",
    "Go programming",
    "Joseph Mukorivo"
  ]
});

const articleDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric"
});

export default async function BlogPage() {
  const articles = await getArticles();
  const writingItems = articles.map((article) => ({
    id: article.id,
    href: `/blog/${article.slug}`,
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
        url: absoluteUrl("/blog"),
        name: `${SITE_NAME} — Writing`,
        description,
        inLanguage: "en",
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
        name: `${SITE_NAME} writing`,
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

      <header className="grid grid-cols-[160px_minmax(0,640px)] items-center gap-x-10 max-[680px]:grid-cols-[1fr_auto] max-[680px]:gap-x-6">
        <IndexLink href="/" />
        <h1 className="text-base font-medium leading-6">Writing</h1>
      </header>

      <section className="ml-[200px] mt-[72px] max-w-[640px] max-[680px]:ml-0 max-[680px]:mt-12 max-[680px]:max-w-none">
        {articles.length > 0 ? (
          <WritingList articles={writingItems} />
        ) : (
          <p className="border-y border-rule py-12 text-subtle">
            No articles are available right now. Please check back soon.
          </p>
        )}
      </section>
    </PageShell>
  );
}

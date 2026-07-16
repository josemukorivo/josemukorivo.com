import { ArticleRow } from "./_components/article-row";
import { IndexLink } from "./_components/index-link";
import { getArticles } from "../../lib/blog";
import styles from "./blog.module.css";

export const metadata = {
  title: "Writing",
  description:
    "Joseph Mukorivo’s writing on software engineering, product development, AI, cloud infrastructure, and building complex systems.",
  alternates: {
    canonical: "/blog"
  },
  openGraph: {
    title: "Writing — Joseph Mukorivo",
    description:
      "Essays on software engineering, product development, AI, and building complex systems.",
    url: "/blog",
    type: "website"
  }
};

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <main className={styles.shell}>
      <header className={styles.indexHeader}>
        <IndexLink href="/" />
        <h1 className={styles.pageTitle}>Writing</h1>
      </header>

      <section className={styles.writing}>
        {articles.length > 0 ? (
          <div className="rows writing-list">
            {articles.map((article) => (
              <ArticleRow article={article} key={article.id} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>
            No articles are available right now. Please check back soon.
          </p>
        )}
      </section>
    </main>
  );
}

import Link from "next/link";
import styles from "../article.module.css";

function NavigationArrow({ direction }) {
  return (
    <svg
      aria-hidden="true"
      className={styles.articleNavigationArrow}
      viewBox="0 0 18 18"
    >
      <path d={direction === "previous" ? "M11 4 6 9l5 5" : "m7 4 5 5-5 5"} />
    </svg>
  );
}

function ArticleNavigationLink({ article, direction }) {
  const isPrevious = direction === "previous";

  return (
    <Link
      className={`${styles.articleNavigationLink} ${
        isPrevious
          ? styles.articleNavigationLinkPrevious
          : styles.articleNavigationLinkNext
      }`}
      href={`/blog/${article.slug}`}
      rel={isPrevious ? "prev" : "next"}
    >
      {isPrevious ? <NavigationArrow direction={direction} /> : null}
      <span className={styles.articleNavigationCopy}>
        <span className={styles.articleNavigationLabel}>
          {isPrevious ? "Previous article" : "Next article"}
        </span>
        <span className={styles.articleNavigationTitle}>{article.title}</span>
      </span>
      {isPrevious ? null : <NavigationArrow direction={direction} />}
    </Link>
  );
}

export function ArticleNavigation({ articles, currentSlug }) {
  if (articles.length < 2) {
    return null;
  }

  const currentIndex = articles.findIndex(
    (article) => article.slug === currentSlug
  );

  if (currentIndex === -1) {
    return null;
  }

  const previousArticle =
    articles[(currentIndex - 1 + articles.length) % articles.length];
  const nextArticle = articles[(currentIndex + 1) % articles.length];

  return (
    <nav aria-label="More articles" className={styles.articleNavigation}>
      <ArticleNavigationLink
        article={previousArticle}
        direction="previous"
      />
      <ArticleNavigationLink article={nextArticle} direction="next" />
    </nav>
  );
}

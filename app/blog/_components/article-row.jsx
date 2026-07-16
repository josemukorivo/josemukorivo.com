import Link from "next/link";

const articleDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric"
});

export function ArticleRow({ article }) {
  return (
    <Link className="writing-row" href={`/blog/${article.slug}`}>
      <span className="writing-title">
        <span>{article.title}</span>
      </span>
      <time dateTime={article.publishedAt}>
        {articleDateFormatter.format(new Date(article.publishedAt))}
      </time>
    </Link>
  );
}

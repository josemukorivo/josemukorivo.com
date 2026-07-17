import Link from "next/link";

export function WritingList({ articles, revealItems = false }) {
  return (
    <div className="border-t border-rule">
      {articles.map((article) => (
        <Link
          className="writing-list-item group grid grid-cols-[minmax(0,1fr)_86px] gap-5 border-b border-rule py-[13px] max-[640px]:grid-cols-[minmax(0,1fr)_72px] max-[640px]:gap-3"
          data-reveal-item={revealItems ? "" : undefined}
          href={article.href}
          key={article.id ?? article.href}
        >
          <span className="min-w-0">
            <span className="writing-link-title">{article.title}</span>
          </span>
          <time
            className="text-right text-[13px] text-muted transition-colors duration-160 ease-standard group-hover:text-subtle motion-reduce:transition-none"
            dateTime={article.dateTime}
          >
            {article.date}
          </time>
        </Link>
      ))}
    </div>
  );
}

import Image from "next/image";

function ExternalArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M5 11 11 5m-4.5 0H11v4.5" />
    </svg>
  );
}

function ResourceResult({ description, eyebrow, href, title }) {
  return (
    <a
      className="assistant-resource-card assistant-generative-ui"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="assistant-resource-heading">
        <span className="assistant-resource-kicker">{eyebrow}</span>
        <ExternalArrow />
      </span>
      <strong className="assistant-resource-title">{title}</strong>
      <span className="assistant-resource-description">{description}</span>
    </a>
  );
}

export function ResumeCard({ output }) {
  return (
    <ResourceResult
      description={output.description}
      eyebrow="Résumé · PDF"
      href={output.href}
      title={output.title}
    />
  );
}

export function ProjectCard({ output }) {
  return (
    <ResourceResult
      description={output.description}
      eyebrow="Selected project"
      href={output.href}
      title={output.name}
    />
  );
}

export function ArticleCards({ label = "Related writing", output }) {
  return (
    <div className="assistant-article-results assistant-generative-ui">
      <span className="assistant-results-label">{label}</span>
      <div className="assistant-article-list">
        {output.results.map((article) => (
          <a
            className="assistant-article-card"
            href={article.href}
            key={article.href}
          >
            <span>{article.title}</span>
            <ExternalArrow />
          </a>
        ))}
      </div>
    </div>
  );
}

export function JosephPhotos({ output }) {
  return (
    <div
      className="assistant-photo-grid assistant-generative-ui"
      data-count={output.images.length}
    >
      {output.images.map((photo) => (
        <figure className="assistant-photo" key={photo.src}>
          <span className="assistant-photo-frame">
            <Image
              alt={photo.alt}
              fill
              sizes="(max-width: 680px) calc(100vw - 76px), 184px"
              src={photo.src}
            />
          </span>
          <figcaption>{photo.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

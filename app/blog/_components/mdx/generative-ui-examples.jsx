"use client";

import { useState } from "react";
import {
  ArticleCards,
  JosephPhotos,
  ResumeCard
} from "../../../_components/assistant-generative-ui";
import styles from "./article-components.module.css";

const EXAMPLES = [
  { id: "articles", label: "Articles" },
  { id: "resume", label: "Résumé" },
  { id: "photos", label: "Photos" }
];

const ARTICLE_OUTPUT = {
  results: [
    {
      href: "/blog/turning-a-personal-website-into-an-ai-assistant",
      title: "Turning a Personal Website Into an AI Assistant"
    },
    {
      href: "/blog/what-i-mean-when-i-say-software-should-feel-considered",
      title: "What I Mean When I Say Software Should Feel Considered"
    },
    {
      href: "/blog/engineering-leadership-is-a-product-role",
      title: "Engineering Leadership Is a Product Role"
    }
  ]
};

const RESUME_OUTPUT = {
  description:
    "A two-page résumé covering engineering leadership, AI products, full-stack systems, fintech, cloud infrastructure, and selected impact.",
  href: "/assets/joseph-mukorivo-resume.pdf",
  title: "Joseph Mukorivo — Head of Engineering"
};

const PHOTO_OUTPUT = {
  images: [
    {
      src: "/assets/joseph-professional.webp",
      alt: "Professional portrait of Joseph Mukorivo",
      label: "Joseph Mukorivo"
    },
    {
      src: "/assets/joseph-workspace.webp",
      alt: "Joseph Mukorivo at his home workspace",
      label: "At his workspace"
    }
  ]
};

function ExampleContent({ activeExample }) {
  if (activeExample === "resume") {
    return <ResumeCard output={RESUME_OUTPUT} />;
  }

  if (activeExample === "photos") {
    return <JosephPhotos output={PHOTO_OUTPUT} />;
  }

  return <ArticleCards output={ARTICLE_OUTPUT} />;
}

export function GenerativeUiExamples() {
  const [activeExample, setActiveExample] = useState("articles");

  return (
    <figure
      aria-labelledby="generative-ui-title"
      className={styles.figure}
    >
      <figcaption className={styles.figureHeader}>
        <span className={styles.figureTitle} id="generative-ui-title">
          One tool result can become several kinds of interface
        </span>
      </figcaption>
      <div
        aria-label="Generative UI examples"
        className={styles.generativeUiTabs}
        role="group"
      >
        {EXAMPLES.map((example) => (
          <button
            aria-pressed={activeExample === example.id}
            className={styles.generativeUiTab}
            key={example.id}
            onClick={() => setActiveExample(example.id)}
            type="button"
          >
            {example.label}
          </button>
        ))}
      </div>
      <div className={styles.generativeUiStage}>
        <ExampleContent activeExample={activeExample} />
      </div>
    </figure>
  );
}

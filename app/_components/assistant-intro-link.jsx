"use client";

import Link from "next/link";
import { requestPortfolioAssistantOpen } from "./assistant-events";

function AssistantArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M4 12 12 4M6 4h6v6" />
    </svg>
  );
}

export function AssistantIntroLink({ children }) {
  return (
    <>
      <button
        aria-controls="portfolio-assistant-dialog"
        className="assistant-intro-link assistant-intro-link-desktop"
        onClick={() => requestPortfolioAssistantOpen("homepage_intro")}
        type="button"
      >
        <span>{children}</span>
        <AssistantArrow />
        <span className="sr-only">—opens my AI assistant</span>
      </button>
      <Link
        className="assistant-intro-link assistant-intro-link-mobile"
        href="/assistant"
      >
        <span>{children}</span>
        <AssistantArrow />
        <span className="sr-only">—opens my AI assistant</span>
      </Link>
    </>
  );
}

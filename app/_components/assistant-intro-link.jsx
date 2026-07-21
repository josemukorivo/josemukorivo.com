"use client";

import { requestPortfolioAssistantOpen } from "./assistant-events";

function AssistantArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M4 12 12 4M6 4h6v6" />
    </svg>
  );
}

function openAssistant() {
  requestPortfolioAssistantOpen("homepage_intro");
}

export function AssistantIntroLink({ children }) {
  return (
    <button
      aria-controls="portfolio-assistant-dialog"
      className="assistant-intro-link"
      onClick={openAssistant}
      type="button"
    >
      <span>{children}</span>
      <AssistantArrow />
      <span className="sr-only">—opens my AI assistant</span>
    </button>
  );
}

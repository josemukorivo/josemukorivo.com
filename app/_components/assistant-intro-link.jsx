"use client";

import { OPEN_PORTFOLIO_ASSISTANT_EVENT } from "./assistant-events";

function AssistantArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M4 12 12 4M6 4h6v6" />
    </svg>
  );
}

export function AssistantIntroLink() {
  function openAssistant() {
    window.dispatchEvent(new Event(OPEN_PORTFOLIO_ASSISTANT_EVENT));
  }

  return (
    <button
      aria-controls="portfolio-assistant-dialog"
      className="assistant-intro-link"
      onClick={openAssistant}
      type="button"
    >
      <span>ask about Joseph</span>
      <AssistantArrow />
      <span className="sr-only"> using his AI assistant</span>
    </button>
  );
}

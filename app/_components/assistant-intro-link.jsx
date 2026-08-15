"use client";

import Link from "next/link";
import { requestPortfolioAssistantOpen } from "./assistant-events";
import { HandDrawnArrowIcon } from "./hand-drawn-icon";

function AssistantArrow() {
  return <HandDrawnArrowIcon />;
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
        <span className="sr-only">—opens Maya, my AI assistant</span>
      </button>
      <Link
        className="assistant-intro-link assistant-intro-link-mobile"
        href="/assistant"
      >
        <span>{children}</span>
        <AssistantArrow />
        <span className="sr-only">—opens Maya, my AI assistant</span>
      </Link>
    </>
  );
}

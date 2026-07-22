"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { consumePortfolioAssistantPrompt } from "./assistant-events";
import { PortfolioAssistant } from "./portfolio-assistant";

export function PortfolioAssistantPage() {
  const router = useRouter();
  const [initialPrompt] = useState(consumePortfolioAssistantPrompt);

  return (
    <PortfolioAssistant
      initialPrompt={initialPrompt}
      onClose={() => router.push("/")}
      open
      presentation="page"
    />
  );
}

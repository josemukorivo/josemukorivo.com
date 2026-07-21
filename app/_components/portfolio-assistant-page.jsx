"use client";

import { useRouter } from "next/navigation";
import { PortfolioAssistant } from "./portfolio-assistant";

export function PortfolioAssistantPage() {
  const router = useRouter();

  return (
    <PortfolioAssistant
      onClose={() => router.push("/")}
      open
      presentation="page"
    />
  );
}

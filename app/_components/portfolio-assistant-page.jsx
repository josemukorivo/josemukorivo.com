"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  getLocaleFromPathname,
  localizePath
} from "../../lib/i18n-config";
import { consumePortfolioAssistantPrompt } from "./assistant-events";
import { PortfolioAssistant } from "./portfolio-assistant";

export function PortfolioAssistantPage() {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const locale = getLocaleFromPathname(pathname);
  const [initialPrompt] = useState(consumePortfolioAssistantPrompt);

  return (
    <PortfolioAssistant
      initialPrompt={initialPrompt}
      onClose={() => router.push(localizePath("/", locale))}
      open
      presentation="page"
    />
  );
}

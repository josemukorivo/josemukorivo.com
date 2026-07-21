import "server-only";

import { withTracing } from "@posthog/ai/vercel";
import { PostHog } from "posthog-node";

const projectToken =
  process.env.POSTHOG_PROJECT_TOKEN ||
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host =
  process.env.POSTHOG_HOST ||
  process.env.NEXT_PUBLIC_POSTHOG_HOST ||
  "https://us.i.posthog.com";

function getPostHogClient() {
  if (!projectToken) {
    return null;
  }

  if (!globalThis.__josephPortfolioPostHog) {
    globalThis.__josephPortfolioPostHog = new PostHog(projectToken, {
      flushAt: 1,
      flushInterval: 0,
      host,
      privacyMode: true
    });
  }

  return globalThis.__josephPortfolioPostHog;
}

export function createPostHogTracedModel(
  model,
  { distinctId, properties = {} } = {}
) {
  const client = getPostHogClient();

  if (!client) {
    return model;
  }

  return withTracing(model, client, {
    posthogCaptureImmediate: true,
    posthogDistinctId: distinctId,
    posthogPrivacyMode: true,
    posthogProperties: {
      $ai_trace_name: "portfolio_assistant",
      assistant: "joseph_portfolio",
      ...properties
    }
  });
}

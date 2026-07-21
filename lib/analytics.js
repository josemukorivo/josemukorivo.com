import posthog from "posthog-js";

export const ANALYTICS_EVENTS = Object.freeze({
  assistantNavigationRequested: "assistant_navigation_requested",
  assistantNewChatStarted: "assistant_new_chat_started",
  assistantOpened: "assistant_opened",
  assistantQuestionSubmitted: "assistant_question_submitted",
  assistantResponseCompleted: "assistant_response_completed",
  assistantResponseFailed: "assistant_response_failed",
  assistantResponseStopped: "assistant_response_stopped",
  linkPreviewViewed: "link_preview_viewed"
});

function analyticsIsConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN);
}

export function captureAnalyticsEvent(event, properties = {}) {
  if (typeof window === "undefined" || !analyticsIsConfigured()) {
    return;
  }

  posthog.capture(event, {
    analytics_area: "portfolio",
    ...properties
  });
}

export function getPostHogDistinctId() {
  if (typeof window === "undefined" || !analyticsIsConfigured()) {
    return undefined;
  }

  try {
    return posthog.get_distinct_id();
  } catch {
    return undefined;
  }
}

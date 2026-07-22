import posthog from "posthog-js";

export const ANALYTICS_EVENTS = Object.freeze({
  assistantNavigationRequested: "assistant_navigation_requested",
  assistantNewChatStarted: "assistant_new_chat_started",
  assistantOpened: "assistant_opened",
  assistantMessageCopied: "assistant_message_copied",
  assistantMessageRetried: "assistant_message_retried",
  assistantQuestionSubmitted: "assistant_question_submitted",
  assistantResponseCompleted: "assistant_response_completed",
  assistantResponseFailed: "assistant_response_failed",
  assistantResponseStopped: "assistant_response_stopped",
  assistantTranscriptionCompleted: "assistant_transcription_completed",
  assistantTranscriptionStarted: "assistant_transcription_started",
  assistantThemeChanged: "assistant_theme_changed",
  assistantVoiceEnded: "assistant_voice_ended",
  assistantVoiceFailed: "assistant_voice_failed",
  assistantVoiceStarted: "assistant_voice_started",
  contactMessageFailed: "contact_message_failed",
  contactMessagePrepared: "contact_message_prepared",
  contactMessageSendRequested: "contact_message_send_requested",
  contactMessageSent: "contact_message_sent",
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

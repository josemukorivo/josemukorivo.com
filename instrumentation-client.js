import posthog from "posthog-js";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (projectToken) {
  posthog.init(projectToken, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageleave: true,
    capture_pageview: "history_change",
    defaults: "2026-06-25",
    person_profiles: "identified_only",
    respect_dnt: true,
    session_recording: {
      maskAllInputs: true,
      recordBody: false,
      recordHeaders: false,
      streamNetworkBody: false
    }
  });
}

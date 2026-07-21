import posthog from "posthog-js";

import {
  POSTHOG_PROXY_PATH,
  POSTHOG_UI_HOST
} from "./lib/posthog-config.mjs";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (projectToken) {
  posthog.init(projectToken, {
    api_host: POSTHOG_PROXY_PATH,
    ui_host: POSTHOG_UI_HOST,
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

import { buildRealtimeAssistantInstructions } from "../../../../../lib/assistant-profile";
import {
  claimDailyAllowance,
  formatRecentConversation,
  getSafetyIdentifier,
  isRateLimited,
  releaseDailyAllowance,
  serializeDailyAllowanceCookie,
  validateMessages
} from "../../../../../lib/assistant-request";
import { createRealtimeAssistantTools } from "../../../../../lib/assistant-tools";
import {
  VOICE_ALLOWANCE_BUCKET,
  VOICE_ALLOWANCE_COOKIE,
  VOICE_ALLOWANCE_SECONDS,
  VOICE_ALLOWANCE_WINDOW_MS
} from "../../../../../lib/assistant-voice-allowance";
import { getArticles } from "../../../../../lib/blog";
import { projects } from "../../../../../lib/projects";

export const maxDuration = 15;

const OPENAI_REALTIME_CLIENT_SECRETS_URL =
  "https://api.openai.com/v1/realtime/client_secrets";
const REALTIME_MODEL = "gpt-realtime-2.1-mini";
const REALTIME_TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";
const REALTIME_VOICE = "cedar";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_REQUESTS = 20;

function getCurrentPath(value) {
  return typeof value === "string" && value.length <= 240 ? value : "/";
}

async function readResponseBody(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return { error: { message: text } };
  }
}

export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "The assistant is not configured yet." },
      { status: 503 }
    );
  }

  if (
    isRateLimited(request, {
      bucket: "realtime-session",
      requests: RATE_LIMIT_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS
    })
  ) {
    return Response.json(
      { error: "Too many voice sessions. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = body.messages ?? [];
  if (!validateMessages(messages, { allowEmpty: true })) {
    return Response.json({ error: "Invalid conversation." }, { status: 400 });
  }

  const articles = await getArticles();
  const currentPath = getCurrentPath(body.currentPath);
  const currentArticle = articles.find(
    (article) => currentPath === `/blog/${article.slug}`
  );
  const recentConversation = formatRecentConversation(messages);
  const safetyIdentifier = getSafetyIdentifier(request);
  const payload = {
    session: {
      type: "realtime",
      model: REALTIME_MODEL,
      instructions: buildRealtimeAssistantInstructions({
        articles,
        currentArticle,
        projects,
        recentConversation
      }),
      max_output_tokens: 500,
      output_modalities: ["audio"],
      tool_choice: "auto",
      tools: createRealtimeAssistantTools(),
      audio: {
        input: {
          noise_reduction: {
            type: "near_field"
          },
          transcription: {
            language: "en",
            model: REALTIME_TRANSCRIPTION_MODEL,
            prompt:
              "Expect names and terms including Joseph Mukorivo, Complexus, FortyOne, Art Circles, AMAKA Studio, Vocinity, Harare, Zimbabwe, Next.js, Expo, Go, Kubernetes, and PostHog."
          },
          turn_detection: {
            type: "server_vad",
            threshold: 0.75,
            prefix_padding_ms: 300,
            silence_duration_ms: 700,
            create_response: true,
            interrupt_response: true
          }
        },
        output: {
          voice: REALTIME_VOICE
        }
      }
    }
  };
  const dailyAllowance = claimDailyAllowance(request, {
    bucket: VOICE_ALLOWANCE_BUCKET,
    cookieName: VOICE_ALLOWANCE_COOKIE,
    limitSeconds: VOICE_ALLOWANCE_SECONDS,
    windowMs: VOICE_ALLOWANCE_WINDOW_MS
  });

  if (!dailyAllowance.allowed) {
    const hasActiveSession = dailyAllowance.reason === "active_session";
    return Response.json(
      {
        code: hasActiveSession
          ? "voice_session_active"
          : "daily_voice_limit_reached",
        error: hasActiveSession
          ? "Another Live voice session is still active. End it before starting a new one."
          : "You have used your three-minute Live voice allowance. Please try again when it resets.",
        retryAfterSeconds: dailyAllowance.retryAfterSeconds
      },
      {
        status: hasActiveSession ? 409 : 429,
        headers: {
          "Retry-After": String(dailyAllowance.retryAfterSeconds)
        }
      }
    );
  }

  let openAIResponse;

  try {
    openAIResponse = await fetch(OPENAI_REALTIME_CLIENT_SECRETS_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Safety-Identifier": safetyIdentifier
      },
      signal: AbortSignal.timeout(12_000)
    });
  } catch (error) {
    releaseDailyAllowance(dailyAllowance);
    console.error("Portfolio realtime session creation failed", error);
    return Response.json(
      { error: "The voice session could not be created." },
      { status: 502 }
    );
  }

  const responseBody = await readResponseBody(openAIResponse);
  if (!openAIResponse.ok) {
    releaseDailyAllowance(dailyAllowance);
    console.error("OpenAI realtime session request failed", {
      status: openAIResponse.status,
      error: responseBody?.error?.message
    });
    return Response.json(
      { error: "The voice session could not be created." },
      { status: 502 }
    );
  }

  const clientSecret =
    responseBody.value || responseBody.client_secret?.value || null;
  const expiresAt =
    responseBody.expires_at || responseBody.client_secret?.expires_at || null;

  if (!clientSecret) {
    releaseDailyAllowance(dailyAllowance);
    return Response.json(
      { error: "The voice session did not include a client secret." },
      { status: 502 }
    );
  }

  const response = Response.json({
    clientSecret,
    dailyLimitSeconds: VOICE_ALLOWANCE_SECONDS,
    dailyRemainingSeconds: dailyAllowance.remainingSeconds,
    dailyResetAt: dailyAllowance.expiresAt,
    expiresAt,
    maxSessionSeconds: dailyAllowance.maxSessionSeconds,
    model: REALTIME_MODEL,
    sessionId: dailyAllowance.sessionId,
    voice: REALTIME_VOICE
  });
  response.headers.append(
    "Set-Cookie",
    serializeDailyAllowanceCookie(request, dailyAllowance)
  );

  return response;
}

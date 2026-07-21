import {
  completeDailyAllowance,
  isRateLimited,
  serializeDailyAllowanceCookie
} from "../../../../../../lib/assistant-request";
import {
  VOICE_ALLOWANCE_BUCKET,
  VOICE_ALLOWANCE_COOKIE,
  VOICE_ALLOWANCE_SECONDS,
  VOICE_ALLOWANCE_WINDOW_MS
} from "../../../../../../lib/assistant-voice-allowance";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_REQUESTS = 40;

function isValidSessionId(value) {
  return (
    typeof value === "string" &&
    value.length >= 16 &&
    value.length <= 100 &&
    /^[A-Za-z0-9-]+$/.test(value)
  );
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
      bucket: "realtime-session-end",
      requests: RATE_LIMIT_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS
    })
  ) {
    return Response.json(
      { error: "Too many voice session updates." },
      { status: 429 }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isValidSessionId(body.sessionId)) {
    return Response.json({ error: "Invalid voice session." }, { status: 400 });
  }

  const allowance = completeDailyAllowance(request, {
    bucket: VOICE_ALLOWANCE_BUCKET,
    cookieName: VOICE_ALLOWANCE_COOKIE,
    limitSeconds: VOICE_ALLOWANCE_SECONDS,
    sessionId: body.sessionId,
    windowMs: VOICE_ALLOWANCE_WINDOW_MS
  });
  const response = Response.json({
    dailyLimitSeconds: VOICE_ALLOWANCE_SECONDS,
    dailyRemainingSeconds: allowance.remainingSeconds,
    dailyResetAt: allowance.expiresAt,
    elapsedSeconds: allowance.elapsedSeconds || 0,
    success: true
  });
  response.headers.set("Cache-Control", "no-store");
  response.headers.append(
    "Set-Cookie",
    serializeDailyAllowanceCookie(request, allowance)
  );

  return response;
}

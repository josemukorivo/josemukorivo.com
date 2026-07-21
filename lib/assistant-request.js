import "server-only";

import {
  createHash,
  createHmac,
  randomUUID,
  timingSafeEqual
} from "node:crypto";

const rateLimitStore =
  globalThis.__josephPortfolioAssistantRateLimit ?? new Map();
const dailyAllowanceStore =
  globalThis.__josephPortfolioAssistantDailyAllowance ?? new Map();
const PENDING_ALLOWANCE_TTL_MS = 60 * 1000;

if (!globalThis.__josephPortfolioAssistantRateLimit) {
  globalThis.__josephPortfolioAssistantRateLimit = rateLimitStore;
}

if (!globalThis.__josephPortfolioAssistantDailyAllowance) {
  globalThis.__josephPortfolioAssistantDailyAllowance = dailyAllowanceStore;
}

function getCookie(request, name) {
  const cookies = request.headers.get("cookie");
  if (!cookies) return null;

  for (const cookie of cookies.split(";")) {
    const separatorIndex = cookie.indexOf("=");
    if (separatorIndex === -1) continue;

    const cookieName = cookie.slice(0, separatorIndex).trim();
    if (cookieName !== name) continue;

    try {
      return decodeURIComponent(cookie.slice(separatorIndex + 1).trim());
    } catch {
      return null;
    }
  }

  return null;
}

function getAllowanceSecret() {
  return process.env.ASSISTANT_SAFETY_SALT || process.env.OPENAI_API_KEY || "";
}

function signAllowance(bucket, encodedState) {
  return createHmac("sha256", getAllowanceSecret())
    .update(`${bucket}:${encodedState}`)
    .digest("base64url");
}

function encodeAllowanceToken(bucket, state) {
  const encodedState = Buffer.from(JSON.stringify(state)).toString("base64url");
  return `${encodedState}.${signAllowance(bucket, encodedState)}`;
}

function parseAllowanceToken(token, bucket, now, limitSeconds) {
  if (typeof token !== "string") return null;

  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex === -1) return null;

  const encodedState = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  const expectedSignature = signAllowance(bucket, encodedState);
  const signatureBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expectedSignature);

  if (
    signatureBytes.length !== expectedBytes.length ||
    !timingSafeEqual(signatureBytes, expectedBytes)
  ) {
    return null;
  }

  let state;

  try {
    state = JSON.parse(Buffer.from(encodedState, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (
    state?.version !== 1 ||
    !Number.isSafeInteger(state.resetAt) ||
    state.resetAt <= now ||
    !Number.isSafeInteger(state.updatedAt) ||
    !Number.isInteger(state.usedSeconds) ||
    state.usedSeconds < 0 ||
    state.usedSeconds > limitSeconds
  ) {
    return null;
  }

  if (state.active !== null) {
    if (
      typeof state.active?.id !== "string" ||
      state.active.id.length > 100 ||
      !Number.isSafeInteger(state.active.createdAt) ||
      (state.active.startedAt !== null &&
        !Number.isSafeInteger(state.active.startedAt)) ||
      !Number.isInteger(state.active.reservedSeconds) ||
      state.active.reservedSeconds < 1 ||
      state.active.reservedSeconds > limitSeconds
    ) {
      return null;
    }
  }

  return state;
}

function cleanupExpiredEntries(store, now) {
  if (store.size <= 500) return;

  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) store.delete(key);
  }
}

export function getClientAddress(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

export function getSafetyIdentifier(request) {
  const salt =
    process.env.ASSISTANT_SAFETY_SALT || "josemukorivo-portfolio-assistant";

  return createHash("sha256")
    .update(`${salt}:${getClientAddress(request)}`)
    .digest("hex")
    .slice(0, 32);
}

export function getPostHogDistinctId(value, fallback) {
  if (
    typeof value !== "string" ||
    value.length > 200 ||
    !/^[A-Za-z0-9._:-]+$/.test(value)
  ) {
    return fallback;
  }

  return value;
}

export function isRateLimited(
  request,
  { bucket, requests, windowMs }
) {
  const now = Date.now();
  const key = `${bucket}:${getSafetyIdentifier(request)}`;
  const existing = rateLimitStore.get(key);

  if (rateLimitStore.size > 500) {
    for (const [storedKey, entry] of rateLimitStore) {
      if (entry.expiresAt <= now) {
        rateLimitStore.delete(storedKey);
      }
    }
  }

  if (!existing || existing.expiresAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      expiresAt: now + windowMs
    });
    return false;
  }

  existing.count += 1;
  return existing.count > requests;
}

function getAllowanceState(
  request,
  { bucket, cookieName, limitSeconds, windowMs },
  now
) {
  const key = `${bucket}:${getSafetyIdentifier(request)}`;
  const cookieState = parseAllowanceToken(
    getCookie(request, cookieName),
    bucket,
    now,
    limitSeconds
  );
  const storedState = dailyAllowanceStore.get(key)?.state;
  const validStoredState =
    storedState?.resetAt > now ? storedState : null;
  let state;

  if (cookieState && validStoredState) {
    if (cookieState.updatedAt !== validStoredState.updatedAt) {
      state =
        cookieState.updatedAt > validStoredState.updatedAt
          ? cookieState
          : validStoredState;
    } else {
      const cookieReserved = cookieState.active?.reservedSeconds || 0;
      const storedReserved = validStoredState.active?.reservedSeconds || 0;
      state =
        cookieState.usedSeconds + cookieReserved >=
        validStoredState.usedSeconds + storedReserved
          ? cookieState
          : validStoredState;
    }
  } else {
    state = cookieState || validStoredState;
  }

  if (!state) {
    state = {
      version: 1,
      resetAt: now + windowMs,
      updatedAt: now,
      usedSeconds: 0,
      active: null
    };
  }

  if (state.active) {
    const activeExpiresAt = state.active.startedAt
      ? state.active.startedAt + state.active.reservedSeconds * 1000
      : state.active.createdAt + PENDING_ALLOWANCE_TTL_MS;

    if (now >= activeExpiresAt) {
      state = {
        ...state,
        active: null,
        updatedAt: now,
        usedSeconds: state.active.startedAt
          ? Math.min(
              limitSeconds,
              state.usedSeconds + state.active.reservedSeconds
            )
          : state.usedSeconds
      };
    }
  }

  return { key, state };
}

function storeAllowanceState(key, state) {
  dailyAllowanceStore.set(key, {
    expiresAt: state.resetAt,
    state
  });
}

export function claimDailyAllowance(
  request,
  { bucket, cookieName, limitSeconds, windowMs }
) {
  const now = Date.now();
  cleanupExpiredEntries(dailyAllowanceStore, now);
  const { key, state } = getAllowanceState(
    request,
    { bucket, cookieName, limitSeconds, windowMs },
    now
  );

  if (state.active) {
    const activeEndsAt = state.active.startedAt
      ? state.active.startedAt + state.active.reservedSeconds * 1000
      : state.active.createdAt + PENDING_ALLOWANCE_TTL_MS;
    return {
      allowed: false,
      reason: "active_session",
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((activeEndsAt - now) / 1000)
      )
    };
  }

  const remainingSeconds = Math.max(0, limitSeconds - state.usedSeconds);
  if (remainingSeconds === 0) {
    return {
      allowed: false,
      reason: "daily_limit",
      resetAt: state.resetAt,
      retryAfterSeconds: Math.ceil((state.resetAt - now) / 1000)
    };
  }

  const previousState = dailyAllowanceStore.has(key) ? state : null;
  const sessionId = randomUUID();
  const claimedState = {
    ...state,
    active: {
      createdAt: now,
      id: sessionId,
      reservedSeconds: remainingSeconds,
      startedAt: null
    },
    updatedAt: now
  };
  storeAllowanceState(key, claimedState);

  return {
    allowed: true,
    bucket,
    cookieName,
    expiresAt: state.resetAt,
    key,
    maxSessionSeconds: remainingSeconds,
    previousState,
    remainingSeconds,
    sessionId,
    state: claimedState
  };
}

export function releaseDailyAllowance(claim) {
  if (!claim?.allowed || !claim.key) return;

  const existing = dailyAllowanceStore.get(claim.key);
  if (existing?.state?.active?.id !== claim.sessionId) return;

  if (claim.previousState) {
    storeAllowanceState(claim.key, claim.previousState);
  } else {
    dailyAllowanceStore.delete(claim.key);
  }
}

export function completeDailyAllowance(
  request,
  { bucket, cookieName, limitSeconds, sessionId, windowMs }
) {
  const now = Date.now();
  cleanupExpiredEntries(dailyAllowanceStore, now);
  const { key, state } = getAllowanceState(
    request,
    { bucket, cookieName, limitSeconds, windowMs },
    now
  );

  if (!state.active || state.active.id !== sessionId) {
    return {
      completed: false,
      bucket,
      cookieName,
      expiresAt: state.resetAt,
      key,
      remainingSeconds: Math.max(0, limitSeconds - state.usedSeconds),
      state
    };
  }

  const elapsedSeconds = state.active.startedAt
    ? Math.min(
        state.active.reservedSeconds,
        Math.max(1, Math.ceil((now - state.active.startedAt) / 1000))
      )
    : 0;
  const completedState = {
    ...state,
    active: null,
    updatedAt: now,
    usedSeconds: Math.min(
      limitSeconds,
      state.usedSeconds + elapsedSeconds
    )
  };
  storeAllowanceState(key, completedState);

  return {
    completed: true,
    bucket,
    cookieName,
    elapsedSeconds,
    expiresAt: completedState.resetAt,
    key,
    remainingSeconds: Math.max(
      0,
      limitSeconds - completedState.usedSeconds
    ),
    state: completedState
  };
}

export function startDailyAllowance(
  request,
  { bucket, cookieName, limitSeconds, sessionId, windowMs }
) {
  const now = Date.now();
  cleanupExpiredEntries(dailyAllowanceStore, now);
  const { key, state } = getAllowanceState(
    request,
    { bucket, cookieName, limitSeconds, windowMs },
    now
  );

  if (!state.active || state.active.id !== sessionId) {
    return {
      started: false,
      bucket,
      cookieName,
      expiresAt: state.resetAt,
      key,
      remainingSeconds: Math.max(0, limitSeconds - state.usedSeconds),
      state
    };
  }

  const startedState = state.active.startedAt
    ? state
    : {
        ...state,
        active: {
          ...state.active,
          startedAt: now
        },
        updatedAt: now
      };
  storeAllowanceState(key, startedState);

  return {
    started: true,
    bucket,
    cookieName,
    expiresAt: startedState.resetAt,
    key,
    maxSessionSeconds: startedState.active.reservedSeconds,
    remainingSeconds: Math.max(0, limitSeconds - startedState.usedSeconds),
    state: startedState
  };
}

export function serializeDailyAllowanceCookie(request, allowance) {
  const maxAge = Math.max(
    1,
    Math.ceil((allowance.expiresAt - Date.now()) / 1000)
  );
  const isSecure =
    request.headers.get("x-forwarded-proto") === "https" ||
    new URL(request.url).protocol === "https:";
  const attributes = [
    `${allowance.cookieName}=${encodeURIComponent(
      encodeAllowanceToken(allowance.bucket, allowance.state)
    )}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "HttpOnly",
    "SameSite=Lax"
  ];

  if (isSecure) attributes.push("Secure");
  return attributes.join("; ");
}

export function validateMessages(
  messages,
  {
    allowEmpty = false,
    maxMessages = 24,
    maxMessageCharacters = 1600,
    maxTotalCharacters = 12000
  } = {}
) {
  if (!Array.isArray(messages) || (!allowEmpty && messages.length === 0)) {
    return false;
  }

  if (messages.length > maxMessages) {
    return false;
  }

  let totalCharacters = 0;

  for (const message of messages) {
    if (!message || !["user", "assistant"].includes(message.role)) {
      return false;
    }

    if (!Array.isArray(message.parts)) {
      return false;
    }

    for (const part of message.parts) {
      if (part?.type !== "text") {
        continue;
      }

      if (
        typeof part.text !== "string" ||
        part.text.length > maxMessageCharacters
      ) {
        return false;
      }

      totalCharacters += part.text.length;
    }
  }

  return totalCharacters <= maxTotalCharacters;
}

export function formatRecentConversation(
  messages,
  { maxCharacters = 4000, maxMessages = 8 } = {}
) {
  const lines = messages
    .slice(-maxMessages)
    .map((message) => {
      const text = message.parts
        .filter((part) => part?.type === "text")
        .map((part) => part.text.trim())
        .filter(Boolean)
        .join("\n");

      if (!text) {
        return null;
      }

      return `${message.role === "user" ? "Visitor" : "Assistant"}: ${text}`;
    })
    .filter(Boolean)
    .join("\n");

  return lines.slice(-maxCharacters);
}

import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const rateLimitStore =
  globalThis.__josephPortfolioAssistantRateLimit ?? new Map();
const dailyAllowanceStore =
  globalThis.__josephPortfolioAssistantDailyAllowance ?? new Map();

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

function signAllowance(bucket, expiresAt) {
  return createHmac("sha256", getAllowanceSecret())
    .update(`${bucket}:${expiresAt}`)
    .digest("base64url");
}

function parseAllowanceToken(token, bucket, now) {
  if (typeof token !== "string") return null;

  const separatorIndex = token.indexOf(".");
  if (separatorIndex === -1) return null;

  const expiresAt = Number(token.slice(0, separatorIndex));
  const signature = token.slice(separatorIndex + 1);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now || !signature) {
    return null;
  }

  const expectedSignature = signAllowance(bucket, expiresAt);
  const signatureBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expectedSignature);

  if (
    signatureBytes.length !== expectedBytes.length ||
    !timingSafeEqual(signatureBytes, expectedBytes)
  ) {
    return null;
  }

  return expiresAt;
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

export function claimDailyAllowance(
  request,
  { bucket, cookieName, windowMs }
) {
  const now = Date.now();
  const cookieExpiresAt = parseAllowanceToken(
    getCookie(request, cookieName),
    bucket,
    now
  );

  if (cookieExpiresAt) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((cookieExpiresAt - now) / 1000)
    };
  }

  cleanupExpiredEntries(dailyAllowanceStore, now);

  const key = `${bucket}:${getSafetyIdentifier(request)}`;
  const existing = dailyAllowanceStore.get(key);
  if (existing?.expiresAt > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.expiresAt - now) / 1000)
    };
  }

  const expiresAt = now + windowMs;
  dailyAllowanceStore.set(key, { expiresAt });

  return {
    allowed: true,
    cookieName,
    expiresAt,
    key,
    token: `${expiresAt}.${signAllowance(bucket, expiresAt)}`
  };
}

export function releaseDailyAllowance(claim) {
  if (!claim?.allowed || !claim.key) return;

  const existing = dailyAllowanceStore.get(claim.key);
  if (existing?.expiresAt === claim.expiresAt) {
    dailyAllowanceStore.delete(claim.key);
  }
}

export function serializeDailyAllowanceCookie(request, claim) {
  const maxAge = Math.max(
    1,
    Math.ceil((claim.expiresAt - Date.now()) / 1000)
  );
  const isSecure =
    request.headers.get("x-forwarded-proto") === "https" ||
    new URL(request.url).protocol === "https:";
  const attributes = [
    `${claim.cookieName}=${encodeURIComponent(claim.token)}`,
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

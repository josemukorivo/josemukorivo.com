import "server-only";

import { createHash } from "node:crypto";

const rateLimitStore =
  globalThis.__josephPortfolioAssistantRateLimit ?? new Map();

if (!globalThis.__josephPortfolioAssistantRateLimit) {
  globalThis.__josephPortfolioAssistantRateLimit = rateLimitStore;
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

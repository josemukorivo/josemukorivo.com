import { createHash } from "node:crypto";
import { Resend } from "resend";
import { z } from "zod";
import { SITE_EMAIL } from "../../../lib/site";

export const maxDuration = 10;

const MAX_REQUEST_CHARACTERS = 8_000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_REQUESTS = 5;
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const contactMessageSchema = z.object({
  email: z.email().max(254),
  message: z.string().trim().min(10).max(2_000),
  name: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[^\r\n<>]+$/),
  requestId: z.uuid(),
  turnstileToken: z.string().min(1).max(2_048)
});

const rateLimitStore =
  globalThis.__josephPortfolioContactRateLimit ?? new Map();

if (!globalThis.__josephPortfolioContactRateLimit) {
  globalThis.__josephPortfolioContactRateLimit = rateLimitStore;
}

function getClientAddress(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

function getRateLimitKey(request) {
  return createHash("sha256")
    .update(`portfolio-contact:${getClientAddress(request)}`)
    .digest("hex");
}

function isRateLimited(request) {
  const now = Date.now();
  const key = getRateLimitKey(request);
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
      expiresAt: now + RATE_LIMIT_WINDOW_MS
    });
    return false;
  }

  existing.count += 1;
  return existing.count > RATE_LIMIT_REQUESTS;
}

async function verifyTurnstile(request, token) {
  const formData = new FormData();
  formData.set("secret", process.env.TURNSTILE_SECRET_KEY);
  formData.set("response", token);
  formData.set("remoteip", getClientAddress(request));

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    body: formData,
    method: "POST",
    signal: AbortSignal.timeout(5_000)
  });

  if (!response.ok) {
    return false;
  }

  const result = await response.json();

  return result.success === true && result.action === "portfolio_contact";
}

function getContactEmailText({ email, message, name }) {
  return [
    "A visitor sent a message from josemukorivo.com.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
    "",
    "Reply to this email to respond directly to the visitor."
  ].join("\n");
}

function getConfirmationEmailText() {
  return [
    "Your message to Joseph has been received.",
    "",
    "If a response is needed, Joseph can reply to the email address you provided.",
    "",
    "— Joseph's AI Assistant"
  ].join("\n");
}

export async function POST(request) {
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.TURNSTILE_SECRET_KEY ||
    !process.env.CONTACT_FROM_EMAIL
  ) {
    return Response.json(
      { error: "Contact messaging is not configured." },
      { status: 503 }
    );
  }

  if (isRateLimited(request)) {
    return Response.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }

  let rawBody;

  try {
    rawBody = await request.text();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (rawBody.length > MAX_REQUEST_CHARACTERS) {
    return Response.json({ error: "Message is too large." }, { status: 413 });
  }

  let body;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactMessageSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid contact details." }, { status: 400 });
  }

  let turnstileIsValid = false;

  try {
    turnstileIsValid = await verifyTurnstile(
      request,
      parsed.data.turnstileToken
    );
  } catch {
    return Response.json(
      { error: "Verification is temporarily unavailable." },
      { status: 503 }
    );
  }

  if (!turnstileIsValid) {
    return Response.json(
      { error: "Please complete the security check and try again." },
      { status: 403 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  let delivery;

  try {
    delivery = await resend.emails.send(
      {
        from: process.env.CONTACT_FROM_EMAIL,
        replyTo: parsed.data.email,
        subject: `Portfolio message from ${parsed.data.name}`,
        text: getContactEmailText(parsed.data),
        to: SITE_EMAIL
      },
      {
        idempotencyKey: `portfolio-contact/${parsed.data.requestId}/owner`
      }
    );
  } catch {
    return Response.json(
      { error: "The message could not be sent. Please try again." },
      { status: 502 }
    );
  }

  if (delivery.error) {
    console.error(
      "Portfolio contact email failed",
      delivery.error.name || "resend_error"
    );
    return Response.json(
      { error: "The message could not be sent. Please try again." },
      { status: 502 }
    );
  }

  let confirmationDelivered = false;

  try {
    const confirmation = await resend.emails.send(
      {
        from: process.env.CONTACT_FROM_EMAIL,
        replyTo: SITE_EMAIL,
        subject: "Your message to Joseph was received",
        text: getConfirmationEmailText(),
        to: parsed.data.email
      },
      {
        idempotencyKey: `portfolio-contact/${parsed.data.requestId}/visitor`
      }
    );

    confirmationDelivered = !confirmation.error;

    if (confirmation.error) {
      console.error(
        "Portfolio contact confirmation failed",
        confirmation.error.name || "resend_error"
      );
    }
  } catch {
    console.error(
      "Portfolio contact confirmation failed",
      "delivery_exception"
    );
  }

  return Response.json(
    { confirmationDelivered, delivered: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}

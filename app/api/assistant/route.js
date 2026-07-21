import { createHash } from "node:crypto";
import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool
} from "ai";
import { z } from "zod";
import {
  RESUME_HREF,
  buildAssistantInstructions,
  searchWriting
} from "../../../lib/assistant-profile";
import { getArticles } from "../../../lib/blog";
import { projects } from "../../../lib/projects";

export const maxDuration = 30;

const MAX_MESSAGES = 24;
const MAX_MESSAGE_CHARACTERS = 1600;
const MAX_TOTAL_CHARACTERS = 12000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_REQUESTS = 12;

const rateLimitStore =
  globalThis.__josephPortfolioAssistantRateLimit ?? new Map();

if (!globalThis.__josephPortfolioAssistantRateLimit) {
  globalThis.__josephPortfolioAssistantRateLimit = rateLimitStore;
}

function getClientAddress(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

function getSafetyIdentifier(request) {
  const salt =
    process.env.ASSISTANT_SAFETY_SALT || "josemukorivo-portfolio-assistant";

  return createHash("sha256")
    .update(`${salt}:${getClientAddress(request)}`)
    .digest("hex")
    .slice(0, 32);
}

function isRateLimited(request) {
  const now = Date.now();
  const key = getSafetyIdentifier(request);
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

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return false;
  }

  if (messages.length > MAX_MESSAGES) {
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
        part.text.length > MAX_MESSAGE_CHARACTERS
      ) {
        return false;
      }

      totalCharacters += part.text.length;
    }
  }

  return totalCharacters <= MAX_TOTAL_CHARACTERS;
}

function createAssistantTools(articles) {
  return {
    showResume: tool({
      description:
        "Show Joseph's public resume when a visitor asks to see, open, or download it.",
      inputSchema: z.object({}),
      execute: async () => ({
        kind: "resume",
        title: "Joseph Mukorivo — Head of Engineering",
        href: RESUME_HREF,
        description:
          "A two-page resume covering engineering leadership, AI products, full-stack systems, fintech, cloud infrastructure, and selected impact."
      })
    }),
    showProject: tool({
      description:
        "Show a project card when a visitor asks about FortyOne, Config, or Complexus.",
      inputSchema: z.object({
        project: z.enum(["fortyone", "config", "complexus"])
      }),
      execute: async ({ project }) => {
        const selectedProject = projects.find((item) => item.id === project);

        return selectedProject
          ? {
              kind: "project",
              name: selectedProject.name,
              href: selectedProject.href,
              description: selectedProject.description
            }
          : null;
      }
    }),
    searchWriting: tool({
      description:
        "Search Joseph's published writing for relevant articles and supporting context.",
      inputSchema: z.object({
        query: z.string().min(2).max(160)
      }),
      execute: async ({ query }) => ({
        kind: "articles",
        results: searchWriting(articles, query)
      })
    })
  };
}

export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "The assistant is not configured yet." },
      { status: 503 }
    );
  }

  if (isRateLimited(request)) {
    return Response.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!validateMessages(body.messages)) {
    return Response.json({ error: "Invalid conversation." }, { status: 400 });
  }

  const articles = await getArticles();
  const tools = createAssistantTools(articles);
  const messages = await convertToModelMessages(body.messages, { tools });
  const result = streamText({
    model: openai(process.env.OPENAI_MODEL || "gpt-5.6-terra"),
    system: buildAssistantInstructions({ articles, projects }),
    messages,
    tools,
    stopWhen: stepCountIs(3),
    maxOutputTokens: 700,
    providerOptions: {
      openai: {
        reasoningEffort: "low",
        safetyIdentifier: getSafetyIdentifier(request),
        store: false,
        textVerbosity: "low"
      }
    }
  });

  return result.toUIMessageStreamResponse({
    originalMessages: body.messages,
    sendReasoning: false,
    onError(error) {
      console.error("Portfolio assistant response failed", error);
      return "The assistant could not complete that response.";
    }
  });
}

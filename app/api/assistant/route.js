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
import { createPostHogTracedModel } from "../../../lib/posthog-server";
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

function getPostHogDistinctId(value, fallback) {
  if (
    typeof value !== "string" ||
    value.length > 200 ||
    !/^[A-Za-z0-9._:-]+$/.test(value)
  ) {
    return fallback;
  }

  return value;
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
    showJosephPhotos: tool({
      description:
        "Show approved photos of Joseph. Use both for a general request; use professional or workspace only when the visitor explicitly requests that image or asks for a single image.",
      inputSchema: z.object({
        view: z
          .enum(["professional", "workspace", "both"])
          .describe(
            "Choose both unless the visitor explicitly requests one image or a specific view."
          )
      }),
      execute: async ({ view }) => {
        const photos = {
          professional: {
            src: "/assets/joseph-professional.webp",
            alt: "Professional portrait of Joseph Mukorivo",
            label: "Joseph Mukorivo"
          },
          workspace: {
            src: "/assets/joseph-workspace.webp",
            alt: "Joseph Mukorivo at his home workspace",
            label: "At his workspace"
          }
        };

        return {
          kind: "photos",
          images:
            view === "both"
              ? [photos.professional, photos.workspace]
              : [photos[view]]
        };
      }
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
    }),
    readArticle: tool({
      description:
        "Load the complete content of one of Joseph's published articles before summarizing, explaining, or discussing its ideas.",
      inputSchema: z.object({
        slug: z.string().min(2).max(180)
      }),
      execute: async ({ slug }) => {
        const article = articles.find((item) => item.slug === slug);

        if (!article) {
          return {
            kind: "article-not-found",
            error: "That article could not be found."
          };
        }

        return {
          kind: "article",
          title: article.title,
          href: `/blog/${article.slug}`,
          description: article.description,
          publishedAt: article.publishedAt,
          readingTimeMinutes: article.readingTimeMinutes,
          content: article.content
        };
      }
    }),
    openArticle: tool({
      description:
        "Navigate the visitor to one of Joseph's published articles when they ask to open, view, visit, or read it on the website.",
      inputSchema: z.object({
        slug: z.string().min(2).max(180)
      }),
      execute: async ({ slug }) => {
        const article = articles.find((item) => item.slug === slug);

        if (!article) {
          return {
            kind: "navigation-error",
            error: "That article could not be found."
          };
        }

        return {
          kind: "navigation",
          route: `/blog/${article.slug}`,
          title: article.title,
          message: `Opening “${article.title}”`
        };
      }
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
  const currentArticle =
    typeof body.currentPath === "string" && body.currentPath.length <= 240
      ? articles.find(
          (article) => body.currentPath === `/blog/${article.slug}`
        )
      : null;
  const tools = createAssistantTools(articles);
  const messages = await convertToModelMessages(body.messages, { tools });
  const safetyIdentifier = getSafetyIdentifier(request);
  const currentPath =
    typeof body.currentPath === "string" && body.currentPath.length <= 240
      ? body.currentPath
      : "/";
  const model = createPostHogTracedModel(
    openai(process.env.OPENAI_MODEL || "gpt-5.6-terra"),
    {
      distinctId: getPostHogDistinctId(
        body.posthogDistinctId,
        safetyIdentifier
      ),
      properties: {
        current_path: currentPath,
        environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
        message_count: body.messages.length
      }
    }
  );
  const result = streamText({
    model,
    system: buildAssistantInstructions({ articles, currentArticle, projects }),
    messages,
    tools,
    stopWhen: stepCountIs(4),
    maxOutputTokens: 950,
    providerOptions: {
      openai: {
        reasoningEffort: "low",
        safetyIdentifier,
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

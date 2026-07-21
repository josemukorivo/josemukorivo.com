import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { buildAssistantInstructions } from "../../../lib/assistant-profile";
import {
  getPostHogDistinctId,
  getSafetyIdentifier,
  isRateLimited,
  validateMessages
} from "../../../lib/assistant-request";
import { createAssistantTools } from "../../../lib/assistant-tools";
import { getArticles } from "../../../lib/blog";
import { createPostHogTracedModel } from "../../../lib/posthog-server";
import { projects } from "../../../lib/projects";

export const maxDuration = 30;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_REQUESTS = 12;

export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "The assistant is not configured yet." },
      { status: 503 }
    );
  }

  if (
    isRateLimited(request, {
      bucket: "text",
      requests: RATE_LIMIT_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS
    })
  ) {
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
  const tools = createAssistantTools({ articles, projects });
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

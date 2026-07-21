import {
  isRateLimited
} from "../../../../../lib/assistant-request";
import { executeAssistantTool } from "../../../../../lib/assistant-tools";
import { getArticles } from "../../../../../lib/blog";
import { projects } from "../../../../../lib/projects";

export const maxDuration = 10;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_REQUESTS = 32;
const MAX_REQUEST_CHARACTERS = 5000;

export async function POST(request) {
  if (
    isRateLimited(request, {
      bucket: "realtime-tool",
      requests: RATE_LIMIT_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS
    })
  ) {
    return Response.json(
      { error: "Too many assistant actions. Please try again shortly." },
      { status: 429 }
    );
  }

  let rawBody;

  try {
    rawBody = await request.text();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!rawBody || rawBody.length > MAX_REQUEST_CHARACTERS) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  let body;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body.name !== "string" || body.name.length > 80) {
    return Response.json({ error: "Invalid assistant action." }, { status: 400 });
  }

  try {
    const articles = await getArticles();
    const output = await executeAssistantTool(body.name, body.arguments, {
      articles,
      projects
    });

    return Response.json({ output });
  } catch (error) {
    console.error("Portfolio realtime tool failed", {
      name: body.name,
      error
    });
    return Response.json(
      { error: "The assistant action could not be completed." },
      { status: 400 }
    );
  }
}

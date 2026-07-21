import {
  getSafetyIdentifier,
  isRateLimited
} from "../../../../lib/assistant-request";

export const maxDuration = 30;

const OPENAI_TRANSCRIPTIONS_URL =
  "https://api.openai.com/v1/audio/transcriptions";
const TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";
const MAX_AUDIO_BYTES = 5 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_REQUESTS = 12;

function isAudioFile(value) {
  return (
    value &&
    typeof value.arrayBuffer === "function" &&
    typeof value.size === "number" &&
    value.size > 0 &&
    value.size <= MAX_AUDIO_BYTES
  );
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
      bucket: "assistant-transcription",
      requests: RATE_LIMIT_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS
    })
  ) {
    return Response.json(
      { error: "Too many recordings. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let formData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid recording." }, { status: 400 });
  }

  const audio = formData.get("audio");
  if (!isAudioFile(audio)) {
    return Response.json(
      { error: "The recording is empty or too large." },
      { status: 400 }
    );
  }

  const openAIFormData = new FormData();
  openAIFormData.append("file", audio, audio.name || "recording.webm");
  openAIFormData.append("model", TRANSCRIPTION_MODEL);
  openAIFormData.append("language", "en");
  openAIFormData.append("response_format", "json");
  openAIFormData.append(
    "prompt",
    "Joseph Mukorivo, Complexus, FortyOne, Art Circles, AMAKA Studio, Vocinity, Harare, Zimbabwe, Next.js, Expo, Go, Kubernetes, PostHog"
  );

  let openAIResponse;

  try {
    openAIResponse = await fetch(OPENAI_TRANSCRIPTIONS_URL, {
      method: "POST",
      body: openAIFormData,
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Safety-Identifier": getSafetyIdentifier(request)
      },
      signal: AbortSignal.timeout(25_000)
    });
  } catch (error) {
    console.error("Portfolio transcription request failed", error);
    return Response.json(
      { error: "The recording could not be transcribed." },
      { status: 502 }
    );
  }

  const responseBody = await readResponseBody(openAIResponse);
  if (!openAIResponse.ok) {
    console.error("OpenAI transcription request failed", {
      status: openAIResponse.status,
      error: responseBody?.error?.message
    });
    return Response.json(
      { error: "The recording could not be transcribed." },
      { status: 502 }
    );
  }

  const text =
    typeof responseBody.text === "string" ? responseBody.text.trim() : "";

  if (!text) {
    return Response.json(
      { error: "I could not hear any speech. Please try again." },
      { status: 422 }
    );
  }

  return Response.json({ text });
}

"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState
} from "react";
import { Streamdown } from "streamdown";
import {
  ANALYTICS_EVENTS,
  captureAnalyticsEvent,
  getPostHogDistinctId
} from "../../lib/analytics";
import { ContactMessageCard } from "./contact-message-card";
import { usePortfolioRealtimeVoice } from "./use-portfolio-realtime-voice";
import { usePortfolioTranscription } from "./use-portfolio-transcription";

const assistantTransport = new DefaultChatTransport({
  api: "/api/assistant"
});

const SUGGESTED_QUESTIONS = [
  { id: "ai_work", label: "What has Joseph built with AI?" },
  { id: "fortyone_origin", label: "Why did he build FortyOne?" },
  {
    id: "complexus_capabilities",
    label: "What can Complexus build for my team?"
  },
  { id: "resume", label: "Walk me through his résumé" },
  { id: "biography", label: "Tell me more about Joseph" },
  {
    id: "engineering_leadership_article",
    label: "Open his engineering leadership article"
  },
  {
    id: "contact",
    label: "Send Joseph a message"
  },
  {
    id: "availability",
    label: "What kind of work is Joseph open to?"
  },
  {
    id: "leadership_approach",
    label: "How does Joseph approach engineering leadership?"
  },
  {
    id: "personal_interests",
    label: "What does Joseph enjoy outside work?"
  }
];

const SUGGESTION_COUNT = 6;
const DAILY_LIMIT_TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit"
});

function getRandomSuggestions() {
  const suggestions = [...SUGGESTED_QUESTIONS];

  for (let index = suggestions.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [suggestions[index], suggestions[randomIndex]] = [
      suggestions[randomIndex],
      suggestions[index]
    ];
  }

  return suggestions.slice(0, SUGGESTION_COUNT);
}

function getCompletedToolNames(message) {
  const toolNames = new Set();

  for (const part of message.parts) {
    if (
      part.type.startsWith("tool-") &&
      part.state === "output-available"
    ) {
      toolNames.add(part.type.slice(5));
    }
  }

  return [...toolNames];
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="m5.5 5.5 9 9m0-9-9 9" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M18 9.473 16.586 10.881 13 7.312V20.5h-2V7.311l-3.586 3.57L6 9.473 12 3.5 18 9.473Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function StopIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        clipRule="evenodd"
        d="M3.25 7C3.25 4.92893 4.92893 3.25 7 3.25H17C19.0711 3.25 20.75 4.92893 20.75 7V17C20.75 19.0711 19.0711 20.75 17 20.75H7C4.92893 20.75 3.25 19.0711 3.25 17V7Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function VoiceIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M3.5 10.5V13.5" strokeLinecap="round" />
      <path d="M7.75 8V16" strokeLinecap="round" />
      <path d="M12 5V19" strokeLinecap="round" />
      <path d="M16.25 8V16" strokeLinecap="round" />
      <path d="M20.5 10.5V13.5" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M16.0549 8.25C17.4225 8.24998 18.5248 8.24996 19.3918 8.36652C20.2919 8.48754 21.0497 8.74643 21.6517 9.34835C22.2536 9.95027 22.5125 10.7081 22.6335 11.6083C22.75 12.4752 22.75 13.5775 22.75 14.9451V16.0549C22.75 17.4225 22.75 18.5248 22.6335 19.3918C22.5125 20.2919 22.2536 21.0497 21.6517 21.6517C21.0497 22.2536 20.2919 22.5125 19.3918 22.6335C18.5248 22.75 17.4225 22.75 16.0549 22.75H14.9451C13.5775 22.75 12.4752 22.75 11.6082 22.6335C10.7081 22.5125 9.95027 22.2536 9.34835 21.6516C8.74643 21.0497 8.48754 20.2919 8.36652 19.3918C8.24996 18.5248 8.24998 17.4225 8.25 16.0549V14.9451C8.24998 13.5775 8.24996 12.4752 8.36652 11.6082C8.48754 10.7081 8.74643 9.95027 9.34835 9.34835C9.95027 8.74643 10.7081 8.48754 11.6083 8.36652C12.4752 8.24996 13.5775 8.24998 14.9451 8.25H16.0549Z"
        fill="currentColor"
      />
      <path
        d="M6.75 14.8569C6.74991 13.5627 6.74983 12.3758 6.8799 11.4084C7.0232 10.3425 7.36034 9.21504 8.28769 8.28769C9.21504 7.36034 10.3425 7.0232 11.4084 6.8799C12.3758 6.74983 13.5627 6.74991 14.8569 6.75L17.0931 6.75C17.3891 6.75 17.5371 6.75 17.6261 6.65419C17.7151 6.55838 17.7045 6.4142 17.6833 6.12584C17.6648 5.87546 17.6412 5.63892 17.6111 5.41544C17.4818 4.45589 17.2232 3.6585 16.6718 2.98663C16.4744 2.74612 16.2539 2.52558 16.0134 2.3282C15.3044 1.74638 14.4557 1.49055 13.4248 1.36868C12.4205 1.24998 11.1512 1.24999 9.54893 1.25H9.45109C7.84883 1.24999 6.57947 1.24998 5.57525 1.36868C4.54428 1.49054 3.69558 1.74638 2.98663 2.3282C2.74612 2.52558 2.52558 2.74612 2.3282 2.98663C1.74638 3.69558 1.49055 4.54428 1.36868 5.57525C1.24998 6.57947 1.24999 7.84882 1.25 9.45108V9.54891C1.24999 11.1512 1.24998 12.4205 1.36868 13.4247C1.49054 14.4557 1.74638 15.3044 2.3282 16.0134C2.52558 16.2539 2.74612 16.4744 2.98663 16.6718C3.6585 17.2232 4.45589 17.4818 5.41544 17.6111C5.63892 17.6412 5.87546 17.6648 6.12584 17.6833C6.4142 17.7045 6.55838 17.7151 6.65419 17.6261C6.75 17.5371 6.75 17.3891 6.75 17.0931V14.8569Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
      <path
        d="m4.5 10.5 3.25 3.25 7.75-8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        clipRule="evenodd"
        d="M14.8153 1.06756C15.3159 0.870393 15.881 1.11784 16.0774 1.62026L17.0511 4.11043C17.2001 4.49154 17.0967 4.92548 16.7919 5.19759C16.4871 5.4697 16.0457 5.5223 15.6859 5.32936C14.6628 4.78073 13.4941 4.46929 12.25 4.46929C8.21687 4.46929 4.94737 7.75075 4.94737 11.7986C4.94737 13.3593 5.43143 14.9118 6.2355 16.0808C6.54101 16.5249 6.42992 17.1336 5.98738 17.4402C5.54483 17.7468 4.93842 17.6353 4.63292 17.1912C3.59478 15.6818 3 13.7388 3 11.7986C3 6.67132 7.14137 2.5148 12.25 2.5148C13.0031 2.5148 13.7357 2.6053 14.4374 2.77614L14.2647 2.33427C14.0682 1.83185 14.3148 1.26473 14.8153 1.06756ZM18.5126 6.05936C18.9552 5.75274 19.5616 5.86423 19.8671 6.30839C20.9052 7.8177 21.5 9.76075 21.5 11.7009C21.5 16.8282 17.3586 20.9847 12.25 20.9847C11.4969 20.9847 10.7643 20.8942 10.0626 20.7234L10.2353 21.1652C10.4318 21.6677 10.1852 22.2348 9.68465 22.4319C9.18407 22.6291 8.61901 22.3817 8.42256 21.8793L7.44888 19.3891C7.29986 19.008 7.40333 18.574 7.7081 18.3019C8.01288 18.0298 8.45435 17.9772 8.81412 18.1702C9.83717 18.7188 11.0059 19.0302 12.25 19.0302C16.2831 19.0302 19.5526 15.7488 19.5526 11.7009C19.5526 10.1402 19.0686 8.58778 18.2645 7.41877C17.959 6.97461 18.0701 6.36598 18.5126 6.05936Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function MicrophoneIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M6.25 7C6.25 3.82436 8.82436 1.25 12 1.25C15.1756 1.25 17.75 3.82436 17.75 7V11C17.75 14.1756 15.1756 16.75 12 16.75C8.82436 16.75 6.25 14.1756 6.25 11V7Z"
        fill="currentColor"
      />
      <path
        clipRule="evenodd"
        d="M4.22222 10.25C4.75917 10.25 5.19444 10.6805 5.19444 11.2115C5.19444 14.9288 8.2414 17.9423 12 17.9423C15.7586 17.9423 18.8056 14.9288 18.8056 11.2115C18.8056 10.6805 19.2408 10.25 19.7778 10.25C20.3147 10.25 20.75 10.6805 20.75 11.2115C20.75 15.6659 17.3472 19.3343 12.9722 19.8126V20.8269H14.9167C15.4536 20.8269 15.8889 21.2574 15.8889 21.7885C15.8889 22.3195 15.4536 22.75 14.9167 22.75H9.08333C8.54639 22.75 8.11111 22.3195 8.11111 21.7885C8.11111 21.2574 8.54639 20.8269 9.08333 20.8269H11.0278V19.8126C6.65283 19.3343 3.25 15.6659 3.25 11.2115C3.25 10.6805 3.68528 10.25 4.22222 10.25Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function AssistantMarkdownLink({ children, href }) {
  const isExternal = href?.startsWith("https://");

  return (
    <a
      href={href}
      rel={isExternal ? "noopener noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      {children}
    </a>
  );
}

const STREAMDOWN_COMPONENTS = { a: AssistantMarkdownLink };

function ExternalArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M5 11 11 5m-4.5 0H11v4.5" />
    </svg>
  );
}

function ResourceResult({ description, eyebrow, href, title }) {
  return (
    <a
      className="assistant-resource-card assistant-generative-ui"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="assistant-resource-heading">
        <span className="assistant-resource-kicker">{eyebrow}</span>
        <ExternalArrow />
      </span>
      <strong className="assistant-resource-title">{title}</strong>
      <span className="assistant-resource-description">{description}</span>
    </a>
  );
}

function ResumeCard({ output }) {
  return (
    <ResourceResult
      description={output.description}
      eyebrow="Résumé · PDF"
      href={output.href}
      title={output.title}
    />
  );
}

function ProjectCard({ output }) {
  return (
    <ResourceResult
      description={output.description}
      eyebrow="Selected project"
      href={output.href}
      title={output.name}
    />
  );
}

function ArticleCards({ label = "Related writing", output }) {
  return (
    <div className="assistant-article-results assistant-generative-ui">
      <span className="assistant-results-label">{label}</span>
      <div className="assistant-article-list">
        {output.results.map((article) => (
          <a
            className="assistant-article-card"
            href={article.href}
            key={article.href}
          >
            <span>{article.title}</span>
            <ExternalArrow />
          </a>
        ))}
      </div>
    </div>
  );
}

function JosephPhotos({ output }) {
  return (
    <div
      className="assistant-photo-grid assistant-generative-ui"
      data-count={output.images.length}
    >
      {output.images.map((photo) => (
        <figure className="assistant-photo" key={photo.src}>
          <span className="assistant-photo-frame">
            <Image
              alt={photo.alt}
              fill
              sizes="(max-width: 680px) calc(100vw - 76px), 184px"
              src={photo.src}
            />
          </span>
          <figcaption>{photo.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function ToolPart({ part }) {
  if (part.state !== "output-available") {
    return (
      <span className="assistant-tool-status">
        <span aria-hidden="true" className="assistant-thinking-dots">
          <i />
          <i />
          <i />
        </span>
        Checking Joseph’s public information
      </span>
    );
  }

  if (!part.output) {
    return null;
  }

  if (part.type === "tool-prepareContactMessage") {
    return <ContactMessageCard output={part.output} />;
  }

  if (part.type === "tool-showResume") {
    return <ResumeCard output={part.output} />;
  }

  if (part.type === "tool-showJosephPhotos") {
    return <JosephPhotos output={part.output} />;
  }

  if (part.type === "tool-showProject") {
    return <ProjectCard output={part.output} />;
  }

  if (part.type === "tool-searchWriting") {
    return <ArticleCards output={part.output} />;
  }

  if (part.type === "tool-readArticle") {
    if (part.output.kind !== "article") {
      return null;
    }

    return (
      <ArticleCards label="Article source" output={{ results: [part.output] }} />
    );
  }

  if (part.type === "tool-openArticle") {
    return part.output.message ? (
      <span className="assistant-tool-status">{part.output.message}</span>
    ) : null;
  }

  return null;
}

function getMessageText(message) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

function MessageActions({ content, onRetry }) {
  const [hasCopied, setHasCopied] = useState(false);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(content);
      setHasCopied(true);
      window.setTimeout(() => setHasCopied(false), 1500);
      captureAnalyticsEvent(ANALYTICS_EVENTS.assistantMessageCopied);
    } catch {
      setHasCopied(false);
    }
  }

  return (
    <span className="assistant-message-actions">
      <button
        aria-label={hasCopied ? "Copied" : "Copy response"}
        onClick={copyMessage}
        title={hasCopied ? "Copied" : "Copy"}
        type="button"
      >
        {hasCopied ? <CheckIcon /> : <CopyIcon />}
      </button>
      {onRetry ? (
        <button
          aria-label="Retry response"
          onClick={onRetry}
          title="Retry"
          type="button"
        >
          <RetryIcon />
        </button>
      ) : null}
    </span>
  );
}

function Message({ isAnimating, message, onRetry }) {
  const isUser = message.role === "user";
  const content = getMessageText(message);

  return (
    <div className="assistant-message" data-role={message.role}>
      <span className="assistant-message-label">
        {isUser ? "You" : "Joseph’s assistant"}
      </span>
      <div className="assistant-message-body">
        {message.parts.map((part, index) => {
          if (part.type === "text") {
            return isUser ? (
              <p key={`${message.id}-${index}`}>{part.text}</p>
            ) : (
              <Streamdown
                className="assistant-markdown"
                components={STREAMDOWN_COMPONENTS}
                controls={false}
                isAnimating={isAnimating}
                key={`${message.id}-${index}`}
              >
                {part.text}
              </Streamdown>
            );
          }

          if (part.type.startsWith("tool-")) {
            return <ToolPart key={`${message.id}-${index}`} part={part} />;
          }

          return null;
        })}
      </div>
      {!isUser && !isAnimating && content ? (
        <MessageActions content={content} onRetry={onRetry} />
      ) : null}
    </div>
  );
}

function formatRemainingTime(seconds) {
  if (!Number.isFinite(seconds)) return "";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function formatDailyLimitTitle(resetAt) {
  if (!Number.isFinite(resetAt)) {
    return "The three-minute Live voice allowance has been used for this 24-hour period";
  }

  const resetTime = DAILY_LIMIT_TIME_FORMATTER.format(new Date(resetAt));

  return `Live voice will be available again at ${resetTime}`;
}

function resizeComposer(event) {
  const textarea = event.currentTarget;
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, 104)}px`;
}

export function PortfolioAssistant({
  open,
  onClose,
  presentation = "dialog"
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isPage = presentation === "page";
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const [input, setInput] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState(
    () => SUGGESTED_QUESTIONS.slice(0, SUGGESTION_COUNT)
  );
  const {
    clearError,
    error,
    messages,
    regenerate,
    sendMessage,
    setMessages,
    status,
    stop
  } = useChat({
    onFinish: ({ message }) => {
      const toolNames = getCompletedToolNames(message);

      captureAnalyticsEvent(ANALYTICS_EVENTS.assistantResponseCompleted, {
        current_path: pathname,
        tool_names: toolNames,
        used_tools: toolNames.length > 0
      });

      for (const part of message.parts) {
        const destinationPath = part.output?.route;

        if (
          part.type === "tool-openArticle" &&
          part.state === "output-available" &&
          part.output?.kind === "navigation" &&
          destinationPath
        ) {
          captureAnalyticsEvent(
            ANALYTICS_EVENTS.assistantNavigationRequested,
            {
              current_path: pathname,
              destination_path: destinationPath,
              destination_type: "article"
            }
          );
          router.push(destinationPath);
        }
      }
    },
    onError: () => {
      captureAnalyticsEvent(ANALYTICS_EVENTS.assistantResponseFailed, {
        current_path: pathname
      });
    },
    transport: assistantTransport,
    throttle: 50
  });
  const isWorking = status === "submitted" || status === "streaming";
  const handleVoiceToolOutput = useCallback(
    ({ name, output }) => {
      if (output?.kind === "navigation" && output.route) {
        captureAnalyticsEvent(
          ANALYTICS_EVENTS.assistantNavigationRequested,
          {
            current_path: pathname,
            destination_path: output.route,
            destination_type: "article",
            source: "voice"
          }
        );
        router.push(output.route);
      }

      captureAnalyticsEvent(ANALYTICS_EVENTS.assistantResponseCompleted, {
        current_path: pathname,
        source: "voice",
        tool_names: [name],
        used_tools: true
      });
    },
    [pathname, router]
  );
  const handleTranscript = useCallback(
    (text) => {
      setInput((currentInput) =>
        [currentInput.trim(), text]
          .filter(Boolean)
          .join(" ")
          .slice(0, 700)
      );
      captureAnalyticsEvent(
        ANALYTICS_EVENTS.assistantTranscriptionCompleted,
        { current_path: pathname }
      );
      window.requestAnimationFrame(() => inputRef.current?.focus());
    },
    [pathname]
  );
  const voice = usePortfolioRealtimeVoice({
    currentPath: pathname,
    conversationMessages: messages,
    onToolOutput: handleVoiceToolOutput
  });
  const transcription = usePortfolioTranscription({
    onTranscript: handleTranscript
  });
  const isVoiceActive = voice.status !== "idle";
  const isTranscriptionActive = transcription.status !== "idle";
  const disconnectVoice = voice.disconnect;
  const cancelTranscription = transcription.cancel;
  const voiceMessages = voice.messages;
  const allMessages = [...messages, ...voiceMessages];
  const lastTextAssistantMessage = messages.findLast(
    (message) => message.role === "assistant" && getMessageText(message)
  );
  const lastVoiceAssistantMessage = voice.messages.findLast(
    (message) => message.role === "assistant" && getMessageText(message)
  );
  const closeAssistant = useEffectEvent(onClose);

  useEffect(() => {
    const dialog = dialogRef.current;
    let focusFrame;

    if (isPage) {
      focusFrame = window.requestAnimationFrame(() =>
        inputRef.current?.focus()
      );
    } else {
      if (!dialog) {
        return;
      }

      if (open && !dialog.open) {
        dialog.show();
        focusFrame = window.requestAnimationFrame(() =>
          inputRef.current?.focus()
        );
      } else if (!open && dialog.open) {
        dialog.close();
      }
    }

    if (!isPage && !open) {
      return;
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeAssistant();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      if (focusFrame) {
        window.cancelAnimationFrame(focusFrame);
      }

      window.removeEventListener("keydown", handleEscape);
    };
  }, [isPage, open]);

  useEffect(() => {
    if (!isPage && !open && isVoiceActive) {
      disconnectVoice();
    }
  }, [disconnectVoice, isPage, isVoiceActive, open]);

  useEffect(() => {
    if (!isPage && !open && isTranscriptionActive) {
      cancelTranscription();
    }
  }, [cancelTranscription, isPage, isTranscriptionActive, open]);

  useEffect(() => {
    if ((!isPage && !open) || !messagesRef.current) {
      return;
    }

    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: status === "streaming" ? "auto" : "smooth"
    });
  }, [isPage, messages, open, status, voiceMessages]);

  function submitMessage(
    value,
    { source = "composer", suggestionId } = {}
  ) {
    const text = value.trim();

    if (!text || isWorking || isVoiceActive || isTranscriptionActive) {
      return;
    }

    clearError();
    captureAnalyticsEvent(ANALYTICS_EVENTS.assistantQuestionSubmitted, {
      current_path: pathname,
      source,
      suggestion_id: suggestionId,
      turn_number:
        messages.filter((message) => message.role === "user").length + 1
    });
    sendMessage(
      { text },
      {
        body: {
          currentPath: pathname,
          posthogDistinctId: getPostHogDistinctId()
        }
      }
    );
    setInput("");

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitMessage(input);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage(input);
    }
  }

  function startNewChat() {
    if (isWorking) {
      stopResponse();
    }
    if (isVoiceActive) {
      voice.disconnect();
    }
    if (isTranscriptionActive) {
      cancelTranscription();
    }

    captureAnalyticsEvent(ANALYTICS_EVENTS.assistantNewChatStarted, {
      current_path: pathname,
      previous_message_count: allMessages.length
    });
    clearError();
    setMessages([]);
    voice.clearMessages();
    setInput("");
    setSuggestedQuestions(getRandomSuggestions());

    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function stopResponse() {
    captureAnalyticsEvent(ANALYTICS_EVENTS.assistantResponseStopped, {
      current_path: pathname
    });
    stop();
  }

  function retryTextResponse(messageId) {
    if (isWorking || isVoiceActive) return;

    clearError();
    captureAnalyticsEvent(ANALYTICS_EVENTS.assistantMessageRetried, {
      current_path: pathname,
      source: "text"
    });
    void regenerate({
      messageId,
      body: {
        currentPath: pathname,
        posthogDistinctId: getPostHogDistinctId()
      }
    });
  }

  function retryVoiceResponse(messageId) {
    captureAnalyticsEvent(ANALYTICS_EVENTS.assistantMessageRetried, {
      current_path: pathname,
      source: "voice"
    });
    voice.retryResponse(messageId);
  }

  async function toggleVoice() {
    if (voice.dailyLimitReached && !isVoiceActive) return;

    if (isVoiceActive) {
      voice.disconnect();
      captureAnalyticsEvent(ANALYTICS_EVENTS.assistantVoiceEnded, {
        current_path: pathname
      });
      return;
    }

    captureAnalyticsEvent(ANALYTICS_EVENTS.assistantVoiceStarted, {
      current_path: pathname,
      max_session_seconds: 180
    });
    await voice.connect();
  }

  async function toggleTranscription() {
    if (transcription.status === "recording") {
      transcription.stop();
      return;
    }

    if (transcription.status !== "idle") return;

    captureAnalyticsEvent(ANALYTICS_EVENTS.assistantTranscriptionStarted, {
      current_path: pathname
    });
    await transcription.start();
  }

  function getTranscriptionButtonLabel() {
    if (transcription.status === "recording") return "Finish";
    if (transcription.status === "transcribing") return "Transcribing";
    return "Record";
  }

  function getVoiceButtonLabel() {
    if (voice.status === "idle" && voice.dailyLimitReached) {
      return "Used today";
    }
    if (voice.status === "connecting") return "Connecting";
    if (voice.status === "disconnecting") return "Ending";
    if (voice.status === "connected") {
      return voice.isSpeaking
        ? `Speaking · ${formatRemainingTime(voice.remainingSeconds)}`
        : `Listening · ${formatRemainingTime(voice.remainingSeconds)}`;
    }
    if (
      Number.isFinite(voice.dailyRemainingSeconds) &&
      voice.dailyRemainingSeconds < 3 * 60
    ) {
      return `Live voice · ${formatRemainingTime(
        voice.dailyRemainingSeconds
      )} left`;
    }
    return "Live voice";
  }

  const assistantContent = (
    <div className="portfolio-assistant-shell">
        <header className="portfolio-assistant-header">
          <span className="portfolio-assistant-avatar">
            <Image
              alt=""
              height={34}
              sizes="34px"
              src="/assets/joseph.webp"
              width={34}
            />
          </span>
          <span className="portfolio-assistant-heading">
            <span
              className="portfolio-assistant-title"
              id="portfolio-assistant-title"
            >
              Ask about Joseph
            </span>
            <span>Grounded in his public work</span>
          </span>
          <span className="portfolio-assistant-header-actions">
            {allMessages.length > 0 ? (
              <button
                className="portfolio-assistant-new-chat"
                onClick={startNewChat}
                type="button"
              >
                New chat
              </button>
            ) : null}
            {isPage ? (
              <Link
                aria-label="Close assistant"
                className="portfolio-assistant-close"
                href="/"
              >
                <CloseIcon />
              </Link>
            ) : (
              <button
                aria-label="Close assistant"
                className="portfolio-assistant-close"
                onClick={onClose}
                type="button"
              >
                <CloseIcon />
              </button>
            )}
          </span>
        </header>

        <div
          aria-live="polite"
          className="portfolio-assistant-messages ph-no-capture"
          ref={messagesRef}
        >
          {allMessages.length === 0 ? (
            <div className="portfolio-assistant-empty">
              <div>
                <h2>Ask anything about Joseph</h2>
                <p>
                  Ask about his work, experience, products, writing, or résumé—or
                  send Joseph a message.
                </p>
              </div>
              <div className="portfolio-assistant-suggestions">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() =>
                      submitMessage(question.label, {
                        source: "suggestion",
                        suggestionId: question.id
                      })
                    }
                    type="button"
                  >
                    {question.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="portfolio-assistant-thread">
              {messages.map((message, index) => (
                <Message
                  isAnimating={
                    status === "streaming" && index === messages.length - 1
                  }
                  key={message.id}
                  message={message}
                  onRetry={
                    message.id === lastTextAssistantMessage?.id &&
                    !isWorking &&
                    !isVoiceActive
                      ? () => retryTextResponse(message.id)
                      : undefined
                  }
                />
              ))}
              {voice.messages.map((message) => (
                <Message
                  isAnimating={
                    voice.isSpeaking &&
                    message.id === lastVoiceAssistantMessage?.id
                  }
                  key={message.id}
                  message={message}
                  onRetry={
                    message.id === lastVoiceAssistantMessage?.id &&
                    voice.status === "connected" &&
                    !voice.isSpeaking
                      ? () => retryVoiceResponse(message.id)
                      : undefined
                  }
                />
              ))}
              {status === "submitted" ? (
                <div className="assistant-message" data-role="assistant">
                  <span className="assistant-message-label">
                    Joseph’s assistant
                  </span>
                  <span className="assistant-tool-status">
                    <span
                      aria-hidden="true"
                      className="assistant-thinking-dots"
                    >
                      <i />
                      <i />
                      <i />
                    </span>
                    Thinking
                  </span>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <footer className="portfolio-assistant-footer">
          {error || voice.error || transcription.error ? (
            <p className="portfolio-assistant-error" role="alert">
              {voice.error ||
                transcription.error ||
                "The assistant is unavailable right now. Please try again shortly."}
            </p>
          ) : null}
          <form className="portfolio-assistant-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="portfolio-assistant-input">
              Ask a question about Joseph
            </label>
            <textarea
              className="ph-no-capture"
              id="portfolio-assistant-input"
              disabled={isVoiceActive || isTranscriptionActive}
              maxLength={700}
              onChange={(event) => setInput(event.currentTarget.value)}
              onInput={resizeComposer}
              onKeyDown={handleKeyDown}
              placeholder={
                isVoiceActive
                  ? "Live voice is active…"
                  : transcription.status === "recording"
                    ? "Listening…"
                    : transcription.status === "transcribing"
                      ? "Transcribing your recording…"
                      : "Ask anything about Joseph…"
              }
              ref={inputRef}
              rows={1}
              value={input}
            />
            <div className="portfolio-assistant-form-actions">
              <button
                aria-label={
                  isVoiceActive
                    ? "End live voice"
                    : voice.dailyLimitReached
                      ? "Live voice daily limit reached"
                      : "Start live voice"
                }
                aria-pressed={isVoiceActive}
                className="portfolio-assistant-voice-button"
                data-state={voice.status}
                disabled={
                  isWorking ||
                  isTranscriptionActive ||
                  (voice.dailyLimitReached && !isVoiceActive) ||
                  voice.status === "connecting" ||
                  voice.status === "disconnecting"
                }
                onClick={toggleVoice}
                title={
                  isVoiceActive
                    ? "End live voice"
                    : voice.dailyLimitReached
                      ? formatDailyLimitTitle(voice.dailyLimitResetAt)
                      : Number.isFinite(voice.dailyRemainingSeconds)
                        ? `${formatRemainingTime(
                            voice.dailyRemainingSeconds
                          )} of Live voice remains in this 24-hour period`
                    : "Start a three-minute voice conversation"
                }
                type="button"
              >
                {voice.status === "connected" ? (
                  <StopIcon className="assistant-compact-filled-icon" />
                ) : (
                  <VoiceIcon />
                )}
                <span>{getVoiceButtonLabel()}</span>
              </button>
              <span className="portfolio-assistant-submit-actions">
                <button
                  aria-label={
                    transcription.status === "recording"
                      ? "Finish and transcribe recording"
                      : "Record speech to transcribe"
                  }
                  aria-pressed={transcription.status === "recording"}
                  className="portfolio-assistant-talk-button"
                  data-state={transcription.status}
                  disabled={
                    isWorking ||
                    isVoiceActive ||
                    transcription.status === "transcribing"
                  }
                  onClick={toggleTranscription}
                  title="Record speech and add the transcript to your message"
                  type="button"
                >
                  {transcription.status === "recording" ? (
                    <StopIcon className="assistant-compact-filled-icon" />
                  ) : (
                    <MicrophoneIcon className="assistant-compact-filled-icon" />
                  )}
                  <span>{getTranscriptionButtonLabel()}</span>
                </button>
                <button
                  aria-label={isWorking ? "Stop response" : "Send message"}
                  className="portfolio-assistant-send-button"
                  disabled={
                    isVoiceActive ||
                    isTranscriptionActive ||
                    (!isWorking && !input.trim())
                  }
                  onClick={isWorking ? stopResponse : undefined}
                  type={isWorking ? "button" : "submit"}
                >
                  {isWorking ? (
                    <StopIcon className="assistant-compact-filled-icon" />
                  ) : (
                    <SendIcon />
                  )}
                </button>
              </span>
            </div>
          </form>
          <p className="portfolio-assistant-note">
            AI can make mistakes. Check important details.
          </p>
        </footer>
    </div>
  );

  if (isPage) {
    return (
      <main
        aria-labelledby="portfolio-assistant-title"
        className="portfolio-assistant-page"
        id="portfolio-assistant-page"
      >
        {assistantContent}
      </main>
    );
  }

  return (
    <dialog
      aria-labelledby="portfolio-assistant-title"
      className="portfolio-assistant-dialog"
      id="portfolio-assistant-dialog"
      onClose={onClose}
      ref={dialogRef}
    >
      {assistantContent}
    </dialog>
  );
}

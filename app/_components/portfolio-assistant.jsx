"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Streamdown } from "streamdown";
import {
  ANALYTICS_EVENTS,
  captureAnalyticsEvent,
  getPostHogDistinctId
} from "../../lib/analytics";
import { ContactMessageCard } from "./contact-message-card";

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

function StopIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <rect x="6.5" y="6.5" width="7" height="7" />
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

function Message({ isAnimating, message }) {
  const isUser = message.role === "user";

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
    </div>
  );
}

function resizeComposer(event) {
  const textarea = event.currentTarget;
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, 104)}px`;
}

export function PortfolioAssistant({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const [input, setInput] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState(
    getRandomSuggestions
  );
  const {
    clearError,
    error,
    messages,
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
  const closeAssistant = useEffectEvent(onClose);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.show();
      window.requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }

    if (!open) {
      return;
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeAssistant();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  useEffect(() => {
    if (!open || !messagesRef.current) {
      return;
    }

    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: status === "streaming" ? "auto" : "smooth"
    });
  }, [messages, open, status]);

  function submitMessage(
    value,
    { source = "composer", suggestionId } = {}
  ) {
    const text = value.trim();

    if (!text || isWorking) {
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

    captureAnalyticsEvent(ANALYTICS_EVENTS.assistantNewChatStarted, {
      current_path: pathname,
      previous_message_count: messages.length
    });
    clearError();
    setMessages([]);
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

  return (
    <dialog
      aria-labelledby="portfolio-assistant-title"
      className="portfolio-assistant-dialog"
      id="portfolio-assistant-dialog"
      onClose={onClose}
      ref={dialogRef}
    >
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
            {messages.length > 0 ? (
              <button
                className="portfolio-assistant-new-chat"
                onClick={startNewChat}
                type="button"
              >
                New chat
              </button>
            ) : null}
            <button
              aria-label="Close assistant"
              className="portfolio-assistant-close"
              onClick={onClose}
              type="button"
            >
              <CloseIcon />
            </button>
          </span>
        </header>

        <div
          aria-live="polite"
          className="portfolio-assistant-messages ph-no-capture"
          ref={messagesRef}
        >
          {messages.length === 0 ? (
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
          {error ? (
            <p className="portfolio-assistant-error" role="alert">
              The assistant is unavailable right now. Please try again shortly.
            </p>
          ) : null}
          <form className="portfolio-assistant-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="portfolio-assistant-input">
              Ask a question about Joseph
            </label>
            <textarea
              className="ph-no-capture"
              id="portfolio-assistant-input"
              maxLength={700}
              onChange={(event) => setInput(event.currentTarget.value)}
              onInput={resizeComposer}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Joseph…"
              ref={inputRef}
              rows={1}
              value={input}
            />
            <div className="portfolio-assistant-form-actions">
              <button
                aria-label={isWorking ? "Stop response" : "Send message"}
                disabled={!isWorking && !input.trim()}
                onClick={isWorking ? stopResponse : undefined}
                type={isWorking ? "button" : "submit"}
              >
                {isWorking ? <StopIcon /> : <SendIcon />}
              </button>
            </div>
          </form>
          <p className="portfolio-assistant-note">
            AI can make mistakes. Check important details.
          </p>
        </footer>
      </div>
    </dialog>
  );
}

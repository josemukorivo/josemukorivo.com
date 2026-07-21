"use client";

import { useEffect, useRef, useState } from "react";
import {
  ANALYTICS_EVENTS,
  captureAnalyticsEvent
} from "../../lib/analytics";

const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let turnstileScriptPromise;

function loadTurnstile() {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${TURNSTILE_SCRIPT_URL}"]`
    );
    const script = existingScript || document.createElement("script");

    function handleLoad() {
      if (window.turnstile) {
        resolve(window.turnstile);
        return;
      }

      turnstileScriptPromise = undefined;
      reject(new Error("Turnstile did not initialize."));
    }

    function handleError() {
      turnstileScriptPromise = undefined;
      reject(new Error("Turnstile failed to load."));
    }

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.async = true;
      script.defer = true;
      script.src = TURNSTILE_SCRIPT_URL;
      document.head.append(script);
    }
  });

  return turnstileScriptPromise;
}

function ContactDelivered() {
  return (
    <section
      className="assistant-contact-card assistant-generative-ui"
      data-state="sent"
    >
      <span className="assistant-contact-kicker">
        <i aria-hidden="true" /> Message sent
      </span>
      <strong>Joseph has received your message.</strong>
      <p>He can reply directly to the email address you provided.</p>
    </section>
  );
}

export function ContactMessageCard({ output }) {
  const challengeRef = useRef(null);
  const requestIdRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    captureAnalyticsEvent(ANALYTICS_EVENTS.contactMessagePrepared);
  }, []);

  useEffect(() => {
    if (!siteKey || !challengeRef.current) {
      return;
    }

    let active = true;

    loadTurnstile()
      .then((turnstile) => {
        if (!active || !challengeRef.current) {
          return;
        }

        widgetIdRef.current = turnstile.render(challengeRef.current, {
          action: "portfolio_contact",
          appearance: "interaction-only",
          callback: (token) => {
            setError("");
            setTurnstileToken(token);
          },
          "error-callback": () => {
            setError("The security check could not load. Please try again.");
            setTurnstileToken("");
          },
          "expired-callback": () => setTurnstileToken(""),
          sitekey: siteKey,
          size: "flexible",
          theme: "auto"
        });
      })
      .catch(() => {
        if (active) {
          setError("The security check could not load. Please try again.");
        }
      });

    return () => {
      active = false;

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  async function sendContactMessage() {
    if (!turnstileToken || status === "sending") {
      return;
    }

    if (!requestIdRef.current) {
      requestIdRef.current = crypto.randomUUID();
    }

    setError("");
    setStatus("sending");
    captureAnalyticsEvent(ANALYTICS_EVENTS.contactMessageSendRequested);

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify({
          email: output.email,
          message: output.message,
          name: output.name,
          requestId: requestIdRef.current,
          turnstileToken
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "The message could not be sent.");
      }

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }

      setStatus("sent");
      captureAnalyticsEvent(ANALYTICS_EVENTS.contactMessageSent);
    } catch (sendError) {
      setError(sendError.message || "The message could not be sent.");
      setStatus("idle");
      setTurnstileToken("");
      captureAnalyticsEvent(ANALYTICS_EVENTS.contactMessageFailed);

      if (widgetIdRef.current) {
        window.turnstile?.reset(widgetIdRef.current);
      }
    }
  }

  if (status === "sent") {
    return <ContactDelivered />;
  }

  return (
    <section className="assistant-contact-card assistant-generative-ui">
      <span className="assistant-contact-kicker">Review before sending</span>
      <div className="assistant-contact-identity">
        <strong>{output.name}</strong>
        <span>{output.email}</span>
      </div>
      <p className="assistant-contact-message">{output.message}</p>
      <div
        aria-label="Security verification"
        className="assistant-contact-challenge"
        ref={challengeRef}
      />
      {!siteKey ? (
        <p className="assistant-contact-error" role="alert">
          Contact messaging is not configured yet.
        </p>
      ) : null}
      {error ? (
        <p className="assistant-contact-error" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="assistant-contact-send"
        disabled={!turnstileToken || status === "sending"}
        onClick={sendContactMessage}
        type="button"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <span className="assistant-contact-consent">
        Nothing is sent until you press this button.
      </span>
    </section>
  );
}

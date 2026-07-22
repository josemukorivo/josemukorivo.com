"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  OPEN_PORTFOLIO_ASSISTANT_EVENT,
  queuePortfolioAssistantPrompt
} from "./assistant-events";
import {
  ANALYTICS_EVENTS,
  captureAnalyticsEvent
} from "../../lib/analytics";
import { ThemeToggle } from "./theme-toggle";

const PortfolioAssistant = dynamic(
  () =>
    import("./portfolio-assistant").then(
      (module) => module.PortfolioAssistant
    ),
  { ssr: false }
);

let invitationAudioContext;

const ASSISTANT_INVITATION_STORAGE_KEY =
  "joseph-portfolio:assistant-invitation:v1";
const ASSISTANT_INVITATION_DISMISSAL_MS = 14 * 24 * 60 * 60 * 1000;
const DESKTOP_INVITATION_DELAY_MS = 5000;
const MOBILE_INVITATION_DELAY_MS = 10000;
const MOBILE_INVITATION_VISIBLE_MS = 8000;

const DEFAULT_INVITATION_COPY = Object.freeze({
  context: "general",
  description: "Ask about me, my work, and what I’m building.",
  prompt: "Tell me more about Joseph, his work, and what he is building.",
  title: "Ask Maya"
});

function getAssistantInvitationCopy(pathname) {
  if (pathname.startsWith("/blog/")) {
    return {
      context: "article",
      description: "Get a quick summary or explore the ideas behind it.",
      prompt:
        "Summarize the article I am currently reading and explain its main takeaway.",
      title: "Ask about this article"
    };
  }

  if (pathname === "/blog") {
    return {
      context: "writing",
      description: "Explore an article or ask for a quick summary.",
      prompt:
        "Give me an overview of Joseph's writing and recommend an article to start with.",
      title: "Ask about my writing"
    };
  }

  if (pathname === "/projects") {
    return {
      context: "projects",
      description: "Get the story behind what I built and why.",
      prompt:
        "Tell me about these projects and which one best represents Joseph's work.",
      title: "Ask about these projects"
    };
  }

  return DEFAULT_INVITATION_COPY;
}

function readAssistantInvitationPreference() {
  try {
    const storedPreference = window.localStorage.getItem(
      ASSISTANT_INVITATION_STORAGE_KEY
    );

    return storedPreference ? JSON.parse(storedPreference) : undefined;
  } catch {
    return undefined;
  }
}

function writeAssistantInvitationPreference(preference) {
  try {
    window.localStorage.setItem(
      ASSISTANT_INVITATION_STORAGE_KEY,
      JSON.stringify(preference)
    );
  } catch {
    // The invitation remains usable when storage is unavailable.
  }
}

function rememberAssistantWasOpened() {
  writeAssistantInvitationPreference({
    status: "opened",
    updatedAt: Date.now()
  });
}

function snoozeAssistantInvitation() {
  writeAssistantInvitationPreference({
    status: "dismissed",
    suppressUntil: Date.now() + ASSISTANT_INVITATION_DISMISSAL_MS
  });
}

function assistantInvitationShouldAppear() {
  const preference = readAssistantInvitationPreference();

  if (preference?.status === "opened") {
    return false;
  }

  if (
    preference?.status === "dismissed" &&
    Number.isFinite(preference.suppressUntil) &&
    preference.suppressUntil > Date.now()
  ) {
    return false;
  }

  return true;
}

function HomeIcon() {
  return (
    <span className="site-dock-avatar">
      <Image
        alt=""
        height={28}
        sizes="28px"
        src="/assets/joseph.webp"
        width={28}
      />
    </span>
  );
}

function WritingIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M5 4.5h10M5 8h10M5 11.5h7M5 15h5" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M4 5.25h4.25L10 7h6v8H4v-9.75Z" />
      <path d="M4 8h12" />
    </svg>
  );
}

function AssistantIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M10 6.25c-.314 0-.594.195-.703.49l-.516 1.394c-.7 1.892-.985 2.615-1.509 3.138-.523.524-1.246.809-3.138 1.509l-1.394.516a.75.75 0 0 0 0 1.406l1.394.516c1.892.7 2.615.985 3.138 1.509.524.523.809 1.246 1.509 3.138l.516 1.394a.75.75 0 0 0 1.406 0l.516-1.394c.7-1.892.985-2.615 1.509-3.138.523-.524 1.246-.809 3.138-1.509l1.394-.516a.75.75 0 0 0 0-1.406l-1.394-.516c-1.892-.7-2.615-.985-3.138-1.509-.524-.523-.809-1.246-1.509-3.138l-.516-1.394a.75.75 0 0 0-.703-.49Z" />
      <path d="M18 2.25a.75.75 0 0 0-.703.49l-.221.597c-.314.848-.405 1.048-.548 1.191-.142.142-.343.234-1.191.548l-.597.22a.75.75 0 0 0 0 1.407l.597.221c.848.314 1.049.405 1.191.548.143.142.234.343.548 1.19l.221.598a.75.75 0 0 0 1.406 0l.221-.597c.314-.848.405-1.049.548-1.191.142-.143.343-.234 1.19-.548l.598-.221a.75.75 0 0 0 0-1.406l-.597-.221c-.848-.314-1.049-.406-1.191-.548-.143-.143-.234-.343-.548-1.191l-.221-.597a.75.75 0 0 0-.703-.49Z" />
    </svg>
  );
}

function AssistantArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M4 12 12 4M6 4h6v6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="m4.5 4.5 7 7m0-7-7 7" />
    </svg>
  );
}

function getInvitationAudioContext() {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return undefined;
  }

  if (!invitationAudioContext || invitationAudioContext.state === "closed") {
    invitationAudioContext = new AudioContextClass();
  }

  return invitationAudioContext;
}

async function primeAssistantInvitationSound() {
  const audioContext = getInvitationAudioContext();

  if (!audioContext) {
    return false;
  }

  if (audioContext.state === "running") {
    return true;
  }

  try {
    await audioContext.resume();
    return audioContext.state === "running";
  } catch {
    return false;
  }
}

function playAssistantInvitationSound() {
  if (document.visibilityState !== "visible") {
    return false;
  }

  const audioContext = getInvitationAudioContext();

  if (!audioContext || audioContext.state !== "running") {
    return false;
  }

  function playChime() {
    const startTime = audioContext.currentTime;
    const output = audioContext.createGain();

    output.gain.setValueAtTime(0.0001, startTime);
    output.gain.exponentialRampToValueAtTime(0.11, startTime + 0.016);
    output.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.42);
    output.connect(audioContext.destination);

    [
      { frequency: 520, offset: 0, duration: 0.22 },
      { frequency: 780, offset: 0.085, duration: 0.3 }
    ].forEach(({ duration, frequency, offset }) => {
      const oscillator = audioContext.createOscillator();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, startTime + offset);
      oscillator.connect(output);
      oscillator.start(startTime + offset);
      oscillator.stop(startTime + offset + duration);
    });

    window.setTimeout(() => {
      audioContext.close().catch(() => {});
      invitationAudioContext = undefined;
    }, 540);
  }

  playChime();
  return true;
}

const ITEMS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/blog", label: "Writing", icon: WritingIcon },
  { href: "/projects", label: "Projects", icon: ProjectsIcon }
];

function isActivePath(pathname, href) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

function MobileAssistantLauncher({ onOpen, pathname }) {
  return (
    <Link
      aria-label="Open Maya, Joseph’s AI assistant"
      className="mobile-assistant-launcher"
      href="/assistant"
      onClick={() => {
        rememberAssistantWasOpened();
        onOpen();
        captureAnalyticsEvent(ANALYTICS_EVENTS.assistantOpened, {
          current_path: pathname,
          source: "mobile_floating_launcher"
        });
      }}
    >
      <AssistantIcon />
    </Link>
  );
}

export function SiteDock() {
  const pathname = usePathname();
  const router = useRouter();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantLoaded, setAssistantLoaded] = useState(false);
  const [assistantLaunchRequest, setAssistantLaunchRequest] = useState(null);
  const [invitationState, setInvitationState] = useState("checking");
  const invitationSoundPending = useRef(false);
  const invitationSoundPlayed = useRef(false);
  const isAssistantPage = pathname === "/assistant";
  const invitationCopy = getAssistantInvitationCopy(pathname);

  const attemptInvitationSound = useEffectEvent(() => {
    if (invitationSoundPlayed.current) {
      return;
    }

    const didPlay = playAssistantInvitationSound();

    invitationSoundPlayed.current = didPlay;
    invitationSoundPending.current = !didPlay;
  });

  function openAssistant(source, initialPrompt) {
    const launchRequest = initialPrompt
      ? {
          id: window.crypto.randomUUID(),
          source: "contextual_invitation",
          text: initialPrompt
        }
      : null;

    rememberAssistantWasOpened();
    setInvitationState("dismissed");
    captureAnalyticsEvent(ANALYTICS_EVENTS.assistantOpened, {
      current_path: pathname,
      source
    });

    if (window.matchMedia("(max-width: 680px)").matches) {
      queuePortfolioAssistantPrompt(launchRequest);
      router.push("/assistant");
      return;
    }

    setAssistantLaunchRequest(launchRequest);
    setAssistantLoaded(true);
    setAssistantOpen(true);
  }

  useEffect(() => {
    if (isAssistantPage) {
      rememberAssistantWasOpened();
    }

    const preferenceFrame = window.requestAnimationFrame(() => {
      setInvitationState(
        !isAssistantPage && assistantInvitationShouldAppear()
          ? "waiting"
          : "dismissed"
      );
    });

    return () => window.cancelAnimationFrame(preferenceFrame);
  }, [isAssistantPage]);

  useEffect(() => {
    if (
      isAssistantPage ||
      invitationSoundPlayed.current ||
      !["waiting", "visible"].includes(invitationState)
    ) {
      return undefined;
    }

    async function primeSound() {
      window.removeEventListener("pointerdown", primeSound);
      window.removeEventListener("keydown", primeSound);

      const audioReady = await primeAssistantInvitationSound();

      if (audioReady && invitationSoundPending.current) {
        attemptInvitationSound();
      }
    }

    window.addEventListener("pointerdown", primeSound, {
      once: true,
      passive: true
    });
    window.addEventListener("keydown", primeSound, { once: true });

    return () => {
      window.removeEventListener("pointerdown", primeSound);
      window.removeEventListener("keydown", primeSound);
    };
  }, [invitationState, isAssistantPage]);

  useEffect(() => {
    if (isAssistantPage || invitationState !== "waiting") {
      return undefined;
    }

    const invitationDelay = window.matchMedia(
      "(max-width: 680px)"
    ).matches
      ? MOBILE_INVITATION_DELAY_MS
      : DESKTOP_INVITATION_DELAY_MS;

    const invitationTimer = window.setTimeout(() => {
      setInvitationState("visible");
      invitationSoundPending.current = true;
      attemptInvitationSound();
      captureAnalyticsEvent(ANALYTICS_EVENTS.assistantInvitationShown, {
        current_path: pathname,
        delay_ms: invitationDelay,
        invitation_context: invitationCopy.context
      });
    }, invitationDelay);

    return () => window.clearTimeout(invitationTimer);
  }, [invitationCopy.context, invitationState, isAssistantPage, pathname]);

  useEffect(() => {
    if (
      isAssistantPage ||
      invitationState !== "visible" ||
      !window.matchMedia("(max-width: 680px)").matches
    ) {
      return undefined;
    }

    const dismissalTimer = window.setTimeout(() => {
      setInvitationState("dismissed");
    }, MOBILE_INVITATION_VISIBLE_MS);

    return () => window.clearTimeout(dismissalTimer);
  }, [invitationState, isAssistantPage]);

  useEffect(() => {
    function handleOpenAssistant(event) {
      rememberAssistantWasOpened();
      setInvitationState("dismissed");
      setAssistantLaunchRequest(null);
      captureAnalyticsEvent(ANALYTICS_EVENTS.assistantOpened, {
        current_path: pathname,
        source: event.detail?.source || "unknown"
      });

      if (window.matchMedia("(max-width: 680px)").matches) {
        router.push("/assistant");
        return;
      }

      setAssistantLoaded(true);
      setAssistantOpen(true);
    }

    window.addEventListener(
      OPEN_PORTFOLIO_ASSISTANT_EVENT,
      handleOpenAssistant
    );

    return () =>
      window.removeEventListener(
        OPEN_PORTFOLIO_ASSISTANT_EVENT,
        handleOpenAssistant
      );
  }, [pathname, router]);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className="site-dock"
        data-assistant-page={isAssistantPage ? "true" : undefined}
      >
        <span aria-hidden="true" className="site-dock-surface" />
        {ITEMS.map(({ href, icon: Icon, label }) => {
          const active = isActivePath(pathname, href);

          return (
            <Link
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className="site-dock-item"
              data-active={active ? "true" : undefined}
              href={href}
              key={href}
            >
              <Icon />
              <span className="site-dock-label" aria-hidden="true">
                {label}
              </span>
            </Link>
          );
        })}
        <span aria-hidden="true" className="site-dock-divider" />
        <span className="site-dock-theme">
          <ThemeToggle />
        </span>
      </nav>
      {!isAssistantPage ? (
        <>
          {invitationState !== "visible" ? (
            <MobileAssistantLauncher
              onOpen={() => setInvitationState("dismissed")}
              pathname={pathname}
            />
          ) : null}
          {invitationState === "visible" && !assistantOpen ? (
            <aside
              aria-label="Maya invitation"
              className="assistant-invitation"
            >
              <button
                className="assistant-invitation-action"
                onClick={() => {
                  captureAnalyticsEvent(
                    ANALYTICS_EVENTS.assistantInvitationClicked,
                    {
                      current_path: pathname,
                      invitation_context: invitationCopy.context
                    }
                  );
                  openAssistant("timed_invitation", invitationCopy.prompt);
                }}
                type="button"
              >
                <span className="assistant-invitation-accent">
                  {invitationCopy.title}
                  <AssistantArrow />
                </span>
                <span className="assistant-invitation-description">
                  {invitationCopy.description}
                </span>
              </button>
              <button
                aria-label="Dismiss Maya invitation"
                className="assistant-invitation-close"
                onClick={() => {
                  snoozeAssistantInvitation();
                  setInvitationState("dismissed");
                  captureAnalyticsEvent(
                    ANALYTICS_EVENTS.assistantInvitationDismissed,
                    {
                      current_path: pathname,
                      invitation_context: invitationCopy.context,
                      reason: "manual"
                    }
                  );
                }}
                type="button"
              >
                <CloseIcon />
              </button>
            </aside>
          ) : null}
          {invitationState !== "visible" ? (
            <button
              aria-controls="portfolio-assistant-dialog"
              aria-expanded={assistantOpen}
              className="assistant-launcher"
              data-open={assistantOpen ? "true" : undefined}
              onClick={() => {
                if (assistantOpen) {
                  setAssistantOpen(false);
                  return;
                }

                openAssistant("floating_launcher");
              }}
              type="button"
            >
              <span className="assistant-launcher-copy">
                Ask Maya
              </span>
              <AssistantArrow />
            </button>
          ) : null}
        </>
      ) : null}
      {assistantLoaded && !isAssistantPage ? (
        <PortfolioAssistant
          initialPrompt={assistantLaunchRequest}
          onClose={() => setAssistantOpen(false)}
          open={assistantOpen}
        />
      ) : null}
    </>
  );
}

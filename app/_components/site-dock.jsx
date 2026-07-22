"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { OPEN_PORTFOLIO_ASSISTANT_EVENT } from "./assistant-events";
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

export function SiteDock() {
  const pathname = usePathname();
  const router = useRouter();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantLoaded, setAssistantLoaded] = useState(false);
  const [invitationState, setInvitationState] = useState("waiting");
  const invitationSoundPending = useRef(false);
  const invitationSoundPlayed = useRef(false);
  const isAssistantPage = pathname === "/assistant";

  const attemptInvitationSound = useEffectEvent(() => {
    if (invitationSoundPlayed.current) {
      return;
    }

    const didPlay = playAssistantInvitationSound();

    invitationSoundPlayed.current = didPlay;
    invitationSoundPending.current = !didPlay;
  });

  function openAssistant(source) {
    setInvitationState("dismissed");
    captureAnalyticsEvent(ANALYTICS_EVENTS.assistantOpened, {
      current_path: pathname,
      source
    });
    setAssistantLoaded(true);
    setAssistantOpen(true);
  }

  useEffect(() => {
    if (isAssistantPage) {
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
  }, [isAssistantPage]);

  useEffect(() => {
    if (isAssistantPage || invitationState !== "waiting") {
      return undefined;
    }

    const invitationTimer = window.setTimeout(() => {
      setInvitationState("visible");
      invitationSoundPending.current = true;
      attemptInvitationSound();
      captureAnalyticsEvent(ANALYTICS_EVENTS.assistantInvitationShown, {
        current_path: pathname,
        delay_ms: 5000
      });
    }, 5000);

    return () => window.clearTimeout(invitationTimer);
  }, [invitationState, isAssistantPage, pathname]);

  useEffect(() => {
    function handleOpenAssistant(event) {
      setInvitationState("dismissed");
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
      <nav aria-label="Main navigation" className="site-dock">
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
          {invitationState === "visible" && !assistantOpen ? (
            <aside
              aria-label="AI assistant invitation"
              className="assistant-invitation"
            >
              <button
                className="assistant-invitation-action"
                onClick={() => {
                  captureAnalyticsEvent(
                    ANALYTICS_EVENTS.assistantInvitationClicked,
                    { current_path: pathname }
                  );
                  openAssistant("timed_invitation");
                }}
                type="button"
              >
                <span className="assistant-invitation-accent">
                  Ask my AI Assistant
                  <AssistantArrow />
                </span>
                <span className="assistant-invitation-description">
                  Ask about me, my work, and what I’m building.
                </span>
              </button>
              <button
                aria-label="Dismiss AI assistant invitation"
                className="assistant-invitation-close"
                onClick={() => {
                  setInvitationState("dismissed");
                  captureAnalyticsEvent(
                    ANALYTICS_EVENTS.assistantInvitationDismissed,
                    {
                      current_path: pathname,
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
                Ask my AI Assistant
              </span>
              <AssistantArrow />
            </button>
          ) : null}
        </>
      ) : null}
      {assistantLoaded && !isAssistantPage ? (
        <PortfolioAssistant
          onClose={() => setAssistantOpen(false)}
          open={assistantOpen}
        />
      ) : null}
    </>
  );
}

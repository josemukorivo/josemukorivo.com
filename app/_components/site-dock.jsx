"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState
} from "react";
import {
  OPEN_PORTFOLIO_ASSISTANT_EVENT,
  queuePortfolioAssistantPrompt
} from "./assistant-events";
import {
  ANALYTICS_EVENTS,
  captureAnalyticsEvent
} from "../../lib/analytics";
import {
  localizePath,
  stripLocaleFromPathname
} from "../../lib/i18n-config";
import {
  HandDrawnArrowIcon,
  HandDrawnAssistantIcon,
  HandDrawnCloseIcon,
  HandDrawnProjectsIcon,
  HandDrawnWritingIcon
} from "./hand-drawn-icon";
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
const DOCK_HIDE_DELAY_MS = 1200;

const DEFAULT_INVITATION_COPY = Object.freeze({
  context: "general",
  description: "Ask about me, my work, and what I’m building.",
  prompt: "Tell me more about Joseph, his work, and what he is building.",
  title: "Talk to Maya"
});

function getAssistantInvitationCopy(pathname, messages) {
  if (pathname.startsWith("/blog/")) {
    return {
      context: "article",
      description: messages.article.description,
      prompt:
        "Summarize the article I am currently reading and explain its main takeaway.",
      title: messages.article.title
    };
  }

  if (pathname === "/blog") {
    return {
      context: "writing",
      description: messages.writing.description,
      prompt:
        "Give me an overview of Joseph's writing and recommend an article to start with.",
      title: messages.writing.title
    };
  }

  if (pathname === "/projects") {
    return {
      context: "projects",
      description: messages.projects.description,
      prompt:
        "Tell me about these projects and which one best represents Joseph's work.",
      title: messages.projects.title
    };
  }

  return {
    ...DEFAULT_INVITATION_COPY,
    ...messages.general
  };
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
  return <HandDrawnWritingIcon />;
}

function ProjectsIcon() {
  return <HandDrawnProjectsIcon />;
}

function AssistantIcon() {
  return <HandDrawnAssistantIcon />;
}

function AssistantArrow() {
  return <HandDrawnArrowIcon />;
}

function CloseIcon() {
  return <HandDrawnCloseIcon />;
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
  { href: "/", labelKey: "home", icon: HomeIcon },
  { href: "/blog", labelKey: "writing", icon: WritingIcon },
  { href: "/projects", labelKey: "projects", icon: ProjectsIcon }
];

function isActivePath(pathname, href) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

function MobileAssistantLauncher({ ariaLabel, href, onOpen, pathname }) {
  return (
    <Link
      aria-label={ariaLabel}
      className="mobile-assistant-launcher"
      href={href}
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

export function SiteDock({
  invitationMessages,
  locale,
  messages,
  themeMessages
}) {
  const pathname = usePathname() ?? "";
  const basePathname = stripLocaleFromPathname(pathname);
  const router = useRouter();
  const [dockVisible, setDockVisible] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantLoaded, setAssistantLoaded] = useState(false);
  const [assistantLaunchRequest, setAssistantLaunchRequest] = useState(null);
  const [invitationState, setInvitationState] = useState("checking");
  const invitationSoundPending = useRef(false);
  const invitationSoundPlayed = useRef(false);
  const dockEngaged = useRef(false);
  const dockHideTimeout = useRef(null);
  const isAssistantPage = basePathname === "/assistant";
  const invitationCopy = getAssistantInvitationCopy(
    basePathname,
    invitationMessages
  );

  const clearDockHideTimeout = useCallback(() => {
    if (dockHideTimeout.current === null) {
      return;
    }

    window.clearTimeout(dockHideTimeout.current);
    dockHideTimeout.current = null;
  }, []);

  const scheduleDockHide = useCallback(() => {
    clearDockHideTimeout();
    dockHideTimeout.current = window.setTimeout(() => {
      if (!dockEngaged.current) {
        setDockVisible(false);
      }
    }, DOCK_HIDE_DELAY_MS);
  }, [clearDockHideTimeout]);

  const keepDockOpen = useCallback(() => {
    dockEngaged.current = true;
    clearDockHideTimeout();
  }, [clearDockHideTimeout]);

  const releaseDock = useCallback(() => {
    dockEngaged.current = false;
    scheduleDockHide();
  }, [scheduleDockHide]);

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
      router.push(localizePath("/assistant", locale));
      return;
    }

    setAssistantLaunchRequest(launchRequest);
    setAssistantLoaded(true);
    setAssistantOpen(true);
  }

  useEffect(() => {
    const siteHeader = document.querySelector("[data-site-header]");

    const showDockWhileScrolling = () => {
      setDockVisible(true);
      scheduleDockHide();
    };

    const handleScroll = () => {
      if (siteHeader?.getBoundingClientRect().bottom > 0) {
        clearDockHideTimeout();
        setDockVisible(false);
        return;
      }

      showDockWhileScrolling();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearDockHideTimeout();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [clearDockHideTimeout, scheduleDockHide]);

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
        router.push(localizePath("/assistant", locale));
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
  }, [locale, pathname, router]);

  return (
    <>
      <nav
        aria-label={messages.ariaLabel}
        className="site-dock"
        data-assistant-page={isAssistantPage ? "true" : undefined}
        data-visible={dockVisible ? "true" : "false"}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            releaseDock();
          }
        }}
        onFocusCapture={keepDockOpen}
        onPointerEnter={keepDockOpen}
        onPointerLeave={releaseDock}
      >
        <span aria-hidden="true" className="site-dock-surface" />
        {ITEMS.map(({ href, icon: Icon, labelKey }) => {
          const active = isActivePath(basePathname, href);
          const label = messages[labelKey];

          return (
            <Link
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className="site-dock-item"
              data-active={active ? "true" : undefined}
              href={localizePath(href, locale)}
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
          <ThemeToggle messages={themeMessages} />
        </span>
      </nav>
      {!isAssistantPage ? (
        <>
          {invitationState !== "visible" ? (
            <MobileAssistantLauncher
              ariaLabel={messages.openAssistant}
              href={localizePath("/assistant", locale)}
              onOpen={() => setInvitationState("dismissed")}
              pathname={pathname}
            />
          ) : null}
          {invitationState === "visible" && !assistantOpen ? (
            <aside
              aria-label={invitationMessages.ariaLabel}
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
                aria-label={invitationMessages.dismissLabel}
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
                {messages.assistant}
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

"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantLoaded, setAssistantLoaded] = useState(false);

  function openAssistant(source) {
    captureAnalyticsEvent(ANALYTICS_EVENTS.assistantOpened, {
      current_path: pathname,
      source
    });
    setAssistantLoaded(true);
    setAssistantOpen(true);
  }

  useEffect(() => {
    function handleOpenAssistant(event) {
      captureAnalyticsEvent(ANALYTICS_EVENTS.assistantOpened, {
        current_path: pathname,
        source: event.detail?.source || "unknown"
      });
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
  }, [pathname]);

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
        <span className="assistant-launcher-copy">Ask about Joseph</span>
        <AssistantArrow />
      </button>
      {assistantLoaded ? (
        <PortfolioAssistant
          onClose={() => setAssistantOpen(false)}
          open={assistantOpen}
        />
      ) : null}
    </>
  );
}

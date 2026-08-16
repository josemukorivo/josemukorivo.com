"use client";

import { useSyncExternalStore } from "react";
import styles from "../article.module.css";

const MAX_SCROLL_THRESHOLD = 360;
const VIEWPORT_SCROLL_THRESHOLD = 0.4;

function subscribeToViewport(callback) {
  window.addEventListener("scroll", callback, { passive: true });
  window.addEventListener("resize", callback);

  return () => {
    window.removeEventListener("scroll", callback);
    window.removeEventListener("resize", callback);
  };
}

function getIsVisible() {
  const threshold = Math.min(
    window.innerHeight * VIEWPORT_SCROLL_THRESHOLD,
    MAX_SCROLL_THRESHOLD
  );

  return window.scrollY > threshold;
}

function getServerSnapshot() {
  return false;
}

function scrollToTop() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth"
  });
}

export function ScrollToTop() {
  const isVisible = useSyncExternalStore(
    subscribeToViewport,
    getIsVisible,
    getServerSnapshot
  );

  return (
    <button
      aria-label="Back to top"
      className={styles.scrollToTop}
      data-back-to-top=""
      data-visible={isVisible}
      onClick={scrollToTop}
      title="Back to top"
      type="button"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6.8 10.6c1.7-1.6 3.4-3.4 5.2-5.1 1.6 1.5 3.2 3.3 5.2 4.9M12.1 5.7c-.2 4 .1 8.5-.2 12.7" />
        <path
          className={styles.scrollToTopEcho}
          d="M7.4 11c1.5-1.3 3-3.1 4.7-4.6 1.5 1.4 3 3 4.6 4.4M11.5 6.6c.2 3.7-.1 7.5.2 11.2"
        />
      </svg>
    </button>
  );
}

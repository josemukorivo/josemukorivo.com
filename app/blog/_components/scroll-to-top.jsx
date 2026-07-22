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
        <path d="M18 9.473 16.586 10.881 13 7.312V21.5h-2V7.311l-3.586 3.57L6 9.474 12 3.5 18 9.473Z" />
      </svg>
    </button>
  );
}

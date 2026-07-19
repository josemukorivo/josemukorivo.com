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

export function ScrollToTop() {
  const isVisible = useSyncExternalStore(
    subscribeToViewport,
    getIsVisible,
    getServerSnapshot
  );

  function scrollToTop() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  }

  return (
    <button
      aria-label="Back to top"
      className={styles.scrollToTop}
      data-visible={isVisible}
      onClick={scrollToTop}
      title="Back to top"
      type="button"
    >
      <svg aria-hidden="true" viewBox="0 0 18 18">
        <path d="m4 10 5-5 5 5" />
        <path d="M9 5v9" />
      </svg>
    </button>
  );
}

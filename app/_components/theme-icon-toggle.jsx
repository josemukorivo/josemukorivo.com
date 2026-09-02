"use client";

import { useSyncExternalStore } from "react";

import {
  applyTheme,
  getEffectiveTheme,
  subscribeToTheme
} from "../../lib/theme";
import {
  HandDrawnDarkIcon,
  HandDrawnLightIcon
} from "./hand-drawn-icon";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function getServerTheme() {
  return "light";
}

export function ThemeIconToggle({ messages }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getEffectiveTheme,
    getServerTheme
  );
  const nextTheme = theme === "dark" ? "light" : "dark";
  const Icon = nextTheme === "dark" ? HandDrawnDarkIcon : HandDrawnLightIcon;

  function changeTheme() {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    if (!document.startViewTransition || reducedMotion) {
      applyTheme(nextTheme);
      return;
    }

    const root = document.documentElement;
    root.dataset.themeTransition = "revealing";

    const transition = document.startViewTransition(() => {
      applyTheme(nextTheme);
    });
    const clearTransitionState = () => {
      delete root.dataset.themeTransition;
    };

    transition.finished.then(clearTransitionState, clearTransitionState);
  }

  return (
    <button
      aria-label={messages[nextTheme].action}
      className="theme-icon-toggle"
      onClick={changeTheme}
      type="button"
    >
      <span aria-hidden="true" className="theme-icon-toggle-glyph">
        <Icon />
      </span>
    </button>
  );
}

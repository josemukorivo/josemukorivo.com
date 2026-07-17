"use client";

import { useEffect } from "react";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  getEffectiveTheme,
  updateThemeColor
} from "../../lib/theme";

export function ThemeToggle({ className = "" }) {
  useEffect(() => {
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      let hasExplicitTheme = false;

      try {
        hasExplicitTheme = Boolean(
          window.localStorage.getItem(THEME_STORAGE_KEY)
        );
      } catch {
        hasExplicitTheme = Boolean(document.documentElement.dataset.theme);
      }

      if (!hasExplicitTheme) {
        updateThemeColor();
      }
    };

    colorScheme.addEventListener("change", handleSystemThemeChange);

    return () => {
      colorScheme.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  function toggleTheme() {
    applyTheme(getEffectiveTheme() === "dark" ? "light" : "dark");
  }

  return (
    <button
      aria-label="Toggle color theme"
      className={`theme-toggle ${className}`.trim()}
      onClick={toggleTheme}
      title="Toggle color theme"
      type="button"
    >
      <svg
        aria-hidden="true"
        className="theme-toggle-icon theme-toggle-moon"
        viewBox="0 0 18 18"
      >
        <path d="M14.25 11.15A6.15 6.15 0 0 1 6.85 3.75a5.7 5.7 0 1 0 7.4 7.4Z" />
      </svg>
      <svg
        aria-hidden="true"
        className="theme-toggle-icon theme-toggle-sun"
        viewBox="0 0 18 18"
      >
        <circle cx="9" cy="9" r="2.75" />
        <path d="M9 1.75v1.5M9 14.75v1.5M16.25 9h-1.5M3.25 9h-1.5M14.13 3.87l-1.06 1.06M4.93 13.07l-1.06 1.06M14.13 14.13l-1.06-1.06M4.93 4.93 3.87 3.87" />
      </svg>
    </button>
  );
}

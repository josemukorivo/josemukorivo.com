"use client";

import { useSyncExternalStore } from "react";
import {
  THEME_CHANGE_EVENT,
  applyTheme,
  getThemePreference,
  updateThemeColor
} from "../../lib/theme";

function LightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="2.75" />
      <path d="M9 1.75v1.5M9 14.75v1.5M16.25 9h-1.5M3.25 9h-1.5M14.13 3.87l-1.06 1.06M4.93 13.07l-1.06 1.06M14.13 14.13l-1.06-1.06M4.93 4.93 3.87 3.87" />
    </svg>
  );
}

function DarkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18">
      <path d="M14.25 11.15A6.15 6.15 0 0 1 6.85 3.75a5.7 5.7 0 1 0 7.4 7.4Z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18">
      <rect x="2.75" y="3.5" width="12.5" height="8.5" rx="1.25" />
      <path d="M7 14.5h4M9 12v2.5" />
    </svg>
  );
}

const THEMES = [
  { id: "light", label: "Light", icon: LightIcon },
  { id: "system", label: "System", icon: SystemIcon },
  { id: "dark", label: "Dark", icon: DarkIcon }
];

function subscribeToTheme(onStoreChange) {
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemThemeChange = () => {
    if (getThemePreference() === "system") {
      updateThemeColor();
    }

    onStoreChange();
  };

  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  colorScheme.addEventListener("change", handleSystemThemeChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
    colorScheme.removeEventListener("change", handleSystemThemeChange);
  };
}

function selectTheme(theme) {
  applyTheme(theme);
}

export function ThemeToggle({ className = "" }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemePreference,
    () => "system"
  );

  return (
    <div
      aria-label="Color theme"
      className={`theme-toggle ${className}`.trim()}
      role="group"
    >
      {THEMES.map(({ icon: Icon, id, label }) => (
        <button
          aria-label={`Use ${label.toLowerCase()} theme`}
          aria-pressed={theme === id}
          className="theme-toggle-option"
          key={id}
          onClick={() => selectTheme(id)}
          type="button"
        >
          <Icon />
          <span aria-hidden="true" className="site-dock-label">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

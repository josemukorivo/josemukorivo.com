"use client";

import { useSyncExternalStore } from "react";
import {
  THEME_CHANGE_EVENT,
  applyTheme,
  getThemePreference,
  updateThemeColor
} from "../../lib/theme";
import {
  HandDrawnDarkIcon,
  HandDrawnLightIcon,
  HandDrawnSystemIcon
} from "./hand-drawn-icon";

function LightIcon() {
  return <HandDrawnLightIcon />;
}

function DarkIcon() {
  return <HandDrawnDarkIcon />;
}

function SystemIcon() {
  return <HandDrawnSystemIcon />;
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

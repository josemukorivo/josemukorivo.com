"use client";

import { useSyncExternalStore } from "react";
import {
  applyTheme,
  getThemePreference,
  subscribeToTheme
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
  { id: "light", icon: LightIcon },
  { id: "system", icon: SystemIcon },
  { id: "dark", icon: DarkIcon }
];

function selectTheme(theme) {
  applyTheme(theme);
}

export function ThemeToggle({ className = "", messages }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemePreference,
    () => "light"
  );

  return (
    <div
      aria-label={messages.ariaLabel}
      className={`theme-toggle ${className}`.trim()}
      role="group"
    >
      {THEMES.map(({ icon: Icon, id }) => (
        <button
          aria-label={messages.options[id].action}
          aria-pressed={theme === id}
          className="theme-toggle-option"
          key={id}
          onClick={() => selectTheme(id)}
          type="button"
        >
          <Icon />
          <span aria-hidden="true" className="site-dock-label">
            {messages.options[id].label}
          </span>
        </button>
      ))}
    </div>
  );
}

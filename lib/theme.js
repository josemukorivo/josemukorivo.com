export const THEME_STORAGE_KEY = "joseph-color-theme";
export const THEME_CHANGE_EVENT = "joseph-theme-change";

export const THEME_COLORS = {
  light: "#ffffff",
  dark: "#080807"
};

export const THEME_PREFERENCES = ["light", "dark", "system"];

export function getThemePreference() {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (THEME_PREFERENCES.includes(storedTheme)) {
      return storedTheme;
    }
  } catch {
    // Fall back to the current document state when storage is unavailable.
  }

  return "light";
}

export function getEffectiveTheme() {
  if (typeof document === "undefined") {
    return "light";
  }

  const explicitTheme = document.documentElement.dataset.theme;

  if (explicitTheme === "light" || explicitTheme === "dark") {
    return explicitTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme) {
  if (!THEME_PREFERENCES.includes(theme)) {
    return;
  }

  if (theme === "system") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The selected theme still applies when storage is unavailable.
  }

  updateThemeColor(theme === "system" ? getEffectiveTheme() : theme);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function updateThemeColor(theme = getEffectiveTheme()) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
}

export function subscribeToTheme(onStoreChange) {
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemThemeChange = () => {
    if (getThemePreference() === "system") {
      updateThemeColor();
    }

    onStoreChange();
  };
  const handleStorageChange = (event) => {
    if (event.key !== THEME_STORAGE_KEY) {
      return;
    }

    const theme = THEME_PREFERENCES.includes(event.newValue)
      ? event.newValue
      : "system";

    if (theme === "system") {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = theme;
    }

    updateThemeColor(theme === "system" ? getEffectiveTheme() : theme);
    onStoreChange();
  };

  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", handleStorageChange);
  colorScheme.addEventListener("change", handleSystemThemeChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", handleStorageChange);
    colorScheme.removeEventListener("change", handleSystemThemeChange);
  };
}

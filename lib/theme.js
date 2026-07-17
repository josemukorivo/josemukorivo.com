export const THEME_STORAGE_KEY = "joseph-color-theme";

export const THEME_COLORS = {
  light: "#fdfdfc",
  dark: "#181817"
};

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
  document.documentElement.dataset.theme = theme;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The selected theme still applies when storage is unavailable.
  }

  updateThemeColor(theme);
}

export function updateThemeColor(theme = getEffectiveTheme()) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
}

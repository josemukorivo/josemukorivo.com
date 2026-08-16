import { THEME_COLORS, THEME_STORAGE_KEY } from "../../lib/theme";

const themeScript = `(() => {
  const root = document.documentElement;
  let storedTheme;

  try {
    storedTheme = window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
  } catch {}

  const hasStoredTheme = storedTheme === "light" || storedTheme === "dark" || storedTheme === "system";

  if (storedTheme === "light" || storedTheme === "dark") {
    root.dataset.theme = storedTheme;
  } else if (!hasStoredTheme) {
    root.dataset.theme = "light";
  }

  const effectiveTheme = storedTheme === "dark"
    ? "dark"
    : storedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  const colors = ${JSON.stringify(THEME_COLORS)};
  const updateThemeColor = () => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", colors[effectiveTheme]);
  };

  updateThemeColor();
  document.addEventListener("DOMContentLoaded", updateThemeColor, { once: true });
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}

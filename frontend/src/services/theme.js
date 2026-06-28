const THEME_KEY = "codesage-theme";
const VALID_THEMES = ["light", "dark", "system"];

function getSystemTheme() {
  if (typeof window === "undefined") return "dark";

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function resolveTheme(pref) {
  if (pref === "system") {
    return getSystemTheme();
  }

  return pref === "light" ? "light" : "dark";
}

export function getThemePref() {
  const saved = localStorage.getItem(THEME_KEY);

  if (VALID_THEMES.includes(saved)) {
    return saved;
  }

  return "dark";
}

export function applyThemePref(pref = getThemePref()) {
  const resolvedTheme = resolveTheme(pref);
  const root = document.documentElement;

  root.classList.toggle("light", resolvedTheme === "light");
  root.dataset.theme = resolvedTheme;
}

export function setThemePref(pref) {
  const nextPref = VALID_THEMES.includes(pref) ? pref : "dark";

  localStorage.setItem(THEME_KEY, nextPref);
  applyThemePref(nextPref);

  window.dispatchEvent(
    new CustomEvent("codesage-theme-change", {
      detail: { theme: nextPref },
    })
  );
}

export function initTheme() {
  applyThemePref(getThemePref());

  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

  const handleSystemThemeChange = () => {
    if (getThemePref() === "system") {
      applyThemePref("system");
    }
  };

  mediaQuery.addEventListener("change", handleSystemThemeChange);

  return () => {
    mediaQuery.removeEventListener("change", handleSystemThemeChange);
  };
}
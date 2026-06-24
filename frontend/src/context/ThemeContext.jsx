import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "codesage-theme";

const ThemeContext = createContext(null);

function readStoredPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {

  }
  return "system";
}

function resolveTheme(preference) {
  if (preference === "light" || preference === "dark") {
    return preference;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyDocumentTheme(resolvedTheme, preference) {
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.classList.toggle("light", preference === "light");
}

export function ThemeProvider({ children }) {
  const [themePreference, setThemePreferenceState] = useState(readStoredPreference);
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    resolveTheme(readStoredPreference()),
  );

  const setThemePreference = useCallback((preference) => {
    setThemePreferenceState(preference);
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch { 
    }
  }, []);

  useEffect(() => {
    const nextResolved = resolveTheme(themePreference);
    setResolvedTheme(nextResolved);
    applyDocumentTheme(nextResolved, themePreference);
  }, [themePreference]);

  useEffect(() => {
    if (themePreference !== "system") return undefined;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      const nextResolved = resolveTheme("system");
      setResolvedTheme(nextResolved);
      applyDocumentTheme(nextResolved, "system");
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [themePreference]);

  const value = useMemo(
    () => ({
      themePreference,
      resolvedTheme,
      setThemePreference,
      isDarkMode: resolvedTheme === "dark",
    }),
    [themePreference, resolvedTheme, setThemePreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

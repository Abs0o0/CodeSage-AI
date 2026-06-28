import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { THEME_CARDS } from "./constants";
import { getThemePref, setThemePref } from "../../services/theme";

export default function ThemeSection() {
  const [pref, setPref] = useState(getThemePref);

  const chooseTheme = (themeId) => {
    setPref(themeId);
    setThemePref(themeId);
  };

  useEffect(() => {
    const syncTheme = () => {
      setPref(getThemePref());
    };

    window.addEventListener("codesage-theme-change", syncTheme);
    window.addEventListener("storage", syncTheme);

    return () => {
      window.removeEventListener("codesage-theme-change", syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  return (
    <div className="set-panel">
      <h2 className="set-panel-title">Theme</h2>
      <p className="set-panel-sub">
        Choose how CodeSage looks. Your choice is saved automatically.
      </p>

      <div className="theme-grid">
        {THEME_CARDS.map((theme) => {
          const Icon = theme.icon;
          const isActive = pref === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              className={isActive ? "theme-card active" : "theme-card"}
              onClick={() => chooseTheme(theme.id)}
            >
              <span className="theme-ico">
                <Icon size={20} />
              </span>

              <span className="theme-label">{theme.label}</span>
              <span className="theme-desc">{theme.desc}</span>

              {isActive && (
                <span className="theme-check">
                  <Check size={16} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
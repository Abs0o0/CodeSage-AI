import { Typography } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { useTheme } from "../../context/ThemeContext";
import { ACCENT, THEME_CARD_OPTIONS } from "./constants";
import SectionPanel from "./SectionPanel";

const THEME_ICONS = {
  light: LightModeOutlinedIcon,
  dark: DarkModeOutlinedIcon,
  system: SettingsBrightnessOutlinedIcon,
};

export default function ThemeSection() {
  const { themePreference, setThemePreference } = useTheme();

  return (
    <SectionPanel
      title="Theme"
      description="Choose how CodeSage looks on your screen. Your preference is saved automatically."
    >
      <div
        role="radiogroup"
        aria-label="Theme preference"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {THEME_CARD_OPTIONS.map(({ id, label, description, preview }) => {
          const Icon = THEME_ICONS[id];
          const isSelected = themePreference === id;

          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setThemePreference(id)}
              className={`group flex flex-col rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                isSelected
                  ? "border-violet-500 bg-violet-50 shadow-md ring-2 ring-violet-200 dark:bg-violet-950/40 dark:ring-violet-800"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
              }`}
            >
              <div
                className={`mb-4 h-16 w-full rounded-lg border ${preview} transition-transform group-hover:scale-[1.02]`}
              />
              <Icon
                fontSize="small"
                sx={{ color: isSelected ? ACCENT : "#6b7280", mb: 0.5 }}
              />
              <Typography
                variant="body2"
                className={`font-semibold ${isSelected ? "text-violet-800 dark:text-violet-300" : "text-gray-800 dark:text-gray-200"}`}
              >
                {label}
              </Typography>
              <Typography variant="caption" className="mt-1 text-gray-500 dark:text-gray-400">
                {description}
              </Typography>
              {isSelected && (
                <CheckCircleOutlinedIcon
                  fontSize="small"
                  sx={{ color: ACCENT, mt: 1.5 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </SectionPanel>
  );
}

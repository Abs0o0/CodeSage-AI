import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ACCENT, SETTINGS_SECTIONS } from "./constants";

const SECTION_ICONS = {
  profile: PersonOutlinedIcon,
  ai: SmartToyOutlinedIcon,
  theme: PaletteOutlinedIcon,
  security: LockOutlinedIcon,
};

export default function SettingsNav({ activeSection, onSectionChange }) {
  return (
    <nav
      aria-label="Settings sections"
      className="flex flex-row gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-900 lg:flex-col lg:overflow-visible"
    >
      {SETTINGS_SECTIONS.map(({ id, label }) => {
        const Icon = SECTION_ICONS[id];
        const isActive = activeSection === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSectionChange(id)}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-w-[140px] items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 lg:min-w-0 ${
              isActive
                ? "bg-violet-50 text-violet-700 shadow-sm ring-1 ring-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-800"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            }`}
          >
            <Icon fontSize="small" sx={{ color: isActive ? ACCENT : "inherit" }} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

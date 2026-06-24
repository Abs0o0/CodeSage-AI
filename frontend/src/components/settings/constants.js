export const ACCENT = "#aa3bff";

export const SETTINGS_SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "ai", label: "AI Settings" },
  { id: "theme", label: "Theme" },
  { id: "security", label: "Security" },
];

export const AI_MODEL_OPTIONS = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "custom-fine-tuned", label: "Custom Fine-Tuned" },
];

export const STRICTNESS_MARKS = [
  { value: 0, label: "Lax" },
  { value: 50, label: "Balanced" },
  { value: 100, label: "Strict" },
];

export const THEME_CARD_OPTIONS = [
  {
    id: "light",
    label: "Light Mode",
    description: "Clean, bright interface for daytime work.",
    preview: "bg-white border-gray-200 dark:border-gray-600",
  },
  {
    id: "dark",
    label: "Dark Mode",
    description: "Reduced eye strain for late-night reviews.",
    preview: "bg-gray-900 border-gray-700",
  },
  {
    id: "system",
    label: "System Default",
    description: "Automatically match your OS preference.",
    preview: "bg-gradient-to-r from-white to-gray-900 border-gray-400",
  },
];

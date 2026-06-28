import { User, Bot, Palette, Lock, Sun, Moon, Monitor } from "lucide-react";

export const SETTINGS_SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "ai", label: "AI Settings", icon: Bot },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "security", label: "Security", icon: Lock },
];

export const AI_MODELS = [
  { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B (default)" },
  { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B (faster)" },
  { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B" },
];

export const THEME_CARDS = [
  {
    id: "light",
    label: "Light Mode",
    desc: "Clean, bright interface.",
    icon: Sun,
  },
  {
    id: "dark",
    label: "Dark Mode",
    desc: "Easy on the eyes at night.",
    icon: Moon,
  },
  {
    id: "system",
    label: "System Default",
    desc: "Match your OS setting.",
    icon: Monitor,
  },
];

export const ACCENT = "#a855f7";
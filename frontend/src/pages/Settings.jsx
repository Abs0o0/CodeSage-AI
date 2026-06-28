import { useState } from "react";

import SettingsNav from "../components/settings/SettingsNav";
import ProfileSection from "../components/settings/ProfileSection";
import AISettingsSection from "../components/settings/AISettingsSection";
import ThemeSection from "../components/settings/ThemeSection";
import SecuritySection from "../components/settings/SecuritySection";

import "../styles/pages/settings.css";

const PANELS = {
  profile: ProfileSection,
  ai: AISettingsSection,
  theme: ThemeSection,
  security: SecuritySection,
};

export default function Settings() {
  const [active, setActive] = useState("profile");
  const ActivePanel = PANELS[active];

  return (
    <div className="settings">
      <div className="page-head">
        <h1 className="page-title">Settings</h1>
        <p className="page-sub">
          Manage your account preferences and CodeSage experience.
        </p>
      </div>

      <div className="settings-layout">
        <SettingsNav active={active} onChange={setActive} />

        <main className="settings-main">
          <ActivePanel />
        </main>
      </div>
    </div>
  );
}
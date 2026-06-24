import { useState } from "react";
import { Button, Typography } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useAuth } from "../context/AuthContext";
import SettingsNav from "../components/settings/SettingsNav";
import ProfileSection from "../components/settings/ProfileSection";
import AISettingsSection from "../components/settings/AISettingsSection";
import ThemeSection from "../components/settings/ThemeSection";
import SecuritySection from "../components/settings/SecuritySection";
import UnauthenticatedGate from "../components/auth/UnauthenticatedGate";
import AuthModal from "../components/auth/AuthModal";
import { ACCENT } from "../components/settings/constants";

const SECTION_PANELS = {
  profile: ProfileSection,
  ai: AISettingsSection,
  theme: ThemeSection,
  security: SecuritySection,
};

export default function Settings() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <UnauthenticatedGate onSignIn={() => setAuthModalOpen(true)} />
        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  const ActivePanel = SECTION_PANELS[activeSection];

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-8 text-left dark:bg-gray-950 md:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Typography
              variant="h4"
              className="font-bold text-gray-900 dark:text-gray-100"
            >
              Settings
            </Typography>
            <Typography variant="body1" className="mt-1 text-gray-500 dark:text-gray-400">
              Manage your accountt preferences and CodeSage experience.
            </Typography>
            {user?.email && (
              <Typography variant="caption" className="mt-1 block text-gray-400">
                Signed in as {user.email}
              </Typography>
            )}
          </div>
          <Button
            variant="outlined"
            startIcon={<LogoutOutlinedIcon />}
            onClick={logout}
            sx={{
              borderColor: ACCENT,
              color: ACCENT,
              textTransform: "none",
              "&:hover": { borderColor: ACCENT, bgcolor: "rgba(170,59,255,0.06)" },
            }}
          >
            Sign Out
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <SettingsNav
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </aside>

          <main className="min-w-0">
            <ActivePanel />
          </main>
        </div>
      </div>
    </div>
  );
}

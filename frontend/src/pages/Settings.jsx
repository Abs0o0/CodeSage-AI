import { useState } from "react";
import { Avatar, Button, Typography } from "@mui/material";
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
        <UnauthenticatedGate
          onSignIn={() => setAuthModalOpen(true)}
        />

        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </>
    );
  }

  const ActivePanel = SECTION_PANELS[activeSection];

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-8 dark:bg-gray-950 md:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={user?.avatarUrl}
              // src="https://avatars.githubusercontent.com/u/9919?v=4"
              sx={{
                width: 72,
                height: 72,
                bgcolor: ACCENT,
                fontSize: "1.7rem",
                fontWeight: 700,
              }}
            >
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>

            <div>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                }}
              >
                Settings
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Manage your account preferences and CodeSage experience.
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontWeight: 600,
                }}
              >
                {user?.username || "User"}
              </Typography>

              {user?.email && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Signed in as {user.email}
                </Typography>
              )}
            </div>
          </div>

          <Button
            variant="outlined"
            startIcon={<LogoutOutlinedIcon />}
            onClick={logout}
            sx={{
              borderColor: ACCENT,
              color: ACCENT,
              textTransform: "none",
              px: 2.5,
              py: 1,
              "&:hover": {
                borderColor: ACCENT,
                bgcolor: "rgba(170,59,255,0.06)",
              },
            }}
          >
            Sign Out
          </Button>
        </header>

        {/* Content */}
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
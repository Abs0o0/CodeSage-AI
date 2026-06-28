import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Code2,
  Home,
  LayoutDashboard,
  GitPullRequest,
  History,
  Languages,
  Settings,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../ui/ConfirmDialog";

const NAV_ITEMS = [
  {
    section: "Main",
    links: [
      { to: "/", label: "Home", icon: Home, end: true },
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/analyze", label: "Code Review", icon: GitPullRequest },
    ],
  },
  {
    section: "Workspace",
    links: [
      { to: "/history", label: "History", icon: History },
      { to: "/languages", label: "Languages", icon: Languages },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const openLogoutDialog = () => {
    setIsLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setIsLogoutDialogOpen(false);
  };

  const confirmLogout = () => {
    logout();
    closeLogoutDialog();
    navigate("/", { replace: true });
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sb-logo">
          <span className="logo-mark">
            <Code2 size={16} />
          </span>

          <div>
            <span className="logo-text">CodeSage AI</span>
            <span className="logo-subtitle">Review Workspace</span>
          </div>
        </div>

        <nav className="sb-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((group) => (
            <div className="sb-group" key={group.section}>
              <span className="sb-group-title">{group.section}</span>

              {group.links.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      isActive ? "sb-link active" : "sb-link"
                    }
                  >
                    <span className="sb-ico">
                      <Icon size={18} />
                    </span>

                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <button type="button" className="sb-logout" onClick={openLogoutDialog}>
          <span className="sb-ico">
            <LogOut size={18} />
          </span>
          <span>Sign Out</span>
        </button>

        <div className="sb-plan">
          <div className="sb-plan-top">
            <div>
              <div className="sb-plan-label">Free Plan</div>
              <div className="sb-plan-text">Monthly usage</div>
            </div>

            <span className="sb-plan-badge">30%</span>
          </div>

          <div className="sb-plan-bar">
            <div className="sb-plan-fill" />
          </div>

          <div className="sb-plan-count">3 / 10 analyses used</div>
        </div>
      </aside>

      <ConfirmDialog
        open={isLogoutDialogOpen}
        title="Sign out?"
        message="You will be signed out of your CodeSage workspace and returned to the homepage."
        confirmText="Yes, sign out"
        cancelText="Stay signed in"
        danger
        onCancel={closeLogoutDialog}
        onConfirm={confirmLogout}
      />
    </>
  );
}
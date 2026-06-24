import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { useAuth } from "../../context/AuthContext";
import { hashPassword } from "../../utils/hashPassword";
import { ACCENT } from "./constants";
import PasswordField from "./PasswordField";
import SectionPanel from "./SectionPanel";

export default function SecuritySection() {
  const { logout } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [deactivationError, setDeactivationError] = useState("");

  const handlePasswordFieldChange = (field) => (event) => {
    setPasswordForm((previous) => ({ ...previous, [field]: event.target.value }));
    setValidationError("");
    setRequestError("");
    setPasswordUpdated(false);
  };

  const handleUpdatePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setValidationError("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setValidationError("New password must be at least 8 characters.");
      return;
    }

    setIsUpdatingPassword(true);
    setValidationError("");
    setRequestError("");

    try {
      const hashedNewPassword = await hashPassword(newPassword);

      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword: hashedNewPassword,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to update password.");
      }

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordUpdated(true);
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeactivateAccount = async () => {
    const confirmed = window.confirm(
      "This will permanently deactivate your CodeSage account. Continue?",
    );
    if (!confirmed) return;

    setIsDeactivating(true);
    setDeactivationError("");

    try {
      const response = await fetch("/api/users/deactivate", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to deactivate account.");
      }

      await logout();
    } catch (error) {
      setDeactivationError(error.message);
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <SectionPanel
      title="Security"
      description="Update your password and manage account access."
    >
      <div className="grid max-w-md grid-cols-1 gap-5">
        <PasswordField
          label="Current Password"
          value={passwordForm.currentPassword}
          onChange={handlePasswordFieldChange("currentPassword")}
        />
        <PasswordField
          label="New Password"
          value={passwordForm.newPassword}
          onChange={handlePasswordFieldChange("newPassword")}
        />
        <PasswordField
          label="Confirm New Password"
          value={passwordForm.confirmPassword}
          onChange={handlePasswordFieldChange("confirmPassword")}
        />
      </div>

      {validationError && (
        <Typography variant="body2" className="mt-3 text-red-600">
          {validationError}
        </Typography>
      )}
      {requestError && (
        <Typography variant="body2" className="mt-3 text-red-600">
          {requestError}
        </Typography>
      )}
      {passwordUpdated && (
        <Typography variant="body2" className="mt-3 text-emerald-600">
          Password updated successfully.
        </Typography>
      )}

      <Button
        variant="contained"
        disabled={isUpdatingPassword}
        onClick={handleUpdatePassword}
        startIcon={
          isUpdatingPassword ? <CircularProgress size={18} color="inherit" /> : null
        }
        className="mt-6"
        sx={{
          bgcolor: ACCENT,
          textTransform: "none",
          "&:hover": { bgcolor: "#9333ea" },
        }}
      >
        {isUpdatingPassword ? "Updating…" : "Update Password"}
      </Button>

      <Box
        className="mt-10 rounded-2xl border-2 border-red-300 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/30"
        role="region"
        aria-label="Danger zone"
      >
        <div className="flex items-start gap-3">
          <WarningAmberOutlinedIcon sx={{ color: "#dc2626", mt: 0.25 }} />
          <div className="flex-1">
            <Typography
              variant="subtitle1"
              className="font-semibold text-red-800 dark:text-red-300"
            >
              Deactivate Account
            </Typography>
            <Typography
              variant="body2"
              className="mt-1 text-red-700 dark:text-red-400"
            >
              Permanently disable your CodeSage account. This action cannot be
              undone and all review history will be archived.
            </Typography>
            {deactivationError && (
              <Typography variant="body2" className="mt-2 text-red-600">
                {deactivationError}
              </Typography>
            )}
            <Button
              variant="outlined"
              color="error"
              disabled={isDeactivating}
              onClick={handleDeactivateAccount}
              className="mt-4"
              sx={{ textTransform: "none" }}
            >
              {isDeactivating ? "Deactivating…" : "Deactivate Account"}
            </Button>
          </div>
        </div>
      </Box>
    </SectionPanel>
  );
}

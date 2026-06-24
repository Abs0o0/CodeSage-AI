import { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { ACCENT } from "../settings/constants";
import PasswordField from "../settings/PasswordField";

export default function AuthModal({ open, onClose }) {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "user",
});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const resetForms = () => {
    setLoginForm({ email: "", password: "" });
    setRegisterForm({ username: "", email: "", password: "", confirmPassword: "", role: "user" });
    setFormError("");
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      await login(loginForm.email, loginForm.password);
      handleClose();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (registerForm.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await register({
        email: registerForm.email,
        password: registerForm.password,
        username: registerForm.username,
        role: registerForm.role,
      });
      handleClose();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        className: "rounded-2xl dark:bg-gray-900",
      }}
    >
      <DialogTitle className="pb-2">
        <Typography variant="h5" className="font-bold text-gray-900 dark:text-gray-100">
          Welcome to CodeSage
        </Typography>
        <Typography variant="body2" className="mt-1 text-gray-500 dark:text-gray-400">
          Sign in or create an account to access your settings.
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Tabs
          value={activeTab}
          onChange={(_, value) => {
            setActiveTab(value);
            setFormError("");
          }}
          sx={{
            mb: 3,
            "& .MuiTab-root": { textTransform: "none" },
            "& .Mui-selected": { color: `${ACCENT} !important` },
            "& .MuiTabs-indicator": { bgcolor: ACCENT },
          }}
        >
          <Tab label="Sign In" value="login" />
          <Tab label="Create Account" value="register" />
        </Tabs>

        {formError && (
          <Alert severity="error" className="mb-4">
            {formError}
          </Alert>
        )}

        {activeTab === "login" ? (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <TextField
              label="Email Address"
              type="email"
              value={loginForm.email}
              onChange={(event) =>
                setLoginForm((previous) => ({
                  ...previous,
                  email: event.target.value,
                }))
              }
              required
              fullWidth
              size="small"
            />
            <PasswordField
              label="Password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((previous) => ({
                  ...previous,
                  password: event.target.value,
                }))
              }
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? <CircularProgress size={18} color="inherit" /> : null
              }
              sx={{
                mt: 1,
                bgcolor: ACCENT,
                textTransform: "none",
                py: 1.2,
                "&:hover": { bgcolor: "#9333ea" },
              }}
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
            <TextField
              label="Username"
              value={registerForm.username}
              onChange={(event) =>
                setRegisterForm((previous) => ({
                  ...previous,
                  username: event.target.value,
                }))
              }
              required
              fullWidth
              size="small"
            />
            <TextField
              label="Email Address"
              type="email"
              value={registerForm.email}
              onChange={(event) =>
                setRegisterForm((previous) => ({
                  ...previous,
                  email: event.target.value,
                }))
              }
              required
              fullWidth
              size="small"
            />
            <PasswordField
              label="Password"
              value={registerForm.password}
              onChange={(event) =>
                setRegisterForm((previous) => ({
                  ...previous,
                  password: event.target.value,
                }))
              }
            />
            <PasswordField
              label="Confirm Password"
              value={registerForm.confirmPassword}
              onChange={(event) =>
                setRegisterForm((previous) => ({
                  ...previous,
                  confirmPassword: event.target.value,
                }))
              }
            />
            {/* <TextField
              label="User Role"
              value={registerForm.role}
              onChange={(event) =>
                setRegisterForm((previous) => ({
                  ...previous,
                  role: event.target.value,
                }))
              }
            /> */}
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? <CircularProgress size={18} color="inherit" /> : null
              }
              sx={{
                mt: 1,
                bgcolor: ACCENT,
                textTransform: "none",
                py: 1.2,
                "&:hover": { bgcolor: "#9333ea" },
              }}
            >
              {isSubmitting ? "Creating account…" : "Create Account"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

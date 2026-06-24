import { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { ACCENT } from "./constants";
import SectionPanel from "./SectionPanel";

export default function ProfileSection() {
  const { user, setUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    role: "",
  });

  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSucceeded, setSaveSucceeded] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setIsFetching(true);
      setFetchError("");

      try {
        const { data } = await api.get("/users/me");

        if (cancelled) return;

        setProfileForm({
          username: data?.user?.username ?? user?.username ?? "",
          email: data?.user?.email ?? user?.email ?? "",
          role: data?.user?.role ?? user?.role ?? "",
        });
      } catch (error) {
        if (!cancelled) {
          setProfileForm({
            username: user?.username ?? "",
            email: user?.email ?? "",
            role: user?.role ?? "",
          });
          setFetchError(
            error?.response?.data?.message || error.message || "Unable to load profile."
          );
        }
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleFieldChange = (field) => (event) => {
    setProfileForm((previous) => ({ ...previous, [field]: event.target.value }));
    setSaveSucceeded(false);
    setSaveError("");
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveError("");
    setSaveSucceeded(false);

    try {
      const { data } = await api.patch("/users/me", {
        username: profileForm.username,
        email: profileForm.email,
      });

      setUser((previous) => ({ ...previous, ...data.user }));
      setProfileForm({
        username: data.user?.username ?? "",
        email: data.user?.email ?? "",
        role: data.user?.role ?? "",
      });
      setSaveSucceeded(true);
    } catch (error) {
      setSaveError(
        error?.response?.data?.message || error.message || "Failed to save profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return (
      <SectionPanel title="Profile" description="Manage your personal information.">
        <div className="flex justify-center py-12">
          <CircularProgress size={32} sx={{ color: ACCENT }} />
        </div>
      </SectionPanel>
    );
  }

  return (
    <SectionPanel
      title="Profile"
      description="Manage your personal information and account details."
    >
      {fetchError && (
        <Typography variant="body2" className="mb-4 text-amber-600">
          {fetchError}
        </Typography>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextField
          label="Username"
          value={profileForm.username}
          onChange={handleFieldChange("username")}
          fullWidth
          size="small"
        />
        <TextField
          label="Email Address"
          type="email"
          value={profileForm.email}
          onChange={handleFieldChange("email")}
          fullWidth
          size="small"
        />
        <TextField
          label="Role"
          value={profileForm.role}
          fullWidth
          size="small"
          disabled
          className="md:col-span-2 md:max-w-md"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button
          variant="contained"
          disabled={isSaving}
          onClick={handleSaveProfile}
          startIcon={
            isSaving ? (
              <CircularProgress size={18} color="inherit" />
            ) : saveSucceeded ? (
              <CheckCircleOutlinedIcon />
            ) : null
          }
          sx={{
            bgcolor: ACCENT,
            textTransform: "none",
            px: 3,
            py: 1,
            "&:hover": { bgcolor: "#9333ea" },
            "&.Mui-disabled": { bgcolor: ACCENT, opacity: 0.7, color: "#fff" },
          }}
        >
          {isSaving ? "Saving…" : saveSucceeded ? "Profile Saved" : "Save Profile"}
        </Button>

        {saveSucceeded && (
          <Typography variant="body2" className="text-emerald-600">
            Your changes have been saved successfully.
          </Typography>
        )}

        {saveError && (
          <Typography variant="body2" className="text-red-600">
            {saveError}
          </Typography>
        )}
      </div>
    </SectionPanel>
  );
}
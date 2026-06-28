import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Upload, User2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function ProfileSection() {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    fullName: "",
    jobTitle: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    setForm({
      username: user.username || "",
      email: user.email || "",
      fullName: user.fullName || "",
      jobTitle: user.jobTitle || "",
    });
  }, [user]);

  const update = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));

    setSaved(false);
    setError("");
  };

  const save = async () => {
    setIsSaving(true);
    setSaved(false);
    setError("");

    try {
      const { data } = await api.patch("/api/users/me", form);

      if (data?.user) {
        setUser(data.user);
        setSaved(true);
      } else {
        setError("Profile updated, but no user data was returned.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await api.post("/api/users/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data?.user) {
        setUser(data.user);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload avatar."
      );
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  const avatarSrc = user?.avatarUrl || "";

  return (
    <div className="set-panel">
      <div className="profile-avatar-wrap">
        <div className="profile-avatar-box">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={user?.username || "User avatar"}
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar placeholder">
              <User2 size={28} />
            </div>
          )}

          <button
            type="button"
            className="profile-avatar-upload"
            onClick={handleAvatarButtonClick}
            disabled={isUploadingAvatar}
          >
            {isUploadingAvatar ? (
              <Loader2 className="auth-spin" size={14} />
            ) : (
              <Upload size={14} />
            )}
            <span>{isUploadingAvatar ? "Uploading..." : "Change"}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleAvatarChange}
            className="profile-avatar-input"
          />
        </div>

        <div>
          <h2 className="set-panel-title">Profile</h2>
          <p className="set-panel-sub">
            Manage your personal information and account details.
          </p>
        </div>
      </div>

      <div className="set-field">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          className="set-input"
          value={form.username}
          onChange={update("username")}
          autoComplete="username"
        />
      </div>

      <div className="set-field">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          className="set-input"
          type="email"
          value={form.email}
          onChange={update("email")}
          autoComplete="email"
        />
      </div>

      <div className="set-field">
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          className="set-input"
          value={form.fullName}
          onChange={update("fullName")}
          autoComplete="name"
        />
      </div>

      <div className="set-field">
        <label htmlFor="jobTitle">Job Title</label>
        <input
          id="jobTitle"
          className="set-input"
          value={form.jobTitle}
          onChange={update("jobTitle")}
          autoComplete="organization-title"
        />
      </div>

      <div className="set-field">
        <label>Role</label>
        <input className="set-input" value={user?.role || "user"} readOnly />
      </div>

      {error ? <p className="set-error">{error}</p> : null}
      {saved ? <p className="set-success">Profile saved successfully.</p> : null}

      <div className="set-actions">
        <button
          className="btn btn-gradient"
          type="button"
          onClick={save}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="auth-spin" size={16} />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check size={16} />
              Profile Saved
            </>
          ) : (
            "Save Profile"
          )}
        </button>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Loader2 } from "lucide-react";
import api from "../../services/api";

export default function SecuritySection() {
  const [form, setForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const update = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    setError("");
    setDone(false);
  };

  const submit = async () => {
    if (!form.current || !form.next || !form.confirm) {
      setError("All password fields are required.");
      return;
    }

    if (form.next !== form.confirm) {
      setError("New passwords do not match.");
      return;
    }

    if (form.next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setIsSaving(true);
    setError("");
    setDone(false);

    try {
      await api.patch("/api/users/me/password", {
        currentPassword: form.current,
        newPassword: form.next,
      });

      setForm({
        current: "",
        next: "",
        confirm: "",
      });

      setDone(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update password."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deactivate = async () => {
    const confirm = window.confirm(
      "Deactivate your account? This will sign you out and disable the account."
    );

    if (!confirm) return;

    setIsDeactivating(true);
    setError("");
    setDone(false);

    try {
      await api.patch("/api/users/me/deactivate");
      window.location.href = "/";
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to deactivate account."
      );
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="set-panel">
      <h2 className="set-panel-title">Security</h2>
      <p className="set-panel-sub">
        Update your password and manage account access.
      </p>

      <div className="set-field">
        <label htmlFor="current-password">Current Password</label>
        <input
          id="current-password"
          className="set-input"
          type="password"
          value={form.current}
          onChange={update("current")}
        />
      </div>

      <div className="set-field">
        <label htmlFor="new-password">New Password</label>
        <input
          id="new-password"
          className="set-input"
          type="password"
          value={form.next}
          onChange={update("next")}
        />
      </div>

      <div className="set-field">
        <label htmlFor="confirm-password">Confirm New Password</label>
        <input
          id="confirm-password"
          className="set-input"
          type="password"
          value={form.confirm}
          onChange={update("confirm")}
        />
      </div>

      {error && <p className="set-error">{error}</p>}
      {done && <p className="set-success">Password updated successfully.</p>}

      <div className="set-actions">
        <button
          className="btn btn-gradient"
          type="button"
          onClick={submit}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="auth-spin" size={16} />
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </div>

      <div className="set-danger">
        <div className="set-danger-title">Deactivate Account</div>
        <p className="set-danger-text">
          Permanently disable your CodeSage account. This action cannot be undone.
        </p>

        <button
          className="btn-danger"
          type="button"
          onClick={deactivate}
          disabled={isDeactivating}
        >
          {isDeactivating ? "Deactivating..." : "Deactivate Account"}
        </button>
      </div>
    </div>
  );
}
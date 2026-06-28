import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, UserPlus } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/auth/AuthCard";
import PasswordField from "../components/auth/PasswordField";

import "../styles/pages/auth.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));

    setFormError("");
  };

  const validateForm = () => {
    if (!form.username.trim()) return "Username is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setFormError(
        error.response?.data?.message || error.message || "Could not create account."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start reviewing, improving, and documenting your code with AI."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {formError && <div className="auth-error">{formError}</div>}

        <div className="auth-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={form.username}
            onChange={updateField("username")}
            placeholder="Ahmed"
            autoComplete="username"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="register-email">Email Address</label>
          <input
            id="register-email"
            type="email"
            value={form.email}
            onChange={updateField("email")}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <PasswordField
          id="register-password"
          name="password"
          label="Password"
          value={form.password}
          onChange={updateField("password")}
          autoComplete="new-password"
        />

        <PasswordField
          id="confirm-password"
          name="confirmPassword"
          label="Confirm Password"
          value={form.confirmPassword}
          onChange={updateField("confirmPassword")}
          placeholder="Confirm your password"
          autoComplete="new-password"
        />

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="auth-spin" size={18} />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Create Account
            </>
          )}
        </button>
      </form>
    </AuthCard>
  );
}
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/auth/AuthCard";
import PasswordField from "../components/auth/PasswordField";

import "../styles/pages/auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      setFormError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await login(form.email.trim(), form.password);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(error.response?.data?.message || error.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue to your CodeSage workspace."
      footer={
        <>
          Do not have an account? <Link to="/register">Create account</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {formError && <div className="auth-error">{formError}</div>}

        <div className="auth-field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={updateField("email")}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <PasswordField
          id="password"
          name="password"
          label="Password"
          value={form.password}
          onChange={updateField("password")}
          autoComplete="current-password"
        />

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="auth-spin" size={18} />
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={18} />
              Sign In
            </>
          )}
        </button>
      </form>
    </AuthCard>
  );
}
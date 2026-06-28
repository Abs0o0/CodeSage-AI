import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { features as fallbackFeatures } from "../data/mockData";
import { getFeatures } from "../services/dataApi";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ui/ConfirmDialog";

import "../styles/pages/home.css";

const SAMPLE_CODE = [
  "const analyzeCode = async (code: string) => {",
  "  const result = await ai.review(code);",
  "  return { score: result.score, issues: result.issues };",
  "}",
].join("\n");

export default function Home() {
  const [features, setFeatures] = useState(fallbackFeatures);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function loadFeatures() {
      const data = await getFeatures(fallbackFeatures);

      if (isMounted) {
        setFeatures(data || fallbackFeatures);
      }
    }

    loadFeatures();

    return () => {
      isMounted = false;
    };
  }, []);

  const openLogoutDialog = () => {
    setIsLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setIsLogoutDialogOpen(false);
  };

  const confirmLogout = () => {
    logout();
    closeLogoutDialog();
  };

  return (
    <div className="home">
      <nav className="home-nav">
        <div className="home-logo">
          <span className="logo-mark">&lt;/&gt;</span>
          <span className="logo-text">CodeSage AI</span>
        </div>

        <div className="home-nav-right">
          {isAuthenticated ? (
            <>
              <Link className="home-login" to="/dashboard">
                Dashboard
              </Link>

              <button
                className="btn btn-ghost"
                type="button"
                onClick={openLogoutDialog}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link className="home-login" to="/login">
                Log in
              </Link>

              <Link className="btn btn-primary" to="/register">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      <header className="hero">
        <span className="pill">✨ Powered by advanced AI models</span>

        <h1 className="hero-title">
          AI-Powered Code Review
          <span className="hero-title-accent">in Seconds</span>
        </h1>

        <p className="hero-sub">
          Analyze, improve, and document your code instantly using AI. Built for
          developers who ship fast and build right.
        </p>

        <div className="hero-actions">
          <Link
            className="btn btn-gradient"
            to={isAuthenticated ? "/dashboard" : "/register"}
          >
            Get Started →
          </Link>

          <Link
            className="btn btn-ghost"
            to={isAuthenticated ? "/analyze" : "/login"}
          >
            Try Demo
          </Link>
        </div>

        <div className="code-window">
          <div className="code-bar">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <span className="code-file">code-review.ts</span>
          </div>

          <pre className="code-body">{SAMPLE_CODE}</pre>
        </div>
      </header>

      <section className="features">
        {features.map((feature) => (
          <article key={feature.title} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-text">{feature.text}</p>
          </article>
        ))}
      </section>

      <footer className="home-footer">
        © 2026 CodeSage AI. Built for developers.
      </footer>

      <ConfirmDialog
        open={isLogoutDialogOpen}
        title="Sign out?"
        message="You will be signed out of your CodeSage account. Any unsaved local changes may be lost."
        confirmText="Yes, sign out"
        cancelText="Cancel"
        danger
        onCancel={closeLogoutDialog}
        onConfirm={confirmLogout}
      />
    </div>
  );
}
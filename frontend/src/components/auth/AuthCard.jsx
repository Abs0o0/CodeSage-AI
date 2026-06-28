import { Code2 } from "lucide-react";

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">
            <Code2 size={20} />
          </span>

          <div>
            <span className="auth-brand-title">CodeSage AI</span>
            <span className="auth-brand-subtitle">AI Code Review Workspace</span>
          </div>
        </div>

        <div className="auth-head">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {children}

        {footer && <div className="auth-footer">{footer}</div>}
      </section>
    </main>
  );
}
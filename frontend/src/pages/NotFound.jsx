import { Link } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import "../styles/pages/notFound.css";

export default function NotFound() {
  return (
    <main className="notfound-page">
      <div className="notfound-card">
        <div className="notfound-icon">
          <SearchX size={42} />
        </div>

        <span className="notfound-code">404</span>
        <h1 className="notfound-title">Page not found</h1>
        <p className="notfound-text">
          The page you are looking for does not exist, was moved, or the link is incorrect.
        </p>

        <div className="notfound-actions">
          <Link to="/" className="btn btn-ghost notfound-btn">
            <ArrowLeft size={16} />
            Go back
          </Link>

          <Link to="/dashboard" className="btn btn-gradient notfound-btn">
            <Home size={16} />
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
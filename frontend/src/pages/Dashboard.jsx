import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Code2,
  FileCode2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { dashboard as fallbackDashboard } from "../data/mockData";
import { getDashboard } from "../services/dataApi";

import "../styles/pages/dashboard.css";

function getScoreClass(score) {
  if (score >= 90) return "score high";
  if (score >= 75) return "score mid";
  return "score low";
}

function getProfileName() {
  try {
    const profile = JSON.parse(localStorage.getItem("codesage-profile") || "{}");
    return profile.username || "";
  } catch {
    return "";
  }
}

function getStatIcon(label = "") {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("success")) {
    return <CheckCircle2 size={20} />;
  }

  if (normalizedLabel.includes("review") || normalizedLabel.includes("total")) {
    return <BarChart3 size={20} />;
  }

  if (normalizedLabel.includes("analysis") || normalizedLabel.includes("analyses")) {
    return <Code2 size={20} />;
  }

  return <Activity size={20} />;
}

export default function Dashboard() {
  const [data, setData] = useState(fallbackDashboard);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const dashboardData = await getDashboard(fallbackDashboard);

        if (isMounted) {
          setData(dashboardData || fallbackDashboard);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = data?.stats || [];
  const activity = data?.activity || [];

  const name = useMemo(() => {
    const profileName = getProfileName();
    return profileName || data?.user?.name || "Developer";
  }, [data]);

  const averageScore = useMemo(() => {
    if (!activity.length) return 0;

    const total = activity.reduce((sum, item) => sum + Number(item.score || 0), 0);
    return Math.round(total / activity.length);
  }, [activity]);

  const highScoreReviews = activity.filter((item) => Number(item.score) >= 90).length;

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div>
          <div className="dashboard-eyebrow">
            <Sparkles size={16} />
            AI Code Review Workspace
          </div>

          <h1 className="page-title">Welcome back, {name}</h1>

          <p className="page-sub">
            Track your code reviews, monitor quality scores, and start a new AI analysis.
          </p>
        </div>

        <Link className="btn btn-gradient analyze-cta" to="/analyze">
          <Code2 size={18} />
          Analyze Code
          <ArrowRight size={17} />
        </Link>
      </section>

      <section className="dashboard-summary">
        <article className="summary-card primary">
          <div className="summary-icon">
            <TrendingUp size={22} />
          </div>

          <div>
            <span className="summary-label">Average Score</span>
            <strong className="summary-value">{averageScore}/100</strong>
          </div>
        </article>

        <article className="summary-card">
          <div className="summary-icon">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <span className="summary-label">High Score Reviews</span>
            <strong className="summary-value">{highScoreReviews}</strong>
          </div>
        </article>

        <article className="summary-card">
          <div className="summary-icon">
            <Clock3 size={22} />
          </div>

          <div>
            <span className="summary-label">Recent Files</span>
            <strong className="summary-value">{activity.length}</strong>
          </div>
        </article>
      </section>

      <section className="stats">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <div className="stat-top">
              <span className="stat-ico">{getStatIcon(stat.label)}</span>
              {stat.delta && <span className="stat-delta">{stat.delta}</span>}
            </div>

            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </article>
        ))}
      </section>

      <section className="activity">
        <div className="section-head">
          <div>
            <h2 className="section-h">Recent Activity</h2>
            <p className="section-sub">Latest files reviewed by CodeSage AI.</p>
          </div>

          <Link className="section-link" to="/history">
            View all
            <ArrowRight size={15} />
          </Link>
        </div>

        {isLoading ? (
          <div className="dashboard-state">Loading dashboard data...</div>
        ) : activity.length > 0 ? (
          <div className="activity-list">
            {activity.map((item, index) => (
              <article key={item.id || item.file || index} className="activity-row">
                <div className="activity-left">
                  <span className="file-ico">
                    <FileCode2 size={18} />
                  </span>

                  <div>
                    <div className="activity-file">{item.file}</div>
                    <div className="activity-lang">{item.lang}</div>
                  </div>
                </div>

                <div className="activity-right">
                  <span className={getScoreClass(Number(item.score || 0))}>
                    {item.score}/100
                  </span>

                  <span className="activity-time">
                    <Clock3 size={14} />
                    {item.time}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="dashboard-state">
            No code reviews yet. Start your first analysis now.
          </div>
        )}
      </section>
    </div>
  );
}
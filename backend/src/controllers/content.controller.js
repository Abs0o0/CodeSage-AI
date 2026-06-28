import Review from "../models/Review.model.js";

const FEATURES = [
  { icon: "</>", title: "Code Review", text: "AI analyzes your code for bugs, performance issues, and anti-patterns." },
  { icon: "📄", title: "Documentation", text: "Auto-generate clean, comprehensive docs from your codebase." },
  { icon: "🧪", title: "Unit Tests", text: "Generate thorough unit tests with edge case coverage." },
  { icon: "🛡️", title: "Best Practices", text: "Validate code against industry standards and conventions." },
];

const LANGUAGES = [
  { name: "JavaScript", level: "Full", text: "Full ES2024 support with JSX/TSX analysis" },
  { name: "TypeScript", level: "Full", text: "Complete type-aware analysis and inference" },
  { name: "Python", level: "Full", text: "PEP 8 compliance, type hints, async patterns" },
  { name: "Java", level: "Full", text: "Spring Boot, design patterns, OOP analysis" },
  { name: "C++", level: "Partial", text: "Modern C++20 standards and memory safety" },
  { name: "Go", level: "Full", text: "Idiomatic Go patterns and goroutine analysis" },
  { name: "Rust", level: "Partial", text: "Ownership, lifetimes, and safety patterns" },
  { name: "C#", level: "Beta", text: ".NET patterns, LINQ, and async analysis" },
];

function isToday(date) {
  const d = new Date(date);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

function relativeTime(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.round(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export const getFeatures = (req, res) => {
  res.json(FEATURES);
};

export const getLanguages = (req, res) => {
  res.json(LANGUAGES);
};

export const getDashboard = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);

    const total = reviews.length;
    const today = reviews.filter((r) => isToday(r.createdAt)).length;
    const scores = reviews.filter((r) => typeof r.score === "number");
    const avg = scores.length
      ? Math.round(scores.reduce((sum, r) => sum + r.score, 0) / scores.length)
      : 0;

    res.json({
      user: { name: req.user.username },
      stats: [
        { icon: "</>", value: String(today), label: "Analyses Today", delta: today ? `+${today}` : "0" },
        { icon: "◫", value: String(total), label: "Total Reviews", delta: `+${total}` },
        { icon: "✓", value: `${avg}%`, label: "Avg Score", delta: avg >= 75 ? "Good" : "Improving" },
      ],
      activity: reviews.slice(0, 5).map((r) => ({
        file: r.file || `snippet-${r._id}.txt`,
        lang: r.language,
        score: r.score,
        time: relativeTime(r.createdAt),
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);

    res.json(
      reviews.map((r) => ({
        id: r._id.toString(),
        file: r.file || `snippet-${r._id}.txt`,
        lang: r.language,
        score: r.score,
        snippet: r.snippet || r.code?.slice(0, 200) || "",
        time: relativeTime(r.createdAt),
        at: r.createdAt?.toISOString?.() || null,
      }))
    );
  } catch (error) {
    next(error);
  }
};
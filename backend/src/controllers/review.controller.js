import Review from "../models/Review.model.js";
import { fixCode, reviewCode } from "../services/ai.service.js";

function getUserId(req) {
  return req.user?._id || req.user?.id;
}

function getLanguageExtension(language = "") {
  const normalized = String(language).toLowerCase();

  if (normalized.includes("typescript")) return "ts";
  if (normalized.includes("javascript")) return "js";
  if (normalized.includes("python")) return "py";
  if (normalized.includes("java")) return "java";
  if (normalized.includes("c++")) return "cpp";
  if (normalized.includes("c#")) return "cs";
  if (normalized.includes("go")) return "go";
  if (normalized.includes("rust")) return "rs";
  if (normalized.includes("php")) return "php";
  if (normalized.includes("ruby")) return "rb";
  if (normalized.includes("sql")) return "sql";

  return "txt";
}

function buildFileName(language = "Unknown") {
  const ext = getLanguageExtension(language);
  return `snippet-${Date.now()}.${ext}`;
}

function buildSnippet(code = "") {
  const lines = String(code)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 0) {
    return lines[0].slice(0, 200);
  }

  return String(code).slice(0, 200);
}

function toHistoryItem(review) {
  const createdAt = review.createdAt ? new Date(review.createdAt) : null;

  return {
    id: review._id.toString(),
    file: review.file,
    lang: review.language,
    score: review.score,
    snippet: review.snippet,
    time: createdAt ? createdAt.toISOString() : null,
    at: createdAt ? createdAt.toISOString() : null,
  };
}

export const analyzeCode = async (req, res, next) => {
  try {
    const { code, language, file } = req.body;

    if (!code || !String(code).trim()) {
      return res.status(400).json({
        success: false,
        message: "Code is required",
      });
    }

    const reviewResult = await reviewCode(String(code), language || "Unknown");

    const safeIssues = Array.isArray(reviewResult.issues)
      ? reviewResult.issues.map((issue) => ({
          severity: ["low", "medium", "high"].includes(issue.severity)
            ? issue.severity
            : "low",
          line:
            typeof issue.line === "number" && Number.isFinite(issue.line)
              ? issue.line
              : 0,
          title: String(issue.title || "").trim(),
          description: String(issue.description || "").trim(),
        }))
      : [];

    const safeRefactoring = Array.isArray(reviewResult.refactoring)
      ? reviewResult.refactoring.map((item) => String(item).trim()).filter(Boolean)
      : [];

    const safeDocs = Array.isArray(reviewResult.docs)
      ? reviewResult.docs.map((doc) => ({
          method: String(doc.method || "INFO").trim(),
          path: String(doc.path || "-").trim(),
          description: String(doc.description || "").trim(),
        }))
      : [];

    const review = await Review.create({
      user: getUserId(req),
      file: String(file || buildFileName(language)).trim(),
      language: String(language || "Unknown").trim(),
      provider: "groq",
      aiModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      code: String(code),
      snippet: buildSnippet(code),
      score:
        typeof reviewResult.score === "number" &&
        Number.isFinite(reviewResult.score)
          ? Math.max(0, Math.min(100, reviewResult.score))
          : 0,
      overview: {
        title: String(reviewResult.overview?.title || "").trim(),
        subtitle: String(reviewResult.overview?.subtitle || "").trim(),
      },
      stats: {
        lines:
          typeof reviewResult.stats?.lines === "number"
            ? reviewResult.stats.lines
            : String(code).split("\n").length,
        issues: safeIssues.length,
      },
      issues: safeIssues,
      refactoring: safeRefactoring,
      docs: safeDocs.length
        ? safeDocs
        : [
            {
              method: "INFO",
              path: "-",
              description: "No endpoints detected.",
            },
          ],
    });

    return res.status(200).json({
      success: true,
      review: {
        id: review._id.toString(),
        file: review.file,
        language: review.language,
        score: review.score,
        overview: review.overview,
        stats: review.stats,
        issues: review.issues,
        refactoring: review.refactoring,
        docs: review.docs,
        snippet: review.snippet,
        createdAt: review.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const applyFix = async (req, res, next) => {
  try {
    const { code, language } = req.body;

    if (!code || !String(code).trim()) {
      return res.status(400).json({
        success: false,
        message: "Code is required",
      });
    }

    const fixedCode = await fixCode(String(code), language || "Unknown");

    return res.status(200).json({
      success: true,
      code: fixedCode,
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: getUserId(req) })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("file language score snippet createdAt");

    return res.status(200).json(
      reviews.map((review) => toHistoryItem(review))
    );
  } catch (error) {
    next(error);
  }
};
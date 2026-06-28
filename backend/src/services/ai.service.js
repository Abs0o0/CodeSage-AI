import crypto from "crypto";

function clampScore(score) {
  if (score < 0) return 0;
  if (score > 100) return 100;
  return score;
}

function countLines(code) {
  if (!code) return 0;
  return code.split("\n").length;
}

function generateHeuristicReview(code, language) {
  const lines = countLines(code);
  const lowered = code.toLowerCase();

  const issues = [];

  if (!lowered.includes("try") && !lowered.includes("catch")) {
    issues.push({
      severity: "high",
      title: "Missing error handling",
      description:
        "No try/catch structure was detected around async or risky operations.",
    });
  }

  if (
    lowered.includes("req.body") &&
    !lowered.includes("validate") &&
    !lowered.includes("schema")
  ) {
    issues.push({
      severity: "medium",
      title: "Missing input validation",
      description:
        "Request input appears to be used without a clear validation step.",
    });
  }

  if (!lowered.includes("process.env") && lowered.includes("port")) {
    issues.push({
      severity: "low",
      title: "Hardcoded configuration",
      description:
        "Configuration values appear to be hardcoded instead of using environment variables.",
    });
  }

  const refactoring = [
    "Extract repeated logic into smaller functions.",
    "Add explicit input validation and better error handling.",
    "Move configuration values to environment variables where applicable.",
  ];

  const docs = [
    {
      method: "GET",
      path: "/api/example",
      description: `Example endpoint generated for ${language}.`,
    },
  ];

  const baseScore = 92 - issues.length * 8 - Math.max(0, Math.min(20, lines / 10));
  const score = clampScore(Math.round(baseScore));

  return {
    score,
    overview: {
      title:
        issues.length === 0
          ? "Code looks solid"
          : "Good structure with improvement opportunities",
      subtitle:
        issues.length === 0
          ? "The code is readable and has no obvious red flags."
          : "The code is workable, but there are some issues worth fixing.",
    },
    stats: {
      lines,
      issues: issues.length,
    },
    issues,
    refactoring,
    docs,
  };
}

export { reviewCode, fixCode } from "./ai/review.service.js";
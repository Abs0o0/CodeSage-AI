import { REVIEW_AGENTS } from "./reviewAgents.js";
import { groqJson } from "./groqClient.js";

function clampScore(value) {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

function normalizeReview(parts, code) {
  const merged = {
    score: 0,
    overview: {
      title: "Review",
      subtitle: "",
    },
    issues: [],
    refactoring: [],
    docs: [],
  };

  for (const part of parts) {
    if (typeof part?.score === "number") {
      merged.score = part.score;
    }

    if (part?.overview) {
      merged.overview = part.overview;
    }

    if (Array.isArray(part?.issues)) {
      merged.issues.push(...part.issues);
    }

    if (Array.isArray(part?.refactoring)) {
      merged.refactoring.push(...part.refactoring);
    }

    if (Array.isArray(part?.docs)) {
      merged.docs.push(...part.docs);
    }
  }

  merged.score = clampScore(Math.round(merged.score));

  if (!merged.docs.length) {
    merged.docs = [
      {
        method: "INFO",
        path: "-",
        description: "No endpoints detected.",
      },
    ];
  }

  return {
    ...merged,
    stats: {
      lines: code.split("\n").length,
      issues: merged.issues.length,
    },
  };
}

export async function reviewCode(code, language) {
  const prompt = `Language: ${language || "unknown"}.

Review this code:

${code}`;

  const results = await Promise.all(
    REVIEW_AGENTS.map(async (agent) => {
      const parsed = await groqJson({
        system: agent.system,
        user: prompt,
        temperature: 0.2,
      });

      return parsed;
    })
  );

  return normalizeReview(results, code);
}

export async function fixCode(code, language) {
  const system = `You are an expert ${language || "code"} developer.
Fix bugs, security issues, and bad practices in the user's code WITHOUT changing what it does.
Keep the same language.
Return ONLY JSON like: { "code": "the full corrected code as one string" }`;

  const parsed = await groqJson({
    system,
    user: code,
    temperature: 0.1,
  });

  return typeof parsed.code === "string" ? parsed.code : code;
}
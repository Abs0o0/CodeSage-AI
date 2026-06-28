import { useState } from "react";

import EditorPanel from "../components/analyze/EditorPanel";
import AnalysisPanel from "../components/analyze/AnalysisPanel";

import { aiReview, aiFixCode } from "../services/aiReview";

import "../styles/pages/analyze.css";

const DEFAULT_CODE = `// Paste your code here to get AI-powered insights
import express from 'express';

const app = express();

app.get('/api/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;

  const result = await db.query(
    'INSERT INTO users (name, email) VALUES ($1, $2)',
    [name, email]
  );

  res.json(result);
});

app.listen(3000);
`;

export default function Analyze() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("JavaScript");

  const [analysisState, setAnalysisState] = useState({
    status: "idle",
    result: null,
    error: null,
  });

  const [fixState, setFixState] = useState({
    status: "idle",
    error: null,
  });

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setAnalysisState({
        status: "error",
        result: null,
        error: "Please paste code before running the analysis.",
      });
      return;
    }

    setAnalysisState({
      status: "loading",
      result: null,
      error: null,
    });

    setFixState({
      status: "idle",
      error: null,
    });

    try {
      const result = await aiReview(code, language);

      setAnalysisState({
        status: "done",
        result,
        error: null,
      });
    } catch (error) {
      setAnalysisState({
        status: "error",
        result: null,
        error: error.message || "AI review failed.",
      });
    }
  };

  const handleApplyFix = async () => {
    setFixState({
      status: "loading",
      error: null,
    });

    try {
      const fixedCode = await aiFixCode(code, language);

      setCode(fixedCode);

      setFixState({
        status: "done",
        error: null,
      });
    } catch (error) {
      setFixState({
        status: "error",
        error: error.message || "Could not fix the code.",
      });
    }
  };

  return (
    <div className="analyze-page">
      <div className="page-head">
        <h1 className="page-title">Code Review</h1>
        <p className="page-sub">
          Paste your code, choose the language, and let CodeSage analyze it.
        </p>
      </div>

      <div className="cr-main">
        <section className="crEditor">
          <EditorPanel
            code={code}
            onChange={setCode}
            onAnalyze={handleAnalyze}
            analyzing={analysisState.status === "loading"}
            language={language}
            onLanguageChange={setLanguage}
          />
        </section>

        <aside className="crAnalysis">
          <AnalysisPanel
            analysisState={analysisState}
            onApplyFix={handleApplyFix}
            fixState={fixState}
          />
        </aside>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Clock3, FileCode2 } from "lucide-react";

import { history as fallbackHistory } from "../data/mockData";
import { getHistory } from "../services/dataApi";

import "../styles/pages/history.css";

function getScoreClass(score) {
  if (score >= 90) return "score high";
  if (score >= 75) return "score mid";
  return "score low";
}

export default function History() {
  const [history, setHistory] = useState(fallbackHistory);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      try {
        const data = await getHistory(fallbackHistory);

        if (isMounted) {
          setHistory(data || fallbackHistory);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="history-page">
      <div className="page-head">
        <h1 className="page-title">History</h1>
        <p className="page-sub">Your previous code analyses.</p>
      </div>

      {isLoading ? (
        <div className="history-state">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="history-state">
          No analyses yet. Run a review from the Code Review tab.
        </div>
      ) : (
        <div className="hist-list">
          {history.map((item, index) => (
            <article
              key={item.id || `${item.file}-${index}`}
              className="hist-card"
            >
              <div className="hist-top">
                <div className="hist-left">
                  <span className="file-ico">
                    <FileCode2 size={18} />
                  </span>

                  <div>
                    <div className="hist-file">{item.file}</div>
                    <div className="hist-lang">{item.lang}</div>
                  </div>
                </div>

                <div className="hist-right">
                  <span className={getScoreClass(Number(item.score || 0))}>
                    {item.score}/100
                  </span>

                  <span className="hist-time">
                    <Clock3 size={14} />
                    {item.time}
                  </span>
                </div>
              </div>

              <pre className="hist-snippet">{item.snippet}</pre>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
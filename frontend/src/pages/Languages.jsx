import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";

import { languages as fallbackLanguages } from "../data/mockData";
import { getLanguages } from "../services/dataApi";

import "../styles/pages/languages.css";

function getBadgeClass(level = "") {
  const normalizedLevel = level.toLowerCase();

  if (normalizedLevel === "full") return "badge full";
  if (normalizedLevel === "partial") return "badge partial";

  return "badge beta";
}

export default function Languages() {
  const [languages, setLanguages] = useState(fallbackLanguages);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadLanguages() {
      try {
        const data = await getLanguages(fallbackLanguages);

        if (isMounted) {
          setLanguages(data || fallbackLanguages);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLanguages();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="languages-page">
      <div className="page-head">
        <h1 className="page-title">Supported Languages</h1>
        <p className="page-sub">
          Languages and frameworks supported by CodeSage AI.
        </p>
      </div>

      {isLoading ? (
        <div className="languages-state">Loading languages...</div>
      ) : languages.length === 0 ? (
        <div className="languages-state">No languages available.</div>
      ) : (
        <div className="lang-grid">
          {languages.map((item) => (
            <article key={item.name} className="lang-card">
              <div className="lang-top">
                <span className="lang-icon">
                  <Code2 size={18} />
                </span>

                <span className={getBadgeClass(item.level)}>
                  {item.level}
                </span>
              </div>

              <h3 className="lang-name">{item.name}</h3>
              <p className="lang-text">{item.text}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
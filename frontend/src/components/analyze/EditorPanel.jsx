import Editor from "@monaco-editor/react";
import { Code2, Sparkles, Loader2 } from "lucide-react";

import "../../styles/components/editor-panel.css";

const LANGUAGES = [
  { label: "JavaScript", monaco: "javascript" },
  { label: "TypeScript", monaco: "typescript" },
  { label: "Python", monaco: "python" },
  { label: "Java", monaco: "java" },
  { label: "C++", monaco: "cpp" },
  { label: "C#", monaco: "csharp" },
  { label: "Go", monaco: "go" },
  { label: "PHP", monaco: "php" },
  { label: "Ruby", monaco: "ruby" },
  { label: "SQL", monaco: "sql" },
];

export default function EditorPanel({
  code,
  onChange,
  onAnalyze,
  analyzing,
  language,
  onLanguageChange,
}) {
  const currentLanguage =
    LANGUAGES.find((item) => item.label === language) || LANGUAGES[0];

  return (
    <div className="epWrap">
      <div className="epTopBar">
        <div className="epTitle">
          <span className="epTitleIcon">
            <Code2 size={18} />
          </span>

          <span className="epTitleText">Editor</span>
        </div>

        <div className="epActions">
          <select
            className="epLangSelect"
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
            disabled={analyzing}
            aria-label="Language"
          >
            {LANGUAGES.map((item) => (
              <option key={item.label} value={item.label}>
                {item.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="epAnalyzeBtn"
            onClick={onAnalyze}
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <Loader2 className="epSpin" size={18} />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Analyze Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="epEditorArea">
        <Editor
          height="100%"
          language={currentLanguage.monaco}
          theme="vs-dark"
          value={code}
          onChange={(value) => onChange(value ?? "")}
          loading={<div className="epLoading">Loading editor...</div>}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            wordWrap: "on",
            automaticLayout: true,
            padding: { top: 14, bottom: 14 },
            renderLineHighlight: "all",
            overviewRulerBorder: false,
          }}
        />
      </div>
    </div>
  );
}
import { useState } from "react";
import {
  FileText,
  ShieldAlert,
  Wand2,
  BookOpen,
  ChevronRight,
  Code,
} from "lucide-react";

import "../../styles/components/analysis-panel.css";

const TABS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "issues", label: "Issues", icon: ShieldAlert },
  { id: "refactoring", label: "Refactoring", icon: Wand2 },
  { id: "documentation", label: "Documentation", icon: BookOpen },
];

function getSeverityClass(severity) {
  if (severity === "high") return "apSevHigh";
  if (severity === "medium") return "apSevMedium";
  return "apSevLow";
}

export default function AnalysisPanel({ analysisState, onApplyFix, fixState }) {
  const [tab, setTab] = useState("overview");

  const status = analysisState?.status || "idle";
  const result = analysisState?.result || null;

  return (
    <div className="apWrap">
      <div className="apTabsRow">
        <div className="apTabs">
          {TABS.map((tabItem) => {
            const Icon = tabItem.icon;
            const isActive = tabItem.id === tab;

            return (
              <button
                key={tabItem.id}
                className={isActive ? "apTab apTabActive" : "apTab"}
                type="button"
                onClick={() => setTab(tabItem.id)}
              >
                <Icon size={14} />
                <span className="apTabText">{tabItem.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="apBody">
        {status === "idle" && <IdleState />}

        {status === "loading" && <LoadingState />}

        {status === "error" && (
          <ErrorState
            message={
              analysisState?.error ||
              "Something went wrong. Make sure the server is running."
            }
          />
        )}

        {status === "done" && result && (
          <>
            {tab === "overview" && (
              <OverviewTab result={result} onSeeDetails={() => setTab("issues")} />
            )}

            {tab === "issues" && <IssuesTab issues={result.issues || []} />}

            {tab === "refactoring" && (
              <RefactoringTab
                items={result.refactoring || []}
                onApplyFix={onApplyFix}
                fixState={fixState}
              />
            )}

            {tab === "documentation" && (
              <DocumentationTab docs={result.docs || []} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function IdleState() {
  return (
    <div className="apEmpty">
      <div className="apEmptyIcon">
        <Code size={46} />
      </div>

      <div className="apEmptyTitle">Paste your code and click Analyze</div>
      <div className="apEmptyHint">CodeSage will return AI insights here.</div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="apLoading">
      <div className="apSpinner" aria-hidden="true" />

      <div className="apLoadingTitle">Analyzing Code...</div>
      <div className="apLoadingHint">
        Reading your code and checking for issues.
      </div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="apEmpty">
      <div className="apEmptyTitle">AI review failed</div>
      <div className="apEmptyHint">{message}</div>
    </div>
  );
}

function OverviewTab({ result, onSeeDetails }) {
  const score = Math.max(0, Math.min(100, Number(result.score || 0)));
  const fillStyle = { width: `${score}%` };

  return (
    <div className="apSection">
      <div className="apCard">
        <div className="apCardTitle">Code Quality Score</div>

        <div className="apScoreRow">
          <div className="apScoreValue">{score}</div>
          <div className="apScoreMax">/ 100</div>
        </div>

        <div className="apProgressTrack">
          <div className="apProgressFill" style={fillStyle} />
        </div>

        <div className="apMsgTitle">{result.overview?.title}</div>
        <div className="apMsgSub">{result.overview?.subtitle}</div>

        <div className="apStats">
          <span>{result.stats?.lines || 0} lines</span>
          <span className="apDot">•</span>
          <span>{result.stats?.issues || 0} issues found</span>
        </div>

        <button type="button" className="apDetailsBtn" onClick={onSeeDetails}>
          <span>See Details</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function IssuesTab({ issues }) {
  return (
    <div className="apSection">
      <div className="apSectionTitle">Issues</div>

      {issues.length === 0 ? (
        <div className="apSimpleCard">
          <div className="apSimpleIcon">
            <ShieldAlert size={18} />
          </div>

          <div className="apSimpleText">No issues found. Nice and clean.</div>
        </div>
      ) : (
        <div className="apList">
          {issues.map((issue, index) => {
            const severityClass = getSeverityClass(issue.severity);

            return (
              <div className="apIssueCard" key={`${issue.title}-${index}`}>
                <div className={`apSeverityDot ${severityClass}`} />

                <div className="apIssueMain">
                  <div className="apIssueTitle">
                    <span className={`apSeverityText ${severityClass}`}>
                      {String(issue.severity).toUpperCase()}
                    </span>

                    <span className="apIssueDash">•</span>
                    <span>{issue.title}</span>
                  </div>

                  <div className="apIssueDesc">{issue.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RefactoringTab({ items, onApplyFix, fixState }) {
  const [dismissed, setDismissed] = useState(false);
  const status = fixState?.status || "idle";

  return (
    <div className="apSection">
      <div className="apSectionTitle">Refactoring Suggestions</div>

      {items.length > 0 ? (
        <div className="apList">
          {items.map((text, index) => (
            <div className="apSimpleCard" key={`${text}-${index}`}>
              <div className="apSimpleIcon">
                <Wand2 size={18} />
              </div>

              <div className="apSimpleText">{text}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="apSimpleCard">
          <div className="apSimpleIcon">
            <Wand2 size={18} />
          </div>

          <div className="apSimpleText">No refactoring suggestions found.</div>
        </div>
      )}

      {!dismissed && (
        <div className="apFixCard">
          <div className="apFixTitle">Want me to fix the code for you?</div>

          <div className="apFixHint">
            The AI will rewrite your code in the editor with these fixes applied.
          </div>

          {status === "done" ? (
            <div className="apFixDone">
              Code updated in the editor. Run Analyze again to re-check.
            </div>
          ) : (
            <div className="apFixActions">
              <button
                type="button"
                className="apFixYes"
                onClick={onApplyFix}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Fixing..." : "Yes, fix it"}
              </button>

              <button
                type="button"
                className="apFixNo"
                onClick={() => setDismissed(true)}
                disabled={status === "loading"}
              >
                No, thanks
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="apFixError">
              {fixState?.error || "Could not fix the code."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DocumentationTab({ docs }) {
  return (
    <div className="apSection">
      <div className="apSectionTitle">Generated Documentation</div>

      {docs.length > 0 ? (
        <div className="apList">
          {docs.map((doc, index) => (
            <div className="apDocCard" key={`${doc.method}-${doc.path}-${index}`}>
              <div className="apDocTop">
                <span className="apDocMethod">{doc.method}</span>
                <span className="apDocPath">{doc.path}</span>
              </div>

              <div className="apDocDesc">{doc.description}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="apSimpleCard">
          <div className="apSimpleIcon">
            <BookOpen size={18} />
          </div>

          <div className="apSimpleText">No documentation generated yet.</div>
        </div>
      )}
    </div>
  );
}
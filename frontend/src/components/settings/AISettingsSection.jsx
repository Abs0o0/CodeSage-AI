import { useState } from "react";
import { Check } from "lucide-react";
import { AI_MODELS } from "./constants";
import { readJson, writeJson } from "../../utils/storage";

function resolveStrictnessLabel(value) {
  if (value <= 25) return "Lax";
  if (value <= 75) return "Balanced";
  return "Strict";
}

export default function AISettingsSection() {
  const [prefs, setPrefs] = useState(() =>
    readJson("codesage-ai", {
      defaultModel: "llama-3.3-70b-versatile",
      autoFix: true,
      documentation: false,
      strictness: 50,
    })
  );

  const [saved, setSaved] = useState(false);

  const updatePrefs = (patch) => {
    setPrefs((prev) => ({
      ...prev,
      ...patch,
    }));

    setSaved(false);
  };

  const save = () => {
    writeJson("codesage-ai", prefs);
    setSaved(true);
  };

  const strictnessLabel = resolveStrictnessLabel(prefs.strictness);

  return (
    <div className="set-panel">
      <h2 className="set-panel-title">AI Settings</h2>
      <p className="set-panel-sub">
        Configure how CodeSage reviews and suggests improvements.
      </p>

      <div className="set-field">
        <label htmlFor="defaultModel">Default AI Model</label>
        <select
          id="defaultModel"
          className="set-input"
          value={prefs.defaultModel}
          onChange={(event) =>
            updatePrefs({ defaultModel: event.target.value })
          }
        >
          {AI_MODELS.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
      </div>

      <div className="set-toggle-box">
        <label className="set-toggle">
          <div>
            <div className="set-toggle-title">
              Real-time Auto-Fix Suggestions
            </div>
            <div className="set-toggle-sub">
              Show the “Apply Fix” action after each review.
            </div>
          </div>

          <input
            type="checkbox"
            checked={prefs.autoFix}
            onChange={(event) =>
              updatePrefs({ autoFix: event.target.checked })
            }
          />
        </label>

        <label className="set-toggle">
          <div>
            <div className="set-toggle-title">
              Detailed Documentation Generation
            </div>
            <div className="set-toggle-sub">
              Generate doc snippets during reviews.
            </div>
          </div>

          <input
            type="checkbox"
            checked={prefs.documentation}
            onChange={(event) =>
              updatePrefs({ documentation: event.target.checked })
            }
          />
        </label>
      </div>

      <div className="set-field">
        <div className="set-slider-head">
          <label htmlFor="strictness">AI Review Strictness</label>
          <span className="set-badge">{strictnessLabel}</span>
        </div>

        <input
          id="strictness"
          type="range"
          className="set-range"
          min="0"
          max="100"
          step="25"
          value={prefs.strictness}
          onChange={(event) =>
            updatePrefs({ strictness: Number(event.target.value) })
          }
        />

        <div className="set-range-marks">
          <span>Lax</span>
          <span>Balanced</span>
          <span>Strict</span>
        </div>
      </div>

      <div className="set-actions">
        <button className="btn btn-gradient" type="button" onClick={save}>
          {saved && (
            <span className="set-ico">
              <Check size={16} />
            </span>
          )}
          {saved ? "Settings Saved" : "Save AI Settings"}
        </button>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Switch,
  Typography,
} from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { ACCENT, AI_MODEL_OPTIONS, STRICTNESS_MARKS } from "./constants";
import SectionPanel from "./SectionPanel";

function resolveStrictnessLabel(strictnessValue) {
  if (strictnessValue <= 25) return "Lax";
  if (strictnessValue <= 75) return "Balanced";
  return "Strict";
}

export default function AISettingsSection() {
  const [aiPreferences, setAiPreferences] = useState({
    defaultModel: "gpt-4o",
    autoFixEnabled: true,
    documentationEnabled: false,
    reviewStrictness: 50,
  });
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSucceeded, setSaveSucceeded] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAiSettings() {
      setIsFetching(true);
      setFetchError("");
      try {
        const response = await fetch("/api/users/ai-settings", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Unable to load AI settings.");
        }
        const settings = await response.json();
        if (cancelled) return;
        setAiPreferences({
          defaultModel: settings.defaultModel ?? "gpt-4o",
          autoFixEnabled: settings.autoFixEnabled ?? true,
          documentationEnabled: settings.documentationEnabled ?? false,
          reviewStrictness: settings.reviewStrictness ?? 50,
        });
      } catch (error) {
        if (!cancelled) setFetchError(error.message);
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    }

    loadAiSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveAiSettings = async () => {
    setIsSaving(true);
    setSaveError("");
    setSaveSucceeded(false);

    try {
      const response = await fetch("/api/users/ai-settings", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiPreferences),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to save AI settings.");
      }

      setSaveSucceeded(true);
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return (
      <SectionPanel title="AI Settings" description="Configure CodeSage review behavior.">
        <div className="flex justify-center py-12">
          <CircularProgress size={32} sx={{ color: ACCENT }} />
        </div>
      </SectionPanel>
    );
  }

  return (
    <SectionPanel
      title="AI Settings"
      description="Configure how CodeSage's AI reviews and suggests improvements for your frontend code."
    >
      {fetchError && (
        <Typography variant="body2" className="mb-4 text-amber-600">
          {fetchError}
        </Typography>
      )}

      <FormControl fullWidth size="small" className="mb-8 max-w-md">
        <InputLabel id="ai-model-label">Default AI Model</InputLabel>
        <Select
          labelId="ai-model-label"
          value={aiPreferences.defaultModel}
          label="Default AI Model"
          onChange={(event) => {
            setAiPreferences((previous) => ({
              ...previous,
              defaultModel: event.target.value,
            }));
            setSaveSucceeded(false);
          }}
        >
          {AI_MODEL_OPTIONS.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="mb-8 space-y-1 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <FormControlLabel
          control={
            <Switch
              checked={aiPreferences.autoFixEnabled}
              onChange={(event) => {
                setAiPreferences((previous) => ({
                  ...previous,
                  autoFixEnabled: event.target.checked,
                }));
                setSaveSucceeded(false);
              }}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: ACCENT },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  bgcolor: ACCENT,
                },
              }}
            />
          }
          label={
            <div>
              <Typography variant="body2" className="font-medium text-gray-800 dark:text-gray-200">
                Enable Real-time Auto-Fix Suggestions
              </Typography>
              <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                Show inline fix suggestions as you write code.
              </Typography>
            </div>
          }
          className="mx-0 w-full items-start py-2"
        />
        <FormControlLabel
          control={
            <Switch
              checked={aiPreferences.documentationEnabled}
              onChange={(event) => {
                setAiPreferences((previous) => ({
                  ...previous,
                  documentationEnabled: event.target.checked,
                }));
                setSaveSucceeded(false);
              }}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: ACCENT },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  bgcolor: ACCENT,
                },
              }}
            />
          }
          label={
            <div>
              <Typography variant="body2" className="font-medium text-gray-800 dark:text-gray-200">
                Include Detailed Documentation Generation
              </Typography>
              <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                Auto-generate JSDoc and README snippets during reviews.
              </Typography>
            </div>
          }
          className="mx-0 w-full items-start py-2"
        />
      </div>

      <div className="max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <Typography variant="body2" className="font-medium text-gray-800 dark:text-gray-200">
            AI Review Strictness
          </Typography>
          <span className="rounded-full bg-violet-50 px-3 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
            {resolveStrictnessLabel(aiPreferences.reviewStrictness)}
          </span>
        </div>
        <Slider
          value={aiPreferences.reviewStrictness}
          onChange={(_, value) => {
            setAiPreferences((previous) => ({
              ...previous,
              reviewStrictness: value,
            }));
            setSaveSucceeded(false);
          }}
          step={null}
          marks={STRICTNESS_MARKS}
          min={0}
          max={100}
          sx={{
            color: ACCENT,
            "& .MuiSlider-markLabel": { fontSize: "0.75rem" },
          }}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button
          variant="contained"
          disabled={isSaving}
          onClick={handleSaveAiSettings}
          startIcon={
            isSaving ? (
              <CircularProgress size={18} color="inherit" />
            ) : saveSucceeded ? (
              <CheckCircleOutlinedIcon />
            ) : null
          }
          sx={{
            bgcolor: ACCENT,
            textTransform: "none",
            "&:hover": { bgcolor: "#9333ea" },
          }}
        >
          {isSaving ? "Saving…" : saveSucceeded ? "Settings Saved" : "Save AI Settings"}
        </Button>
        {saveError && (
          <Typography variant="body2" className="text-red-600">
            {saveError}
          </Typography>
        )}
      </div>
    </SectionPanel>
  );
}

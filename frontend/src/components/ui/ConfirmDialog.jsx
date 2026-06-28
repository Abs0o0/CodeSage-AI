import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="confirm-overlay" role="presentation" onMouseDown={onCancel}>
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="confirm-close"
          onClick={onCancel}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className={danger ? "confirm-icon danger" : "confirm-icon"}>
          <AlertTriangle size={24} />
        </div>

        <h2 id="confirm-title" className="confirm-title">
          {title}
        </h2>

        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button type="button" className="confirm-cancel" onClick={onCancel}>
            {cancelText}
          </button>

          <button
            type="button"
            className={danger ? "confirm-primary danger" : "confirm-primary"}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </section>
    </div>
  );
}
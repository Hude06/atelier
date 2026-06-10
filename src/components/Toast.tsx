import { useCallback, useRef, useState } from "react";

export type ToastKind = "info" | "danger";

export type ToastSpec = {
  // Stable id replaces an existing toast instead of stacking a duplicate
  // (used to dedupe repeated save failures and undo prompts).
  id?: string;
  message: string;
  kind?: ToastKind;
  actionLabel?: string;
  onAction?: () => void;
  // Called when the toast leaves by timeout or dismissal — but not when it
  // is replaced by a same-id push (replacement is a continuation).
  onClose?: () => void;
  duration?: number; // ms; 0 = sticky until dismissed
};

export type ToastItem = {
  id: string;
  message: string;
  kind: ToastKind;
  actionLabel?: string;
  onAction?: () => void;
};

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, number>());
  const closers = useRef(new Map<string, () => void>());
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    const onClose = closers.current.get(id);
    closers.current.delete(id);
    setToasts((ts) => ts.filter((t) => t.id !== id));
    onClose?.();
  }, []);

  const push = useCallback(
    (spec: ToastSpec): string => {
      const id = spec.id ?? `toast-${++counter.current}`;
      const prevTimer = timers.current.get(id);
      if (prevTimer !== undefined) clearTimeout(prevTimer);
      if (spec.onClose) closers.current.set(id, spec.onClose);
      else closers.current.delete(id);
      setToasts((ts) => [
        ...ts.filter((t) => t.id !== id),
        {
          id,
          message: spec.message,
          kind: spec.kind ?? "info",
          actionLabel: spec.actionLabel,
          onAction: spec.onAction,
        },
      ]);
      const duration = spec.duration ?? 5000;
      if (duration > 0) {
        timers.current.set(id, window.setTimeout(() => dismiss(id), duration));
      } else {
        timers.current.delete(id);
      }
      return id;
    },
    [dismiss]
  );

  return { toasts, push, dismiss };
}

type RegionProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

export function ToastRegion({ toasts, onDismiss }: RegionProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast${t.kind === "danger" ? " danger" : ""}`}>
          <span className="toast-message">{t.message}</span>
          {t.actionLabel && t.onAction && (
            <button type="button" className="toast-action" onClick={t.onAction}>
              {t.actionLabel}
            </button>
          )}
          <button
            type="button"
            className="toast-close"
            aria-label="Dismiss"
            onClick={() => onDismiss(t.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";

type Props = {
  value: string;
  onCommit: (value: string) => void;
  className?: string;
  title?: string;
};

/** Text that turns into an input when clicked. Enter/blur commits, Esc cancels. */
export function EditableText({ value, onCommit, className, title }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!editing) {
    return (
      <button
        type="button"
        className={`editable ${className ?? ""}`}
        title={title ?? "Click to rename"}
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
      >
        {value}
      </button>
    );
  }

  return (
    <input
      className={`editable-input ${className ?? ""}`}
      value={draft}
      autoFocus
      spellCheck={false}
      onFocus={(e) => e.currentTarget.select()}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        } else if (e.key === "Escape") {
          e.stopPropagation();
          setDraft(value);
          setEditing(false);
        }
      }}
      onBlur={() => {
        const next = draft.trim();
        if (next && next !== value) onCommit(next);
        setEditing(false);
      }}
    />
  );
}

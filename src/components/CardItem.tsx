import { useEffect, useRef, useState } from "react";
import type { Card } from "../types";
import { Icon } from "../icons";

export type MoveDirection = "left" | "right" | "up" | "down";

type Props = {
  card: Card;
  columnId: string;
  done: boolean;
  dragging: boolean;
  onDragStart: (cardId: string, fromColumnId: string) => void;
  onDragEnd: () => void;
  onUpdate: (title: string) => void;
  onDelete: () => void;
  onKeyboardMove: (direction: MoveDirection) => void;
};

export function CardItem({
  card,
  columnId,
  done,
  dragging,
  onDragStart,
  onDragEnd,
  onUpdate,
  onDelete,
  onKeyboardMove,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(card.title);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && areaRef.current) {
      const el = areaRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [editing]);

  if (editing) {
    return (
      <div className="card editing" data-card>
        <textarea
          ref={areaRef}
          className="card-edit"
          value={draft}
          rows={1}
          spellCheck={false}
          onChange={(e) => {
            setDraft(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.blur();
            } else if (e.key === "Escape") {
              e.stopPropagation();
              setDraft(card.title);
              setEditing(false);
            }
          }}
          onBlur={() => {
            const next = draft.trim();
            if (next && next !== card.title) onUpdate(next);
            setEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`card${done ? " done" : ""}${dragging ? " dragging" : ""}`}
      data-card
      data-card-id={card.id}
      tabIndex={0}
      role="article"
      aria-label={card.title}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", card.id);
        onDragStart(card.id, columnId);
      }}
      onDragEnd={onDragEnd}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          setDraft(card.title);
          setEditing(true);
        } else if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          onDelete();
        } else if ((e.metaKey || e.ctrlKey) && e.key.startsWith("Arrow")) {
          e.preventDefault();
          onKeyboardMove(
            e.key === "ArrowLeft"
              ? "left"
              : e.key === "ArrowRight"
                ? "right"
                : e.key === "ArrowUp"
                  ? "up"
                  : "down"
          );
        }
      }}
    >
      {done && <Icon name="check" size={13} className="card-check" />}
      <p
        className="card-text"
        title="Click to edit"
        onClick={() => {
          setDraft(card.title);
          setEditing(true);
        }}
      >
        {card.title}
      </p>
      <button
        type="button"
        className="card-delete"
        title="Delete card"
        onClick={onDelete}
      >
        <Icon name="x" size={11} />
      </button>
    </div>
  );
}

import { Fragment, useRef, useState } from "react";
import type { CSSProperties, DragEvent } from "react";
import type { Column as ColumnType } from "../types";
import { CardItem } from "./CardItem";
import type { MoveDirection } from "./CardItem";
import { EditableText } from "./EditableText";
import { Icon } from "../icons";

type Props = {
  column: ColumnType;
  index: number;
  isLast: boolean;
  color: string;
  showCounts: boolean;
  dropIndex: number | null;
  draggingId: string | null;
  onRename: (title: string) => void;
  onAddCard: (title: string) => void;
  onUpdateCard: (cardId: string, title: string) => void;
  onDeleteCard: (cardId: string) => void;
  onKeyboardMove: (cardId: string, direction: MoveDirection) => void;
  onCardDragStart: (cardId: string, fromColumnId: string) => void;
  onCardDragEnd: () => void;
  onDragOver: (e: DragEvent<HTMLElement>, columnId: string) => void;
  onDrop: (e: DragEvent<HTMLElement>, columnId: string) => void;
  onDragLeave: (e: DragEvent<HTMLElement>, columnId: string) => void;
};

export function Column({
  column,
  index,
  isLast,
  color,
  showCounts,
  dropIndex,
  draggingId,
  onRename,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onKeyboardMove,
  onCardDragStart,
  onCardDragEnd,
  onDragOver,
  onDrop,
  onDragLeave,
}: Props) {
  const empty = column.cards.length === 0;

  return (
    <section
      className="column"
      style={{ "--i": index, "--project-color": color } as CSSProperties}
      onDragOver={(e) => onDragOver(e, column.id)}
      onDrop={(e) => onDrop(e, column.id)}
      onDragLeave={(e) => onDragLeave(e, column.id)}
    >
      <header className="column-head">
        <EditableText
          className="column-title"
          value={column.title}
          onCommit={onRename}
          title="Click to rename this list"
        />
        {showCounts && (
          <span className="column-count">{column.cards.length}</span>
        )}
      </header>

      <div className="column-list">
        {column.cards.map((card, i) => (
          <Fragment key={card.id}>
            {dropIndex === i && <div className="drop-indicator" />}
            <CardItem
              card={card}
              columnId={column.id}
              done={isLast}
              dragging={draggingId === card.id}
              onDragStart={onCardDragStart}
              onDragEnd={onCardDragEnd}
              onUpdate={(title) => onUpdateCard(card.id, title)}
              onDelete={() => onDeleteCard(card.id)}
              onKeyboardMove={(direction) => onKeyboardMove(card.id, direction)}
            />
          </Fragment>
        ))}
        {dropIndex === column.cards.length && (
          <div className="drop-indicator" />
        )}
        {empty && dropIndex === null && (
          <div className="column-empty">Nothing here yet</div>
        )}
      </div>

      <Composer onAdd={onAddCard} />
    </section>
  );
}

function Composer({ onAdd }: { onAdd: (title: string) => void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const commit = () => {
    const title = text.trim();
    if (title) onAdd(title);
    setText("");
    if (areaRef.current) {
      areaRef.current.style.height = "auto";
      areaRef.current.focus();
    }
  };

  const close = () => {
    setText("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button type="button" className="add-card" onClick={() => setOpen(true)}>
        <Icon name="plus" size={13} />
        New card
      </button>
    );
  }

  return (
    <div className="composer">
      <textarea
        ref={areaRef}
        autoFocus
        rows={2}
        placeholder="What needs doing?"
        spellCheck={false}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            commit();
          } else if (e.key === "Escape") {
            e.stopPropagation();
            close();
          }
        }}
        onBlur={() => {
          if (!text.trim()) setOpen(false);
        }}
      />
      <div className="composer-row">
        <button
          type="button"
          className="btn-primary"
          onMouseDown={(e) => e.preventDefault()}
          onClick={commit}
        >
          Add
        </button>
        <button
          type="button"
          className="btn-ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

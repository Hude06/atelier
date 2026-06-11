import { useRef, useState } from "react";
import type { CSSProperties, DragEvent } from "react";
import type { Project } from "../types";
import { Column } from "./Column";
import { EditableText } from "./EditableText";
import { Icon } from "../icons";

type DragInfo = { cardId: string; fromColumnId: string };
type DropTarget = { columnId: string; index: number } | null;

type Props = {
  project: Project;
  showCounts: boolean;
  onRenameProject: (name: string) => void;
  onDeleteProject: () => void;
  onClearColumn: (columnId: string) => void;
  onRenameColumn: (columnId: string, title: string) => void;
  onAddCard: (columnId: string, title: string) => void;
  onUpdateCard: (columnId: string, cardId: string, title: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onMoveCard: (
    fromColumnId: string,
    toColumnId: string,
    cardId: string,
    index: number
  ) => void;
};

export function Board({
  project,
  showCounts,
  onRenameProject,
  onDeleteProject,
  onClearColumn,
  onRenameColumn,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onMoveCard,
}: Props) {
  const dragInfo = useRef<DragInfo | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const totalCards = project.columns.reduce((n, c) => n + c.cards.length, 0);
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const startDrag = (cardId: string, fromColumnId: string) => {
    dragInfo.current = { cardId, fromColumnId };
    setDraggingId(cardId);
  };

  const endDrag = () => {
    dragInfo.current = null;
    setDraggingId(null);
    setDropTarget(null);
  };

  const dragOverColumn = (e: DragEvent<HTMLElement>, columnId: string) => {
    if (!dragInfo.current) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const cards = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>("[data-card]")
    );
    let index = cards.length;
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) {
        index = i;
        break;
      }
    }
    setDropTarget((prev) =>
      prev && prev.columnId === columnId && prev.index === index
        ? prev
        : { columnId, index }
    );
  };

  const dropOnColumn = (e: DragEvent<HTMLElement>, columnId: string) => {
    e.preventDefault();
    const info = dragInfo.current;
    if (info) {
      const col = project.columns.find((c) => c.id === columnId);
      const index =
        dropTarget && dropTarget.columnId === columnId
          ? dropTarget.index
          : col
            ? col.cards.length
            : 0;
      onMoveCard(info.fromColumnId, columnId, info.cardId, index);
    }
    endDrag();
  };

  const leaveColumn = (e: DragEvent<HTMLElement>, columnId: string) => {
    // WebKit fires dragleave with a null relatedTarget while moving between
    // children, so decide by pointer position instead.
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      return;
    }
    setDropTarget((prev) =>
      prev && prev.columnId === columnId ? null : prev
    );
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setConfirmDelete(false);
  };

  return (
    <div className="board-view">
      <header className="board-head">
        <span
          className="project-chip"
          style={{ "--project-color": project.color } as CSSProperties}
        >
          <Icon name={project.icon} size={17} />
        </span>
        <EditableText
          className="project-name"
          value={project.name}
          onCommit={onRenameProject}
          title="Click to rename this project"
        />
        <div className="head-spacer" data-tauri-drag-region />
        <span className="board-meta">
          {today} · {totalCards} {totalCards === 1 ? "card" : "cards"}
        </span>
        <div className="menu-anchor">
          <button
            type="button"
            className={`icon-btn${menuOpen ? " active" : ""}`}
            title="Project options"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Icon name="dots" size={17} />
          </button>
          {menuOpen && (
            <>
              <div className="menu-backdrop" onClick={closeMenu} />
              <div className="menu">
                <button
                  type="button"
                  className="menu-item"
                  onClick={() => {
                    onClearColumn(
                      project.columns[project.columns.length - 1].id
                    );
                    closeMenu();
                  }}
                >
                  <Icon name="broom" size={14} />
                  Clear last column
                </button>
                <button
                  type="button"
                  className="menu-item danger"
                  onClick={() => {
                    if (confirmDelete) {
                      onDeleteProject();
                      closeMenu();
                    } else {
                      setConfirmDelete(true);
                    }
                  }}
                >
                  <Icon name="trash" size={14} />
                  {confirmDelete ? "Really delete?" : "Delete project"}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="board" data-tauri-drag-region>
        {project.columns.map((column, i) => (
          <Column
            key={column.id}
            column={column}
            index={i}
            isLast={i === project.columns.length - 1}
            color={project.color}
            showCounts={showCounts}
            dropIndex={
              dropTarget && dropTarget.columnId === column.id
                ? dropTarget.index
                : null
            }
            draggingId={draggingId}
            onRename={(title) => onRenameColumn(column.id, title)}
            onAddCard={(title) => onAddCard(column.id, title)}
            onUpdateCard={(cardId, title) =>
              onUpdateCard(column.id, cardId, title)
            }
            onDeleteCard={(cardId) => onDeleteCard(column.id, cardId)}
            onCardDragStart={startDrag}
            onCardDragEnd={endDrag}
            onDragOver={dragOverColumn}
            onDrop={dropOnColumn}
            onDragLeave={leaveColumn}
          />
        ))}
      </div>
    </div>
  );
}

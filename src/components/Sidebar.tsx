import { useState } from "react";
import type { CSSProperties } from "react";
import type { Project } from "../types";
import { Icon, PROJECT_GLYPHS } from "../icons";
import type { IconName } from "../icons";
import { PALETTE } from "../data";

type Props = {
  projects: Project[];
  activeId: string;
  view: "board" | "settings";
  addOpen: boolean;
  onAddOpenChange: (open: boolean) => void;
  onSelect: (id: string) => void;
  onAddProject: (name: string, icon: IconName, color: string) => void;
  onOpenSettings: () => void;
};

export function Sidebar({
  projects,
  activeId,
  view,
  addOpen,
  onAddOpenChange,
  onSelect,
  onAddProject,
  onOpenSettings,
}: Props) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<IconName>("circle");
  const [color, setColor] = useState(PALETTE[0].value);

  const close = () => {
    onAddOpenChange(false);
    setName("");
    setIcon("circle");
    setColor(PALETTE[0].value);
  };

  const create = () => {
    onAddProject(name.trim() || "Untitled", icon, color);
    close();
  };

  return (
    <>
      <nav className="sidebar" data-tauri-drag-region>
        <div className="sidebar-top" data-tauri-drag-region />
        <div className="brand" title="Atelier">
          <span className="brand-tile" />
        </div>

        <div className="sidebar-projects" data-tauri-drag-region>
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`project-btn${
                p.id === activeId && view === "board" ? " active" : ""
              }`}
              style={{ "--project-color": p.color } as CSSProperties}
              title={p.name}
              onClick={() => onSelect(p.id)}
            >
              <Icon name={p.icon} size={19} />
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <button
            type="button"
            className={`sidebar-action add${addOpen ? " active" : ""}`}
            title="New project"
            onClick={() => onAddOpenChange(!addOpen)}
          >
            <Icon name="plus" size={16} />
          </button>
          <div className="sidebar-divider" />
          <button
            type="button"
            className={`sidebar-action${view === "settings" ? " active" : ""}`}
            title="Settings (⌘,)"
            onClick={onOpenSettings}
          >
            <Icon name="sliders" size={17} />
          </button>
        </div>
      </nav>

      {addOpen && (
        <>
          <div className="popover-backdrop" onClick={close} />
          <div className="add-popover">
            <p className="popover-label">New project</p>
            <input
              autoFocus
              className="popover-input"
              placeholder="Project name"
              spellCheck={false}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") create();
                else if (e.key === "Escape") {
                  e.stopPropagation();
                  close();
                }
              }}
            />
            <p className="popover-sub">Glyph</p>
            <div className="glyph-grid">
              {PROJECT_GLYPHS.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`glyph-btn${g === icon ? " selected" : ""}`}
                  style={{ "--project-color": color } as CSSProperties}
                  onClick={() => setIcon(g)}
                >
                  <Icon name={g} size={17} />
                </button>
              ))}
            </div>
            <p className="popover-sub">Color</p>
            <div className="swatch-row">
              {PALETTE.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`swatch${c.value === color ? " selected" : ""}`}
                  style={{ background: c.value }}
                  title={c.id}
                  onClick={() => setColor(c.value)}
                />
              ))}
            </div>
            <button type="button" className="btn-primary full" onClick={create}>
              Create project
            </button>
          </div>
        </>
      )}
    </>
  );
}

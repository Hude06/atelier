import type { AppState, Card, Column, Project, Settings } from "./types";
import { DEFAULT_COLUMNS, defaultSettings, PALETTE, uid } from "./data";
import { PROJECT_GLYPHS } from "./icons";
import type { IconName } from "./icons";

export type SalvageReport = {
  droppedProjects: number;
  droppedColumns: number;
  droppedCards: number;
  repaired: boolean;
};

function isRecord(raw: unknown): raw is Record<string, unknown> {
  return !!raw && typeof raw === "object";
}

// Deep-validates a parsed state object, repairing what's cheap (ids,
// timestamps, labels) and dropping only what's truly broken. Never throws.
// Returns null only when nothing is salvageable (zero valid projects).
export function normalizeState(
  raw: unknown
): { state: AppState; report: SalvageReport } | null {
  if (!isRecord(raw) || !Array.isArray(raw.projects)) return null;

  const report: SalvageReport = {
    droppedProjects: 0,
    droppedColumns: 0,
    droppedCards: 0,
    repaired: false,
  };
  const repair = () => {
    report.repaired = true;
  };

  const projects: Project[] = [];
  for (const rawProject of raw.projects) {
    if (!isRecord(rawProject)) {
      report.droppedProjects += 1;
      continue;
    }
    projects.push(normalizeProject(rawProject, report, repair));
  }
  if (projects.length === 0) return null;

  let activeProjectId =
    typeof raw.activeProjectId === "string" ? raw.activeProjectId : "";
  if (!projects.some((p) => p.id === activeProjectId)) {
    repair();
    activeProjectId = projects[0].id;
  }

  return {
    state: { projects, activeProjectId, settings: normalizeSettings(raw.settings) },
    report,
  };
}

function normalizeProject(
  raw: Record<string, unknown>,
  report: SalvageReport,
  repair: () => void
): Project {
  let id: string;
  if (typeof raw.id === "string" && raw.id) {
    id = raw.id;
  } else {
    repair();
    id = uid();
  }

  let name = "Untitled";
  if (typeof raw.name === "string" && raw.name) name = raw.name;
  else repair();

  let icon: IconName = "circle";
  if (typeof raw.icon === "string" && (PROJECT_GLYPHS as string[]).includes(raw.icon)) {
    icon = raw.icon as IconName;
  } else {
    repair();
  }

  let color = PALETTE[0].value;
  if (typeof raw.color === "string" && raw.color) color = raw.color;
  else repair();

  const columns: Column[] = [];
  if (Array.isArray(raw.columns)) {
    for (const rawColumn of raw.columns) {
      if (!isRecord(rawColumn)) {
        report.droppedColumns += 1;
        continue;
      }
      columns.push(normalizeColumn(rawColumn, report, repair));
    }
  }
  if (columns.length === 0) {
    repair();
    columns.push(
      ...DEFAULT_COLUMNS.map((title) => ({ id: uid(), title, cards: [] }))
    );
  }

  return { id, name, icon, color, columns };
}

function normalizeColumn(
  raw: Record<string, unknown>,
  report: SalvageReport,
  repair: () => void
): Column {
  let id: string;
  if (typeof raw.id === "string" && raw.id) {
    id = raw.id;
  } else {
    repair();
    id = uid();
  }

  let title = "Untitled";
  if (typeof raw.title === "string" && raw.title) title = raw.title;
  else repair();

  const cards: Card[] = [];
  if (Array.isArray(raw.cards)) {
    for (const rawCard of raw.cards) {
      const card = normalizeCard(rawCard, repair);
      if (card) cards.push(card);
      else report.droppedCards += 1;
    }
  } else {
    repair();
  }

  return { id, title, cards };
}

// A card without a usable title carries no recoverable content — drop it.
function normalizeCard(raw: unknown, repair: () => void): Card | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.title !== "string" || !raw.title.trim()) return null;

  let id: string;
  if (typeof raw.id === "string" && raw.id) {
    id = raw.id;
  } else {
    repair();
    id = uid();
  }

  let createdAt: number;
  if (typeof raw.createdAt === "number" && Number.isFinite(raw.createdAt)) {
    createdAt = raw.createdAt;
  } else {
    repair();
    createdAt = Date.now();
  }

  return { id, title: raw.title, createdAt };
}

// Unknown or malformed settings silently fall back to defaults.
function normalizeSettings(raw: unknown): Settings {
  const settings: Settings = { ...defaultSettings };
  if (!isRecord(raw)) return settings;
  if (raw.theme === "light" || raw.theme === "dark" || raw.theme === "system") {
    settings.theme = raw.theme;
  }
  if (typeof raw.accent === "string" && raw.accent) settings.accent = raw.accent;
  if (raw.density === "comfortable" || raw.density === "compact") {
    settings.density = raw.density;
  }
  if (typeof raw.showCounts === "boolean") settings.showCounts = raw.showCounts;
  return settings;
}

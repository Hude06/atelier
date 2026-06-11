import type { AppState, Project, Settings } from "./types";
import { createProject, uid, PALETTE } from "./data";
import type { IconName } from "./icons";

// Pure state transitions — every function returns a new AppState and never
// mutates its input. App.tsx wires these into setState; tests exercise them
// directly.

function patchProject(
  s: AppState,
  id: string,
  fn: (p: Project) => Project
): AppState {
  return {
    ...s,
    projects: s.projects.map((p) => (p.id === id ? fn(p) : p)),
  };
}

export function selectProject(s: AppState, id: string): AppState {
  return { ...s, activeProjectId: id };
}

// Steps the active project forward/backward, wrapping at the ends.
export function cycleProject(s: AppState, delta: 1 | -1): AppState {
  const idx = s.projects.findIndex((p) => p.id === s.activeProjectId);
  const next =
    s.projects[(idx + delta + s.projects.length) % s.projects.length];
  return next ? { ...s, activeProjectId: next.id } : s;
}

export function addProject(
  s: AppState,
  name: string,
  icon: IconName,
  color: string
): AppState {
  const project = createProject(name, icon, color);
  return {
    ...s,
    projects: [...s.projects, project],
    activeProjectId: project.id,
  };
}

export function setProjectAppearance(
  s: AppState,
  id: string,
  icon: IconName,
  color: string
): AppState {
  return patchProject(s, id, (p) => ({ ...p, icon, color }));
}

export function renameProject(s: AppState, id: string, name: string): AppState {
  return patchProject(s, id, (p) => ({ ...p, name }));
}

// Deleting the last project reseeds an empty "Untitled" so the board never
// renders without a project.
export function deleteProject(s: AppState, id: string): AppState {
  const projects = s.projects.filter((p) => p.id !== id);
  if (projects.length === 0) {
    projects.push(createProject("Untitled", "circle", PALETTE[0].value));
  }
  return {
    ...s,
    projects,
    activeProjectId:
      s.activeProjectId === id ? projects[0].id : s.activeProjectId,
  };
}

export function renameColumn(
  s: AppState,
  projectId: string,
  columnId: string,
  title: string
): AppState {
  return patchProject(s, projectId, (p) => ({
    ...p,
    columns: p.columns.map((c) => (c.id === columnId ? { ...c, title } : c)),
  }));
}

export function addCard(
  s: AppState,
  projectId: string,
  columnId: string,
  title: string
): AppState {
  return patchProject(s, projectId, (p) => ({
    ...p,
    columns: p.columns.map((c) =>
      c.id === columnId
        ? {
            ...c,
            cards: [...c.cards, { id: uid(), title, createdAt: Date.now() }],
          }
        : c
    ),
  }));
}

export function updateCard(
  s: AppState,
  projectId: string,
  columnId: string,
  cardId: string,
  title: string
): AppState {
  return patchProject(s, projectId, (p) => ({
    ...p,
    columns: p.columns.map((c) =>
      c.id === columnId
        ? {
            ...c,
            cards: c.cards.map((card) =>
              card.id === cardId ? { ...card, title } : card
            ),
          }
        : c
    ),
  }));
}

export function deleteCard(
  s: AppState,
  projectId: string,
  columnId: string,
  cardId: string
): AppState {
  return patchProject(s, projectId, (p) => ({
    ...p,
    columns: p.columns.map((c) =>
      c.id === columnId
        ? { ...c, cards: c.cards.filter((card) => card.id !== cardId) }
        : c
    ),
  }));
}

// toIndex is the slot in the target column counted BEFORE the card is
// removed from its source — same-column moves adjust for the removal.
export function moveCard(
  s: AppState,
  projectId: string,
  fromColumnId: string,
  toColumnId: string,
  cardId: string,
  toIndex: number
): AppState {
  return patchProject(s, projectId, (p) => {
    const from = p.columns.find((c) => c.id === fromColumnId);
    if (!from) return p;
    const fromIndex = from.cards.findIndex((c) => c.id === cardId);
    if (fromIndex === -1) return p;
    const card = from.cards[fromIndex];

    if (fromColumnId === toColumnId) {
      const cards = [...from.cards];
      cards.splice(fromIndex, 1);
      const insertAt = toIndex > fromIndex ? toIndex - 1 : toIndex;
      cards.splice(insertAt, 0, card);
      return {
        ...p,
        columns: p.columns.map((c) =>
          c.id === fromColumnId ? { ...c, cards } : c
        ),
      };
    }

    return {
      ...p,
      columns: p.columns.map((c) => {
        if (c.id === fromColumnId) {
          return { ...c, cards: c.cards.filter((x) => x.id !== cardId) };
        }
        if (c.id === toColumnId) {
          const cards = [...c.cards];
          cards.splice(Math.min(toIndex, cards.length), 0, card);
          return { ...c, cards };
        }
        return c;
      }),
    };
  });
}

export function clearColumn(
  s: AppState,
  projectId: string,
  columnId: string
): AppState {
  return patchProject(s, projectId, (p) => ({
    ...p,
    columns: p.columns.map((c) => (c.id === columnId ? { ...c, cards: [] } : c)),
  }));
}

export function updateSettings(s: AppState, patch: Partial<Settings>): AppState {
  return { ...s, settings: { ...s.settings, ...patch } };
}

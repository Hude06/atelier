import type { AppState, Project, Settings } from "./types";
import type { IconName } from "./icons";

export const PALETTE = [
  { id: "vermillion", value: "#C24B2C" },
  { id: "ochre", value: "#B5872E" },
  { id: "moss", value: "#74824B" },
  { id: "teal", value: "#3D8273" },
  { id: "indigo", value: "#5063A8" },
  { id: "plum", value: "#8E5B8A" },
  { id: "rose", value: "#C06070" },
  { id: "slate", value: "#5F6B76" },
];

export function uid(): string {
  return (
    Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
  );
}

export const DEFAULT_COLUMNS = ["To do", "Working on", "Completed"];

export function createProject(
  name: string,
  icon: IconName,
  color: string
): Project {
  return {
    id: uid(),
    name,
    icon,
    color,
    columns: DEFAULT_COLUMNS.map((title) => ({ id: uid(), title, cards: [] })),
  };
}

export const defaultSettings: Settings = {
  theme: "system",
  accent: PALETTE[0].value,
  density: "comfortable",
  showCounts: true,
};

export function seedState(): AppState {
  const personal = createProject("Personal", "leaf", PALETTE[2].value);
  const card = (title: string) => ({ id: uid(), title, createdAt: Date.now() });

  personal.columns[0].cards = [
    card("Drag a card between columns"),
    card("Click a column title to rename it"),
    card("Press + in the sidebar to start a new project"),
  ];
  personal.columns[1].cards = [card("Make this board yours")];
  personal.columns[2].cards = [card("Open Atelier for the first time")];

  return {
    projects: [personal],
    activeProjectId: personal.id,
    settings: { ...defaultSettings },
  };
}

import type { IconName } from "./icons";

export type Card = {
  id: string;
  title: string;
  createdAt: number;
};

export type Column = {
  id: string;
  title: string;
  cards: Card[];
};

export type Project = {
  id: string;
  name: string;
  icon: IconName;
  color: string;
  columns: Column[];
};

export type ThemeMode = "light" | "dark" | "system";
export type Density = "comfortable" | "compact";

export type Settings = {
  theme: ThemeMode;
  accent: string;
  density: Density;
  showCounts: boolean;
};

export type AppState = {
  projects: Project[];
  activeProjectId: string;
  settings: Settings;
};

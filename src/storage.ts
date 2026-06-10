import { invoke } from "@tauri-apps/api/core";
import type { AppState } from "./types";
import { defaultSettings, seedState } from "./data";

const LS_KEY = "atelier.state.v1";

function withDefaults(state: AppState): AppState {
  return { ...state, settings: { ...defaultSettings, ...state.settings } };
}

function isValid(state: unknown): state is AppState {
  return (
    !!state &&
    typeof state === "object" &&
    Array.isArray((state as AppState).projects) &&
    (state as AppState).projects.length > 0
  );
}

function loadFromLocalStorage(): AppState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // current format: { v, t } — older format was the bare state object
    if (parsed && isValid(parsed.v)) return withDefaults(parsed.v);
    if (isValid(parsed)) return withDefaults(parsed);
    return null;
  } catch {
    return null;
  }
}

export async function initState(): Promise<AppState> {
  try {
    const json = await invoke<string | null>("load_state");
    if (json) {
      const parsed = JSON.parse(json);
      if (isValid(parsed)) return withDefaults(parsed);
    }
  } catch {
    // Not running inside Tauri (plain browser dev) — fall through.
  }
  const local = loadFromLocalStorage();
  return local ?? seedState();
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ v: state, t: Date.now() }));
  } catch {
    // storage full or unavailable
  }
  invoke("save_state", { json: JSON.stringify(state) }).catch(() => {});
}

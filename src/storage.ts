import { load, type Store } from "@tauri-apps/plugin-store";
import type { AppState } from "./types";
import { defaultSettings, seedState } from "./data";

const LS_KEY = "atelier.state.v1";
const STORE_FILE = "atelier-state.json";
const STORE_KEY = "state";
const STAMP_KEY = "savedAt";

let store: Store | null = null;

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

type Stamped = { state: AppState; savedAt: number };

function loadFromLocalStorage(): Stamped | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // current format: { v, t } — older format was the bare state object
    if (parsed && isValid(parsed.v)) {
      return { state: withDefaults(parsed.v), savedAt: Number(parsed.t) || 0 };
    }
    if (isValid(parsed)) {
      return { state: withDefaults(parsed), savedAt: 0 };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Loads app state from the on-disk Tauri store
 * (~/Library/Application Support/com.jude.atelier/atelier-state.json),
 * falling back to localStorage. localStorage is written synchronously on
 * every change, so if the app quit before the async disk write finished,
 * the newer localStorage copy wins here and is written back to disk.
 */
export async function initState(): Promise<AppState> {
  try {
    store = await load(STORE_FILE);
    const saved = await store.get<AppState>(STORE_KEY);
    const savedAt = (await store.get<number>(STAMP_KEY)) ?? 0;
    const local = loadFromLocalStorage();

    if (isValid(saved) && (!local || savedAt >= local.savedAt)) {
      return withDefaults(saved);
    }
    if (local) {
      await store.set(STORE_KEY, local.state);
      await store.set(STAMP_KEY, local.savedAt);
      await store.save();
      return local.state;
    }
  } catch {
    // Not running inside Tauri (plain browser dev) — localStorage only.
    const local = loadFromLocalStorage();
    if (local) return local.state;
  }
  return seedState();
}

export function saveState(state: AppState) {
  const savedAt = Date.now();
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ v: state, t: savedAt }));
  } catch {
    // storage full or unavailable — the disk store below still has it
  }
  if (store) {
    const s = store;
    s.set(STORE_KEY, state)
      .then(() => s.set(STAMP_KEY, savedAt))
      .then(() => s.save())
      .catch(() => {
        // disk write failed; the localStorage copy above remains
      });
  }
}

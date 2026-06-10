import { invoke } from "@tauri-apps/api/core";
import type { AppState } from "./types";
import { defaultSettings, seedState } from "./data";
import { migrate, parsePersisted, toEnvelope } from "./migrations";

const LS_KEY = "atelier.state.v1";
const SAVE_DEBOUNCE_MS = 500;

const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

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

// Parse any persisted shape (envelope, legacy wrapper, bare state) into a
// usable AppState, or null.
function fromRaw(raw: unknown): AppState | null {
  const env = parsePersisted(raw);
  if (!env) return null;
  const migrated = migrate(env);
  if (!migrated) return null;
  return isValid(migrated.state) ? withDefaults(migrated.state as AppState) : null;
}

function loadFromLocalStorage(): AppState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return fromRaw(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function initState(): Promise<AppState> {
  if (IS_TAURI) {
    try {
      const json = await invoke<string | null>("load_state");
      if (json) {
        const state = fromRaw(JSON.parse(json));
        if (state) return state;
      }
    } catch {
      // unreadable disk state — fall through to localStorage
    }
  }
  return loadFromLocalStorage() ?? seedState();
}

export type SaveStatus = { ok: true } | { ok: false; message: string };

let pending: string | null = null; // serialized envelope awaiting a disk write
let debounceTimer: number | null = null;
let writeChain: Promise<void> = Promise.resolve();
const statusListeners = new Set<(s: SaveStatus) => void>();

export function onSaveStatus(cb: (s: SaveStatus) => void): () => void {
  statusListeners.add(cb);
  return () => {
    statusListeners.delete(cb);
  };
}

function emit(status: SaveStatus) {
  for (const cb of statusListeners) cb(status);
}

function queueDiskWrite(): Promise<void> {
  writeChain = writeChain.then(async () => {
    if (pending === null || !IS_TAURI) return;
    const json = pending;
    pending = null;
    try {
      await invoke("save_state", { json });
      emit({ ok: true });
    } catch (e) {
      // Keep the payload so the next flush (blur/close/edit) retries it.
      if (pending === null) pending = json;
      emit({ ok: false, message: e instanceof Error ? e.message : String(e) });
    }
  });
  return writeChain;
}

// localStorage is written synchronously on every change — cheap, and it
// survives a hard quit that beats the disk debounce. The disk write is
// debounced so typing doesn't hammer the filesystem.
export function scheduleSave(state: AppState) {
  const json = JSON.stringify(toEnvelope(state));
  try {
    localStorage.setItem(LS_KEY, json);
  } catch {
    // storage full or unavailable — the disk write still happens
  }
  if (!IS_TAURI) return;
  pending = json;
  if (debounceTimer !== null) clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(() => {
    debounceTimer = null;
    void queueDiskWrite();
  }, SAVE_DEBOUNCE_MS);
}

export function flushSaves(): Promise<void> {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  return queueDiskWrite();
}

// Flush pending disk writes when the app loses focus or the window closes.
// Returns a cleanup function.
export function installAutoFlush(): () => void {
  const onBlur = () => void flushSaves();
  const onVisibility = () => {
    if (document.visibilityState === "hidden") void flushSaves();
  };
  window.addEventListener("blur", onBlur);
  document.addEventListener("visibilitychange", onVisibility);

  let unlisten: (() => void) | undefined;
  let disposed = false;
  if (IS_TAURI) {
    let closing = false;
    void (async () => {
      try {
        const { getCurrentWindow } = await import("@tauri-apps/api/window");
        const win = getCurrentWindow();
        const stop = await win.onCloseRequested(async (event) => {
          if (closing) return; // re-entry: let the close proceed
          closing = true;
          event.preventDefault();
          try {
            await flushSaves();
          } finally {
            void win.destroy();
          }
        });
        if (disposed) stop();
        else unlisten = stop;
      } catch {
        // window API unavailable (plain browser) — blur flushes still cover us
      }
    })();
  }

  return () => {
    disposed = true;
    window.removeEventListener("blur", onBlur);
    document.removeEventListener("visibilitychange", onVisibility);
    unlisten?.();
  };
}

// Returns false when the user cancels the save dialog.
export async function exportData(state: AppState): Promise<boolean> {
  const json = JSON.stringify(toEnvelope(state), null, 2);
  const suggestedName = `atelier-export-${new Date().toISOString().slice(0, 10)}.json`;
  return invoke<boolean>("export_data", { json, suggestedName });
}

// Returns null when the user cancels the open dialog; throws when the chosen
// file isn't a readable Atelier export.
export async function importData(): Promise<AppState | null> {
  const json = await invoke<string | null>("import_data");
  if (json == null) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error("not valid JSON");
  }
  const state = fromRaw(raw);
  if (!state) throw new Error("not a recognizable Atelier export");
  return state;
}

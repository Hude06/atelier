import { invoke } from "@tauri-apps/api/core";
import type { AppState } from "./types";
import { seedState } from "./data";
import { migrate, parsePersisted, toEnvelope } from "./migrations";
import { normalizeState } from "./validate";
import type { SalvageReport } from "./validate";

export const LS_KEY = "atelier.state.v1";
const SAVE_DEBOUNCE_MS = 500;

const IS_TAURI = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

type Candidate = { state: AppState; savedAt: number; report: SalvageReport };

// Runs the full parse → migrate → normalize pipeline on one persisted value.
function evaluate(json: string): Candidate | null {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return null;
  }
  const env = parsePersisted(raw);
  if (!env) return null;
  const migrated = migrate(env);
  if (!migrated) return null;
  const normalized = normalizeState(migrated.state);
  if (!normalized) return null;
  return { state: normalized.state, savedAt: migrated.savedAt, report: normalized.report };
}

export type InitResult = { state: AppState; notices: string[] };

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

// Load order: main disk file, disk backup (only when the main file is absent
// or unreadable), localStorage. The newest valid candidate wins — that's what
// makes the debounced disk write safe against a hard quit.
export async function initState(): Promise<InitResult> {
  const notices: string[] = [];
  const candidates: Candidate[] = [];
  let diskPresent = false;
  let diskValid = false;

  if (IS_TAURI) {
    try {
      const json = await invoke<string | null>("load_state");
      if (json != null) {
        diskPresent = true;
        const candidate = evaluate(json);
        if (candidate) {
          diskValid = true;
          candidates.push(candidate);
        }
      }
    } catch {
      // real I/O error — fall through to backup/localStorage
    }

    if (!diskValid) {
      try {
        const json = await invoke<string | null>("load_backup");
        if (json != null) {
          const candidate = evaluate(json);
          if (candidate) candidates.push(candidate);
        }
      } catch {
        // no backup available
      }
    }
  }

  try {
    const json = localStorage.getItem(LS_KEY);
    if (json) {
      const candidate = evaluate(json);
      if (candidate) candidates.push(candidate);
    }
  } catch {
    // localStorage unavailable
  }

  // Never silently discard an unreadable state file — set it aside.
  if (diskPresent && !diskValid) {
    let kept = "";
    try {
      const path = await invoke<string | null>("quarantine_state");
      const file = path?.split("/").pop();
      if (file) kept = ` A copy was kept at ${file}.`;
    } catch {
      // quarantine failed; the file stays where it is
    }
    notices.push(`Your saved data couldn't be read.${kept}`);
  }

  if (candidates.length === 0) {
    return { state: seedState(), notices };
  }

  candidates.sort((a, b) => b.savedAt - a.savedAt);
  const winner = candidates[0];

  const { droppedProjects, droppedColumns, droppedCards } = winner.report;
  if (droppedProjects + droppedColumns + droppedCards > 0) {
    const parts = [
      droppedProjects > 0 && plural(droppedProjects, "project"),
      droppedColumns > 0 && plural(droppedColumns, "column"),
      droppedCards > 0 && plural(droppedCards, "card"),
    ].filter(Boolean);
    notices.push(
      `Some saved data was unreadable and had to be dropped: ${parts.join(", ")}.`
    );
  }

  // Refresh the backup only from a validated main-file load — never from
  // localStorage or seed, which would clobber the last good disk snapshot.
  if (diskValid) {
    void invoke("backup_state").catch(() => {});
  }

  return { state: winner.state, notices };
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
  const candidate = evaluate(json);
  if (!candidate) throw new Error("not a recognizable Atelier export");
  return candidate.state;
}

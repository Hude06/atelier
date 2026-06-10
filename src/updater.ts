export type UpdateStatus =
  | "idle"
  | "checking"
  | "up-to-date"
  | "available"
  | "downloading"
  | "ready"
  | "error"
  | "install-error";

export interface UpdateInfo {
  version: string;
  notes?: string;
}

// Resolve the updater lazily so the app works in browser dev mode.
async function getUpdater() {
  try {
    return await import("@tauri-apps/plugin-updater");
  } catch {
    return null;
  }
}

async function getProcess() {
  try {
    return await import("@tauri-apps/plugin-process");
  } catch {
    return null;
  }
}

export interface Updater {
  status: UpdateStatus;
  info?: UpdateInfo;
  check: () => Promise<void>;
  install: () => Promise<void>;
}

let _pendingUpdate: Awaited<ReturnType<typeof import("@tauri-apps/plugin-updater")["check"]>> = null;

export async function checkForUpdate(): Promise<
  { status: "available"; info: UpdateInfo } | { status: "up-to-date" } | { status: "idle" }
> {
  const updater = await getUpdater();
  if (!updater) return { status: "idle" };

  const update = await updater.check();
  if (update?.available) {
    _pendingUpdate = update;
    return { status: "available", info: { version: update.version, notes: update.body ?? undefined } };
  }
  _pendingUpdate = null;
  return { status: "up-to-date" };
}

export async function downloadAndInstall(): Promise<void> {
  if (!_pendingUpdate) throw new Error("No pending update");
  await _pendingUpdate.downloadAndInstall();
  const process = await getProcess();
  if (process) await process.relaunch();
}

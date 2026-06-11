import { useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Board } from "./components/Board";
import { SettingsPage } from "./components/SettingsPage";
import { ToastRegion, useToasts } from "./components/Toast";
import {
  initState,
  scheduleSave,
  flushSaves,
  installAutoFlush,
  onSaveStatus,
  exportData,
  importData,
} from "./storage";
import type { InitResult } from "./storage";
import { seedState } from "./data";
import * as mutate from "./state";
import type { AppState, Project, Settings } from "./types";
import type { IconName } from "./icons";
import { checkForUpdate, downloadAndInstall } from "./updater";
import type { UpdateStatus, UpdateInfo } from "./updater";

type View = "board" | "settings";

export default function App() {
  const [initial, setInitial] = useState<InitResult | null>(null);

  useEffect(() => {
    initState().then(setInitial);
  }, []);

  // Blank (paper-colored) frame while the store loads — it's a few ms.
  if (!initial) return null;
  return <AppLoaded initial={initial.state} notices={initial.notices} />;
}

function AppLoaded({
  initial,
  notices,
}: {
  initial: AppState;
  notices: string[];
}) {
  const [state, setState] = useState<AppState>(initial);
  const [view, setView] = useState<View>("board");
  const [addingProject, setAddingProject] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>("idle");
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | undefined>();
  const [updateError, setUpdateError] = useState<string | undefined>();
  const { toasts, push, dismiss } = useToasts();

  // Skip the very first run — it would immediately re-save the state we just
  // loaded from disk.
  const firstSave = useRef(true);
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false;
      return;
    }
    scheduleSave(state);
  }, [state]);

  useEffect(() => installAutoFlush(), []);

  // Recovery notices from the load pipeline (quarantined file, dropped data).
  useEffect(() => {
    for (const notice of notices) {
      push({ kind: "danger", duration: 0, message: notice });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () =>
      onSaveStatus((s) => {
        if (s.ok) {
          dismiss("save-error");
        } else {
          push({
            id: "save-error",
            kind: "danger",
            duration: 0,
            message: `Couldn't save your data — changes are kept in this window. (${s.message})`,
          });
        }
      }),
    [push, dismiss]
  );

  // Resolve theme, following the OS when set to "system".
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const mode =
        state.settings.theme === "system"
          ? mq.matches
            ? "dark"
            : "light"
          : state.settings.theme;
      document.documentElement.dataset.theme = mode;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [state.settings.theme]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--accent",
      state.settings.accent
    );
  }, [state.settings.accent]);

  useEffect(() => {
    document.documentElement.dataset.density = state.settings.density;
  }, [state.settings.density]);

  // Single-slot snapshot undo for destructive actions, bounded by the
  // lifetime of its toast.
  const undoRef = useRef<AppState | null>(null);

  const performUndo = () => {
    const snapshot = undoRef.current;
    if (!snapshot) return;
    undoRef.current = null;
    setState(snapshot);
    dismiss("undo");
  };

  const destructive = (label: string, fn: (s: AppState) => AppState) => {
    setState((s) => {
      undoRef.current = s;
      return fn(s);
    });
    push({
      id: "undo",
      message: label,
      actionLabel: "Undo",
      duration: 6000,
      onAction: performUndo,
      onClose: () => {
        undoRef.current = null;
      },
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === ",") {
          e.preventDefault();
          setView("settings");
        } else if (e.key === "n") {
          e.preventDefault();
          setView("board");
          setAddingProject(true);
        } else if (e.key === "[") {
          e.preventDefault();
          setState((s) => mutate.cycleProject(s, -1));
          setView("board");
        } else if (e.key === "]") {
          e.preventDefault();
          setState((s) => mutate.cycleProject(s, 1));
          setView("board");
        } else if (e.key === "z" && !e.shiftKey) {
          // Text fields keep their native undo.
          const el = document.activeElement;
          const inEditor =
            el instanceof HTMLElement &&
            (el.tagName === "INPUT" ||
              el.tagName === "TEXTAREA" ||
              el.isContentEditable);
          if (!inEditor) {
            e.preventDefault();
            performUndo();
          }
        }
      } else if (e.key === "Escape") {
        setView((v) => (v === "settings" ? "board" : v));
        setAddingProject(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Check for updates once on launch (silent — only surfaces if one is found).
  useEffect(() => {
    checkForUpdate()
      .then((result) => {
        if (result.status === "available") {
          setUpdateStatus("available");
          setUpdateInfo(result.info);
        }
      })
      .catch(() => {});
  }, []);

  const active: Project = useMemo(
    () =>
      state.projects.find((p) => p.id === state.activeProjectId) ??
      state.projects[0],
    [state.projects, state.activeProjectId]
  );

  const selectProject = (id: string) => {
    setState((s) => mutate.selectProject(s, id));
    setView("board");
  };

  const addProject = (name: string, icon: IconName, color: string) => {
    setState((s) => mutate.addProject(s, name, icon, color));
    setView("board");
  };

  const editProjectAppearance = (id: string, icon: IconName, color: string) =>
    setState((s) => mutate.setProjectAppearance(s, id, icon, color));

  const renameProject = (id: string, name: string) =>
    setState((s) => mutate.renameProject(s, id, name));

  const deleteProject = (id: string) => {
    const name = state.projects.find((p) => p.id === id)?.name;
    destructive(name ? `Deleted “${name}”` : "Project deleted", (s) =>
      mutate.deleteProject(s, id)
    );
  };

  const renameColumn = (projectId: string, columnId: string, title: string) =>
    setState((s) => mutate.renameColumn(s, projectId, columnId, title));

  const addCard = (projectId: string, columnId: string, title: string) =>
    setState((s) => mutate.addCard(s, projectId, columnId, title));

  const updateCard = (
    projectId: string,
    columnId: string,
    cardId: string,
    title: string
  ) => setState((s) => mutate.updateCard(s, projectId, columnId, cardId, title));

  const deleteCard = (projectId: string, columnId: string, cardId: string) =>
    destructive("Card deleted", (s) =>
      mutate.deleteCard(s, projectId, columnId, cardId)
    );

  const moveCard = (
    projectId: string,
    fromColumnId: string,
    toColumnId: string,
    cardId: string,
    toIndex: number
  ) =>
    setState((s) =>
      mutate.moveCard(s, projectId, fromColumnId, toColumnId, cardId, toIndex)
    );

  const clearColumn = (projectId: string, columnId: string) => {
    const column = state.projects
      .find((p) => p.id === projectId)
      ?.columns.find((c) => c.id === columnId);
    const n = column?.cards.length ?? 0;
    if (n === 0) return;
    destructive(`Cleared ${n} card${n === 1 ? "" : "s"}`, (s) =>
      mutate.clearColumn(s, projectId, columnId)
    );
  };

  const updateSettings = (patch: Partial<Settings>) =>
    setState((s) => mutate.updateSettings(s, patch));

  const resetAll = () => {
    destructive("Everything was reset", () => seedState());
    setView("board");
  };

  const handleCheckUpdate = async () => {
    setUpdateStatus("checking");
    try {
      const result = await checkForUpdate();
      setUpdateStatus(result.status === "available" ? "available" : "up-to-date");
      if (result.status === "available") setUpdateInfo(result.info);
    } catch {
      setUpdateStatus("error");
    }
  };

  const handleExport = async () => {
    try {
      const saved = await exportData(state);
      if (saved) push({ message: "Exported your data." });
    } catch (e) {
      push({
        kind: "danger",
        message: `Export failed: ${e instanceof Error ? e.message : String(e)}`,
      });
    }
  };

  const handleImport = async () => {
    try {
      const imported = await importData();
      if (!imported) return; // user cancelled the dialog
      setState(imported);
      scheduleSave(imported);
      await flushSaves();
      setView("board");
      const n = imported.projects.length;
      push({ message: `Imported ${n} project${n === 1 ? "" : "s"}.` });
    } catch {
      push({
        kind: "danger",
        message: "That file doesn't look like an Atelier export.",
      });
    }
  };

  const handleInstallUpdate = async () => {
    setUpdateStatus("downloading");
    setUpdateError(undefined);
    try {
      await downloadAndInstall();
      setUpdateStatus("ready");
    } catch (e) {
      console.error("Update install failed:", e);
      setUpdateError(e instanceof Error ? e.message : String(e));
      setUpdateStatus("install-error");
    }
  };

  return (
    <div className="app">
      <Sidebar
        projects={state.projects}
        activeId={active.id}
        view={view}
        addOpen={addingProject}
        onAddOpenChange={setAddingProject}
        onSelect={selectProject}
        onAddProject={addProject}
        onEditProject={editProjectAppearance}
        onOpenSettings={() => setView("settings")}
      />
      <main className="main">
        {view === "board" ? (
          <Board
            key={active.id}
            project={active}
            showCounts={state.settings.showCounts}
            onRenameProject={(name) => renameProject(active.id, name)}
            onDeleteProject={() => deleteProject(active.id)}
            onClearColumn={(columnId) => clearColumn(active.id, columnId)}
            onRenameColumn={(columnId, title) =>
              renameColumn(active.id, columnId, title)
            }
            onAddCard={(columnId, title) => addCard(active.id, columnId, title)}
            onUpdateCard={(columnId, cardId, title) =>
              updateCard(active.id, columnId, cardId, title)
            }
            onDeleteCard={(columnId, cardId) =>
              deleteCard(active.id, columnId, cardId)
            }
            onMoveCard={(fromId, toId, cardId, index) =>
              moveCard(active.id, fromId, toId, cardId, index)
            }
          />
        ) : (
          <SettingsPage
            settings={state.settings}
            updateStatus={updateStatus}
            updateInfo={updateInfo}
            updateError={updateError}
            onChange={updateSettings}
            onResetAll={resetAll}
            onExport={handleExport}
            onImport={handleImport}
            onBack={() => setView("board")}
            onCheckUpdate={handleCheckUpdate}
            onInstallUpdate={handleInstallUpdate}
          />
        )}
      </main>
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

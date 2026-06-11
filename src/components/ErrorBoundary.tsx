import { Component } from "react";
import type { ReactNode } from "react";
import { invoke } from "@tauri-apps/api/core";
import { initState, exportData, LS_KEY } from "../storage";
import { toEnvelope } from "../migrations";
import { seedState } from "../data";

type Props = { children: ReactNode };
type State = { error: Error | null; confirmReset: boolean; exported: boolean };

// Last line of defense: a render error anywhere below lands here instead of
// white-screening the app, with a path to export the data on disk.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, confirmReset: false, exported: false };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("Atelier crashed:", error);
  }

  handleExport = async () => {
    try {
      // Re-reads the newest valid persisted state — works even though the
      // React tree below is dead.
      const { state } = await initState();
      const saved = await exportData(state);
      if (saved) this.setState({ exported: true });
    } catch (e) {
      console.error("Crash export failed:", e);
    }
  };

  handleReset = async () => {
    if (!this.state.confirmReset) {
      this.setState({ confirmReset: true });
      return;
    }
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // localStorage unavailable
    }
    try {
      await invoke("save_state", {
        json: JSON.stringify(toEnvelope(seedState())),
      });
    } catch {
      // not running in Tauri, or the write failed — reload regardless
    }
    location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="crash-screen">
        <div className="crash-card">
          <h1>Something went wrong</h1>
          <p>
            Atelier hit an unexpected error. Your data is safe on disk — you
            can export a copy, then try again.
          </p>
          <code>{this.state.error.message}</code>
          <div className="crash-actions">
            <button type="button" className="btn-primary" onClick={this.handleExport}>
              {this.state.exported ? "Exported ✓" : "Export my data"}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => this.setState({ error: null, confirmReset: false })}
            >
              Try again
            </button>
            <button
              type="button"
              className={`btn-danger${this.state.confirmReset ? " confirm" : ""}`}
              onClick={this.handleReset}
              onBlur={() => this.setState({ confirmReset: false })}
            >
              {this.state.confirmReset ? "Click again to confirm" : "Reset to defaults"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

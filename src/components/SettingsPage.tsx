import { useState, useEffect } from "react";
import type { Density, Settings, ThemeMode } from "../types";
import { Icon } from "../icons";
import { PALETTE } from "../data";
import type { UpdateStatus, UpdateInfo } from "../updater";

type Props = {
  settings: Settings;
  updateStatus: UpdateStatus;
  updateInfo?: UpdateInfo;
  updateError?: string;
  onChange: (patch: Partial<Settings>) => void;
  onResetAll: () => void;
  onExport: () => void;
  onImport: () => void;
  onBack: () => void;
  onCheckUpdate: () => void;
  onInstallUpdate: () => void;
};

export function SettingsPage({
  settings,
  updateStatus,
  updateInfo,
  updateError,
  onChange,
  onResetAll,
  onExport,
  onImport,
  onBack,
  onCheckUpdate,
  onInstallUpdate,
}: Props) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmImport, setConfirmImport] = useState(false);
  const [appVersion, setAppVersion] = useState("...");

  useEffect(() => {
    import("@tauri-apps/api/app")
      .then((m) => m.getVersion())
      .then(setAppVersion)
      .catch(() => setAppVersion("0.1.1"));
  }, []);

  return (
    <div className="settings-view">
      <div className="settings-bar" data-tauri-drag-region>
        <button type="button" className="btn-ghost back" onClick={onBack}>
          <Icon name="arrowLeft" size={14} />
          Board
        </button>
      </div>

      <div className="settings">
        <p className="overline">Preferences</p>
        <h1 className="settings-title">Settings</h1>

        <section className="settings-section">
          <h2 className="section-label">Appearance</h2>

          <div className="settings-row">
            <div>
              <p className="row-label">Theme</p>
              <p className="row-sub">How Atelier dresses for the day.</p>
            </div>
            <Segmented<ThemeMode>
              value={settings.theme}
              options={[
                { v: "light", label: "Light" },
                { v: "dark", label: "Dark" },
                { v: "system", label: "System" },
              ]}
              onChange={(theme) => onChange({ theme })}
            />
          </div>

          <div className="settings-row">
            <div>
              <p className="row-label">Accent</p>
              <p className="row-sub">Used for actions and highlights.</p>
            </div>
            <div className="swatch-row">
              {PALETTE.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`swatch${
                    c.value === settings.accent ? " selected" : ""
                  }`}
                  style={{ background: c.value }}
                  title={c.id}
                  onClick={() => onChange({ accent: c.value })}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2 className="section-label">Board</h2>

          <div className="settings-row">
            <div>
              <p className="row-label">Density</p>
              <p className="row-sub">How much breathing room cards get.</p>
            </div>
            <Segmented<Density>
              value={settings.density}
              options={[
                { v: "comfortable", label: "Comfortable" },
                { v: "compact", label: "Compact" },
              ]}
              onChange={(density) => onChange({ density })}
            />
          </div>

          <div className="settings-row">
            <div>
              <p className="row-label">Card counts</p>
              <p className="row-sub">Show how many cards sit in each list.</p>
            </div>
            <Toggle
              checked={settings.showCounts}
              onChange={(showCounts) => onChange({ showCounts })}
            />
          </div>
        </section>

        <section className="settings-section">
          <h2 className="section-label">Keyboard shortcuts</h2>

          <div className="shortcuts-grid">
            {[
              { keys: ["⌘", "N"], label: "New project" },
              { keys: ["⌘", "["], label: "Previous project" },
              { keys: ["⌘", "]"], label: "Next project" },
              { keys: ["⌘", ","], label: "Open settings" },
              { keys: ["⌘", "↵"], label: "Save card" },
              { keys: ["Esc"], label: "Cancel / close" },
            ].map(({ keys, label }) => (
              <div key={label} className="shortcut-row">
                <span className="shortcut-label">{label}</span>
                <span className="shortcut-keys">
                  {keys.map((k) => (
                    <kbd key={k}>{k}</kbd>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <h2 className="section-label">Updates</h2>

          <div className="settings-row">
            <div>
              <p className="row-label">
                {(updateStatus === "available" || updateStatus === "install-error") && updateInfo
                  ? `Version ${updateInfo.version} available`
                  : "Check for updates"}
              </p>
              <p className="row-sub">
                {updateStatus === "up-to-date" && "You're on the latest version."}
                {updateStatus === "available" && "A new version is ready to install."}
                {updateStatus === "downloading" && "Downloading update…"}
                {updateStatus === "ready" && "Update installed. Restart to apply."}
                {updateStatus === "error" && "Could not check for updates."}
                {updateStatus === "install-error" &&
                  `Could not install update${updateError ? `: ${updateError}` : "."}`}
                {(updateStatus === "idle" || updateStatus === "checking") &&
                  `Currently on version ${appVersion}.`}
              </p>
            </div>
            {(updateStatus === "available" || updateStatus === "install-error") ? (
              <button
                type="button"
                className="btn-primary"
                onClick={onInstallUpdate}
              >
                Install & Restart
              </button>
            ) : (
              <button
                type="button"
                className="btn-ghost"
                disabled={updateStatus === "checking" || updateStatus === "downloading"}
                onClick={onCheckUpdate}
              >
                {updateStatus === "checking" ? "Checking…" : "Check"}
              </button>
            )}
          </div>
        </section>

        <section className="settings-section">
          <h2 className="section-label">Data</h2>

          <div className="settings-row">
            <div>
              <p className="row-label">Export data</p>
              <p className="row-sub">Save all projects as a JSON file.</p>
            </div>
            <button type="button" className="btn-ghost" onClick={onExport}>
              Export…
            </button>
          </div>

          <div className="settings-row">
            <div>
              <p className="row-label">Import data</p>
              <p className="row-sub">
                Replace everything with a previously exported file.
              </p>
            </div>
            <button
              type="button"
              className={`btn-danger${confirmImport ? " confirm" : ""}`}
              onClick={() => {
                if (confirmImport) {
                  onImport();
                  setConfirmImport(false);
                } else {
                  setConfirmImport(true);
                }
              }}
              onBlur={() => setConfirmImport(false)}
            >
              {confirmImport ? "Click again to confirm" : "Import…"}
            </button>
          </div>

          <div className="settings-row">
            <div>
              <p className="row-label">Reset everything</p>
              <p className="row-sub">
                Deletes every project and card on this device.
              </p>
            </div>
            <button
              type="button"
              className={`btn-danger${confirmReset ? " confirm" : ""}`}
              onClick={() => {
                if (confirmReset) {
                  onResetAll();
                  setConfirmReset(false);
                } else {
                  setConfirmReset(true);
                }
              }}
              onBlur={() => setConfirmReset(false)}
            >
              {confirmReset ? "Click again to confirm" : "Reset"}
            </button>
          </div>
        </section>

        <footer className="settings-footer">
          <span className="brand-tile small" />
          Atelier {appVersion} — a quiet kanban board. Your data lives only on
          this device.
        </footer>
      </div>
    </div>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { v: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="segmented" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={o.v === value}
          className={`segment${o.v === value ? " on" : ""}`}
          onClick={() => onChange(o.v)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`toggle${checked ? " on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="knob" />
    </button>
  );
}

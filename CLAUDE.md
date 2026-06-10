# Atelier — Claude Instructions

## Project overview
Tauri v2 desktop app (macOS, Apple Silicon). React + TypeScript frontend (`src/`), Rust backend (`src-tauri/`). The app is a minimal kanban board called Atelier.

## Dev workflow
- `npm run dev` — Vite dev server only (browser preview, no Tauri)
- `npm run tauri dev` — full desktop app with hot reload
- `npm run build` — Vite production build (output: `dist/`)
- `npx tsc --noEmit` — type-check without building

## Release process (macOS aarch64)

**Do NOT read `.env`** — it contains Apple signing credentials. It is safe to `source .env` in shell commands.

The signing key lives at `~/.tauri/atelier.key` (no password — use `--password ""`).

### Steps to cut a new release

1. **Bump version** in both files (keep them in sync):
   - `src-tauri/tauri.conf.json` → `"version": "X.X.X"`
   - `src-tauri/Cargo.toml` → `version = "X.X.X"`

2. **Build** (loads Apple signing creds from `.env`):
   ```
   source .env && npm run tauri build
   ```
   Output: `src-tauri/target/release/bundle/dmg/Atelier_X.X.X_aarch64.dmg`

3. **Sign** the dmg for the updater:
   ```
   npx tauri signer sign \
     --private-key-path /Users/jude/.tauri/atelier.key \
     --password "" \
     src-tauri/target/release/bundle/dmg/Atelier_X.X.X_aarch64.dmg
   ```
   Output: `Atelier_X.X.X_aarch64.dmg.sig` alongside the dmg.

4. **Create `latest.json`** in the project root:
   ```json
   {
     "version": "X.X.X",
     "notes": "<release notes>",
     "pub_date": "YYYY-MM-DDT00:00:00Z",
     "platforms": {
       "darwin-aarch64": {
         "signature": "<contents of .sig file>",
         "url": "https://github.com/Hude06/atelier/releases/download/vX.X.X/Atelier_X.X.X_aarch64.dmg"
       }
     }
   }
   ```
   Read the signature with: `cat src-tauri/target/release/bundle/dmg/Atelier_X.X.X_aarch64.dmg.sig`

5. **Commit and push** the version bump:
   ```
   git add src-tauri/tauri.conf.json src-tauri/Cargo.toml
   git commit -m "Bump version to X.X.X"
   git push origin main
   ```

6. **Create the GitHub release**:
   ```
   gh release create vX.X.X \
     --title "Atelier X.X.X" \
     --notes "<release notes>" \
     src-tauri/target/release/bundle/dmg/Atelier_X.X.X_aarch64.dmg \
     latest.json \
     -R Hude06/atelier
   ```

The running app checks `https://github.com/Hude06/atelier/releases/latest/download/latest.json` on launch and prompts the user to update if the version is newer.

## Key files
- `src/components/Sidebar.tsx` — sidebar + add/edit project popovers
- `src/components/Board.tsx` — board header + drag-and-drop
- `src/components/Column.tsx` — column with card list
- `src/components/CardItem.tsx` — individual card
- `src/App.tsx` — root state management
- `src/types.ts` — TypeScript types (Project, Card, Column, Settings)
- `src/data.ts` — PALETTE, createProject, seedState
- `src/icons.tsx` — Icon component + PROJECT_GLYPHS list
- `src/styles.css` — all styles (no CSS modules)
- `src-tauri/tauri.conf.json` — app config, version, updater endpoint
- `src-tauri/Cargo.toml` — Rust version (must match tauri.conf.json)

# Atelier

A quiet kanban board, built with Tauri 2 + React + TypeScript.

Three lists per project — *To do*, *Working on*, *Completed* (click any title
to rename it). Projects live as glyphs in the left rail; add more with the
`+` at the bottom. Cards drag between lists. Everything is stored locally on
this device.

## Run

```sh
npm install
npm run tauri dev      # development (hot reload)
npm run tauri build    # production .app / .dmg
```

`⌘,` opens Settings (theme, accent, density, card counts, reset).

## Notes

- `dragDropEnabled: false` in `src-tauri/tauri.conf.json` is required —
  the macOS webview swallows HTML5 drag events otherwise.
- Fonts (Fraunces, Schibsted Grotesk) are bundled via Fontsource, so the app
  needs no network at all.
- State persists to disk on every change via tauri-plugin-store:
  `~/Library/Application Support/com.jude.atelier/atelier-state.json`.
  A timestamped `localStorage` copy is written synchronously as a backup;
  on launch the newer of the two wins, so quitting mid-write loses nothing.

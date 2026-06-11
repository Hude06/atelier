#!/usr/bin/env bash
# Cuts an Atelier release end to end: version bump (tauri.conf.json,
# Cargo.toml, package.json), signed build, latest.json, git push, GitHub
# release. Usage:
#
#   scripts/release.sh X.Y.Z
#   NOTES="What changed" scripts/release.sh X.Y.Z
#
# Requires: .env with Apple signing creds (sourced, never printed),
# ~/.tauri/atelier.key (or TAURI_SIGNING_PRIVATE_KEY set in .env), gh CLI.
set -euo pipefail

cd "$(dirname "$0")/.."

VERSION="${1:-}"
if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Usage: scripts/release.sh X.Y.Z" >&2
  exit 1
fi

if [[ -n "$(git status --porcelain -- src-tauri/tauri.conf.json src-tauri/Cargo.toml package.json latest.json)" ]]; then
  echo "Version files have uncommitted changes — commit or stash them first." >&2
  exit 1
fi

echo "==> Bumping version to $VERSION"
node -e '
  const fs = require("fs");
  const v = process.argv[1];
  for (const f of ["src-tauri/tauri.conf.json", "package.json"]) {
    const j = JSON.parse(fs.readFileSync(f, "utf8"));
    j.version = v;
    fs.writeFileSync(f, JSON.stringify(j, null, 2) + "\n");
  }
' "$VERSION"
perl -0pi -e 's/^version = "[^"]+"/version = "'"$VERSION"'"/m' src-tauri/Cargo.toml
npm install --package-lock-only --silent

echo "==> Building (signing creds from .env — never printed)"
# shellcheck disable=SC1091
source .env
export TAURI_SIGNING_PRIVATE_KEY="${TAURI_SIGNING_PRIVATE_KEY:-$HOME/.tauri/atelier.key}"
export TAURI_SIGNING_PRIVATE_KEY_PASSWORD="${TAURI_SIGNING_PRIVATE_KEY_PASSWORD-}"
npm run tauri build

BUNDLE=src-tauri/target/release/bundle
DMG="$BUNDLE/dmg/Atelier_${VERSION}_aarch64.dmg"
TARBALL="$BUNDLE/macos/Atelier_${VERSION}_aarch64.app.tar.gz"

echo "==> Renaming updater artifacts"
# Always ship the archive produced by tauri build — hand-rolled BSD tar
# embeds AppleDouble entries that break the updater's extractor.
cp "$BUNDLE/macos/Atelier.app.tar.gz" "$TARBALL"
cp "$BUNDLE/macos/Atelier.app.tar.gz.sig" "$TARBALL.sig"

for f in "$DMG" "$TARBALL" "$TARBALL.sig"; do
  [[ -f "$f" ]] || { echo "Missing artifact: $f" >&2; exit 1; }
done

echo "==> Writing latest.json"
NOTES="${NOTES:-Atelier $VERSION}"
node -e '
  const fs = require("fs");
  const [v, sigFile, notes] = process.argv.slice(1);
  fs.writeFileSync("latest.json", JSON.stringify({
    version: v,
    notes,
    pub_date: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
    platforms: {
      "darwin-aarch64": {
        signature: fs.readFileSync(sigFile, "utf8").trim(),
        url: `https://github.com/Hude06/atelier/releases/download/v${v}/Atelier_${v}_aarch64.app.tar.gz`,
      },
    },
  }, null, 2) + "\n");
' "$VERSION" "$TARBALL.sig" "$NOTES"

echo "==> Committing and pushing version bump"
git add src-tauri/tauri.conf.json src-tauri/Cargo.toml src-tauri/Cargo.lock \
  package.json package-lock.json latest.json
git commit -m "Bump version to $VERSION"
git push origin main

echo "==> Creating GitHub release v$VERSION"
gh release create "v$VERSION" \
  --title "Atelier $VERSION" \
  --notes "$NOTES" \
  "$DMG" "$TARBALL" latest.json \
  -R Hude06/atelier

echo "==> Done: https://github.com/Hude06/atelier/releases/tag/v$VERSION"

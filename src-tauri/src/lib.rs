use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};

use tauri::Manager;
use tauri_plugin_dialog::DialogExt;

const STATE_FILE: &str = "atelier-state.json";
const BACKUP_FILE: &str = "atelier-state.backup.json";

fn state_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    app.path().app_data_dir().map_err(|e| e.to_string())
}

// Write via a temp file in the same directory + rename, so a crash mid-write
// can never corrupt the existing file (rename is atomic on APFS).
fn atomic_write(path: &Path, data: &[u8]) -> Result<(), String> {
    let tmp = path.with_extension("tmp");
    let mut file = fs::File::create(&tmp).map_err(|e| e.to_string())?;
    file.write_all(data).map_err(|e| e.to_string())?;
    file.sync_all().map_err(|e| e.to_string())?;
    fs::rename(&tmp, path).map_err(|e| e.to_string())
}

// Ok(None) when the file doesn't exist; Err only on real I/O failures.
// The frontend's fallback chain relies on this distinction.
fn read_optional(path: &Path) -> Result<Option<String>, String> {
    match fs::read_to_string(path) {
        Ok(contents) => Ok(Some(contents)),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
fn load_state(app: tauri::AppHandle) -> Result<Option<String>, String> {
    read_optional(&state_dir(&app)?.join(STATE_FILE))
}

#[tauri::command]
fn load_backup(app: tauri::AppHandle) -> Result<Option<String>, String> {
    read_optional(&state_dir(&app)?.join(BACKUP_FILE))
}

#[tauri::command]
fn save_state(app: tauri::AppHandle, json: String) -> Result<(), String> {
    let dir = state_dir(&app)?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    atomic_write(&dir.join(STATE_FILE), json.as_bytes())
}

#[tauri::command]
fn backup_state(app: tauri::AppHandle) -> Result<(), String> {
    let dir = state_dir(&app)?;
    fs::copy(dir.join(STATE_FILE), dir.join(BACKUP_FILE))
        .map(|_| ())
        .map_err(|e| e.to_string())
}

// Sets aside an unreadable state file so the user's data is never silently
// discarded. Returns the quarantine path for display in the UI.
#[tauri::command]
fn quarantine_state(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let dir = state_dir(&app)?;
    let src = dir.join(STATE_FILE);
    if !src.exists() {
        return Ok(None);
    }
    let ts = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_secs();
    let dest = dir.join(format!("atelier-state.corrupt-{ts}.json"));
    fs::copy(&src, &dest).map_err(|e| e.to_string())?;
    Ok(Some(dest.to_string_lossy().into_owned()))
}

// async so the blocking dialog calls run off the main thread (a blocking
// dialog on the macOS main thread deadlocks). Ok(false) = user cancelled.
#[tauri::command]
async fn export_data(
    app: tauri::AppHandle,
    json: String,
    suggested_name: String,
) -> Result<bool, String> {
    let picked = app
        .dialog()
        .file()
        .add_filter("JSON", &["json"])
        .set_file_name(&suggested_name)
        .blocking_save_file();
    match picked {
        Some(path) => {
            let path = path.into_path().map_err(|e| e.to_string())?;
            atomic_write(&path, json.as_bytes())?;
            Ok(true)
        }
        None => Ok(false),
    }
}

// Ok(None) = user cancelled. Validation happens on the frontend.
#[tauri::command]
async fn import_data(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let picked = app
        .dialog()
        .file()
        .add_filter("JSON", &["json"])
        .blocking_pick_file();
    match picked {
        Some(path) => {
            let path = path.into_path().map_err(|e| e.to_string())?;
            fs::read_to_string(&path).map(Some).map_err(|e| e.to_string())
        }
        None => Ok(None),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            load_state,
            load_backup,
            save_state,
            backup_state,
            quarantine_state,
            export_data,
            import_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

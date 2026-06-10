use std::fs;
use tauri::Manager;

#[tauri::command]
fn load_state(app: tauri::AppHandle) -> Option<String> {
    let path = app.path().app_data_dir().ok()?.join("atelier-state.json");
    fs::read_to_string(path).ok()
}

#[tauri::command]
fn save_state(app: tauri::AppHandle, json: String) {
    if let Ok(dir) = app.path().app_data_dir() {
        let _ = fs::create_dir_all(&dir);
        let _ = fs::write(dir.join("atelier-state.json"), json);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![load_state, save_state])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

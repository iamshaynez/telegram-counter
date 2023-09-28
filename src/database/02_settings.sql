DROP TABLE IF EXISTS settings;
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_name TEXT NOT NULL,
    setting_value INTEGER NOT NULL,
    setting_comment TEXT
);
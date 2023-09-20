DROP TABLE IF EXISTS count_log;
CREATE TABLE IF NOT EXISTS count_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    count_name TEXT NOT NULL,
    count_type TEXT,
    count_value INTEGER NOT NULL,
    count_date DATE NOT NULL
);
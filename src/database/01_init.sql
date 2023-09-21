DROP TABLE IF EXISTS count_log;
CREATE TABLE IF NOT EXISTS count_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    count_name TEXT NOT NULL,
    count_type TEXT NOT NULL,
    count_value INTEGER NOT NULL,
    count_date DATE NOT NULL,
    count_comment TEXT
);

DROP TABLE IF EXISTS count_goal;
CREATE TABLE IF NOT EXISTS count_goal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    count_name TEXT NOT NULL,
    goal_comment TEXT,
    goal_value INTEGER NOT NULL
);
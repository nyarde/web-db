CREATE TABLE IF NOT EXISTS games (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    title     TEXT NOT NULL,
    genre     TEXT NOT NULL,
    platforms TEXT NOT NULL,
    year      INTEGER
);
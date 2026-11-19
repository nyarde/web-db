PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE games (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    title     TEXT NOT NULL,
    genre     TEXT NOT NULL,
    platforms TEXT NOT NULL,
    year      INTEGER
);
INSERT INTO games VALUES(1,'Hollow Knight','Metroidvania','Windows;Linux;Mac',2017);
INSERT INTO games VALUES(2,'Hollow Knight: Silksong','Metroidvania','Windows;Linux;Mac',2025);
INSERT INTO games VALUES(4,'Deltarune','RPG','Windows;Mac',2025);
INSERT INTO games VALUES(5,'Minecraft','Sandbox','Windows;Linux;Mac',2009);
INSERT INTO games VALUES(6,'Undertale','RPG','Windows;Linux;Mac',2015);
INSERT INTO games VALUES(7,'Minecraft Dungeons','Dungeon Crawler','Windows',2021);
INSERT INTO games VALUES(8,'Minecraft Dungeons II','Dungeon Crawler','Windows',2026);
INSERT INTO games VALUES(9,'The Forest','Survival Horror','Windows',2018);
INSERT INTO games VALUES(10,'Sons of the Forest','Survival Horror','Windows',2024);
PRAGMA writable_schema=ON;
CREATE TABLE IF NOT EXISTS sqlite_sequence(name,seq);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('games',10);
serde_json = "1.0.154"
PRAGMA writable_schema=OFF;
COMMIT;

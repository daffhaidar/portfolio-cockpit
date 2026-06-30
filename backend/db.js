// SQLite layer — real persistence for the Black Box guestbook + telemetry counter.
import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "data");
mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, "cockpit.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS guestbook (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    callsign  TEXT NOT NULL,
    message   TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS counters (
    key   TEXT PRIMARY KEY,
    value INTEGER NOT NULL DEFAULT 0
  );
  INSERT OR IGNORE INTO counters (key, value) VALUES ('visits', 1289);
`);

// --- Telemetry (visitor counter) ---
const _bumpVisits = db.prepare(
  "UPDATE counters SET value = value + 1 WHERE key = 'visits'"
);
const _getVisits = db.prepare("SELECT value FROM counters WHERE key = 'visits'");

export function bumpVisits() {
  _bumpVisits.run();
  return _getVisits.get().value;
}
export function getVisits() {
  return _getVisits.get().value;
}

// --- Guestbook ---
const _insertEntry = db.prepare(
  "INSERT INTO guestbook (callsign, message) VALUES (?, ?)"
);
const _recentEntries = db.prepare(
  "SELECT id, callsign, message, created_at FROM guestbook ORDER BY id DESC LIMIT ?"
);
const _countEntries = db.prepare("SELECT COUNT(*) AS n FROM guestbook");

export function addEntry(callsign, message) {
  const info = _insertEntry.run(callsign, message);
  return _recentEntries.get
    ? db
        .prepare(
          "SELECT id, callsign, message, created_at FROM guestbook WHERE id = ?"
        )
        .get(info.lastInsertRowid)
    : null;
}
export function recentEntries(limit = 25) {
  return _recentEntries.all(Math.min(limit, 100));
}
export function countEntries() {
  return _countEntries.get().n;
}

// Seed a couple of entries on first boot so the Black Box is never empty.
if (countEntries() === 0) {
  _insertEntry.run("ATC-JKT", "Cleared for takeoff. Tailwinds, Daffa.");
  _insertEntry.run("ground-crew", "Six years on the apron. Respect.");
}

export default db;

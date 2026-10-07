import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

/**
 * Local SQLite database, created and migrated automatically on first run.
 * This guarantees the demo works from a completely fresh checkout with no
 * manual database setup — `npm run dev` / `npm run build` is enough.
 */
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "jansahayak.db");

declare global {
  var __jansahayakDb: InstanceType<typeof Database> | undefined;
}

function createConnection() {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS saved_applications (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      scheme_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Saved',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(client_id, scheme_id)
    );

    CREATE TABLE IF NOT EXISTS profiles (
      client_id TEXT PRIMARY KEY,
      profile_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  return db;
}

export function getDb() {
  if (!global.__jansahayakDb) {
    global.__jansahayakDb = createConnection();
  }
  return global.__jansahayakDb;
}

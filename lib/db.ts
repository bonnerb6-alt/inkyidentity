import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'inkyidentity.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id               TEXT PRIMARY KEY,
      display_id       TEXT UNIQUE NOT NULL,
      username         TEXT UNIQUE NOT NULL,
      email            TEXT UNIQUE NOT NULL,
      password         TEXT NOT NULL,
      bio              TEXT DEFAULT '',
      avatar_url       TEXT DEFAULT '',
      theme            TEXT DEFAULT 'default',
      whatsapp_number  TEXT DEFAULT '',
      whatsapp_enabled INTEGER DEFAULT 0,
      created_at       INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS links (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      url         TEXT NOT NULL,
      icon        TEXT DEFAULT '',
      position    INTEGER DEFAULT 0,
      active      INTEGER DEFAULT 1,
      created_at  INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS orders (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      prodigi_id    TEXT DEFAULT '',
      size          TEXT NOT NULL,
      quantity      INTEGER DEFAULT 1,
      address_line1 TEXT NOT NULL,
      address_line2 TEXT DEFAULT '',
      city          TEXT NOT NULL,
      postcode      TEXT NOT NULL,
      country       TEXT NOT NULL,
      status        TEXT DEFAULT 'pending',
      created_at    INTEGER DEFAULT (unixepoch())
    );
  `);

  // Migrate: add product_type and variant columns to orders
  const orderCols = db.prepare("PRAGMA table_info(orders)").all() as { name: string }[];
  const orderColNames = orderCols.map(c => c.name);
  if (!orderColNames.includes('product_type')) {
    db.exec("ALTER TABLE orders ADD COLUMN product_type TEXT DEFAULT 'tattoo'");
  }
  if (!orderColNames.includes('variant')) {
    db.exec("ALTER TABLE orders ADD COLUMN variant TEXT DEFAULT ''");
  }

  // Password reset tokens
  db.exec(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token      TEXT UNIQUE NOT NULL,
      expires_at INTEGER NOT NULL,
      used       INTEGER DEFAULT 0
    );
  `);

  // Migrate: add is_admin column
  const userCols2 = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
  if (!userCols2.map(c => c.name).includes('is_admin')) {
    db.exec("ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0");
  }

  // Migrate: add whatsapp columns to existing databases
  const cols = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
  const colNames = cols.map(c => c.name);
  if (!colNames.includes('whatsapp_number')) {
    db.exec("ALTER TABLE users ADD COLUMN whatsapp_number TEXT DEFAULT ''");
  }
  if (!colNames.includes('whatsapp_enabled')) {
    db.exec("ALTER TABLE users ADD COLUMN whatsapp_enabled INTEGER DEFAULT 0");
  }
}

export default getDb;

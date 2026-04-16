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

  // Products catalogue (admin-managed)
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id                     TEXT PRIMARY KEY,
      name                   TEXT NOT NULL,
      tagline                TEXT DEFAULT '',
      icon_type              TEXT DEFAULT '◎',
      option_label           TEXT DEFAULT 'Size',
      has_colour             INTEGER DEFAULT 0,
      prodigi_sku            TEXT DEFAULT '',
      prodigi_print_location TEXT DEFAULT 'default',
      enabled                INTEGER DEFAULT 1,
      sort_order             INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_options (
      id           TEXT NOT NULL,
      product_id   TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      label        TEXT NOT NULL,
      detail       TEXT DEFAULT '',
      price_pence  INTEGER NOT NULL,
      prodigi_sku  TEXT DEFAULT '',
      sort_order   INTEGER DEFAULT 0,
      PRIMARY KEY (id, product_id)
    );

    CREATE TABLE IF NOT EXISTS product_colours (
      id         TEXT NOT NULL,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      label      TEXT NOT NULL,
      hex        TEXT DEFAULT '#888888',
      PRIMARY KEY (id, product_id)
    );
  `);

  // Seed default products once if the table is empty
  const { n: productCount } = db.prepare('SELECT COUNT(*) as n FROM products').get() as { n: number };
  if (productCount === 0) {
    const insProduct = db.prepare(
      'INSERT INTO products (id,name,tagline,icon_type,option_label,has_colour,prodigi_sku,prodigi_print_location,enabled,sort_order) VALUES (?,?,?,?,?,?,?,?,1,?)'
    );
    const insOption = db.prepare(
      'INSERT INTO product_options (id,product_id,label,detail,price_pence,prodigi_sku,sort_order) VALUES (?,?,?,?,?,?,?)'
    );
    const insColour = db.prepare(
      'INSERT INTO product_colours (id,product_id,label,hex) VALUES (?,?,?,?)'
    );

    insProduct.run('tattoo','QR Tattoo Sticker','Permanent ink. Dynamic profile.','tattoo','Size',0,'GLOBAL-TATT-M','default',0);
    insOption.run('5x5cm',  'tattoo','5 × 5 cm',  'Wrist / ankle',      1200,'GLOBAL-TATT-S',0);
    insOption.run('8x8cm',  'tattoo','8 × 8 cm',  'Forearm / shoulder', 1600,'GLOBAL-TATT-M',1);
    insOption.run('12x12cm','tattoo','12 × 12 cm','Back / chest',       2200,'GLOBAL-TATT-L',2);

    insProduct.run('mug','Ceramic Mug','QR printed on an 11oz ceramic mug.','mug','Size',0,'GLOBAL-MUG','default',1);
    insOption.run('one-size','mug','11oz Mug','Standard ceramic, dishwasher safe',1800,'',0);

    insProduct.run('tshirt','T-Shirt','QR printed on the left chest.','tshirt','Size',1,'GLOBAL-TEE-GIL-64000','left_chest',2);
    ([ ['XS','XS','Chest 32–34"',2400], ['S','S','Chest 35–37"',2400], ['M','M','Chest 38–40"',2400],
       ['L','L','Chest 41–43"',2400],  ['XL','XL','Chest 44–46"',2400], ['XXL','XXL','Chest 47–49"',2600],
    ] as [string,string,string,number][]).forEach(([id,label,detail,price],i) => insOption.run(id,'tshirt',label,detail,price,'',i));
    insColour.run('black','tshirt','Black','#111111');
    insColour.run('white','tshirt','White','#f9fafb');
    insColour.run('navy', 'tshirt','Navy', '#1e3a5f');
    insColour.run('grey', 'tshirt','Grey', '#6b7280');
  }
}

export default getDb;

/**
 * Creates the required database tables if they do not already exist.
 *
 * Tables created:
 * - `ads` — property listings with optional numeric fields (price, bedrooms, etc.)
 *   and a JSON-serialised `features` array stored as TEXT.
 *
 * @param {import('better-sqlite3').Database} db - Open database connection
 * @returns {void}
 */
function createTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ads (
      id            INTEGER  PRIMARY KEY AUTOINCREMENT,
      title         TEXT     NOT NULL,
      type          TEXT     NOT NULL,
      property_type TEXT     NOT NULL,
      area_text     TEXT     NOT NULL,
      place_id      TEXT     NOT NULL,
      price         REAL,
      bedrooms      INTEGER,
      bathrooms     INTEGER,
      levels        INTEGER,
      size_sqm      REAL,
      features      TEXT     NOT NULL DEFAULT '[]',
      description   TEXT,
      created_at    TEXT     NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

module.exports = { createTables };
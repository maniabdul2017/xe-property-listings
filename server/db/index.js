const Database = require("better-sqlite3");
const path = require("path");
const { createTables } = require("./schema.js");


/** SQLite database file path (can be overridden with DB_PATH env var). */
const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "..", "ads.db");

let db;

/**
 * Returns a shared SQLite connection.
 * Creates the database and tables on first call.
 */

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    createTables(db);
  }
  return db;
}
/** Closes the database connection (mainly for tests / shutdown). */
function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDb, closeDb };
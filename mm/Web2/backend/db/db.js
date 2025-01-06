const Database = require("better-sqlite3");
const path = require("path");

// Absoluter Pfad zur SQLite-Datenbank
const dbPath = path.resolve(__dirname, "db.sqlite");

// Optionen für die Verbindung
const dbOptions = { verbose: console.log };

// Verbindung zur SQLite-Datenbank herstellen
const dbConnection = new Database(dbPath, dbOptions);

// Initialisierung der Datenbank
function initializeDatabase() {
  // Tabellen erstellen, falls sie nicht existieren
  dbConnection.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vorname TEXT NOT NULL,
      nachname TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Datenbank erfolgreich initialisiert.");
}

// Datenbank initialisieren
initializeDatabase();

// Datenbankverbindung exportieren
module.exports = dbConnection;
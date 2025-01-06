const Database = require("better-sqlite3");
const path = require("path");

// Absoluter Pfad zur SQLite-Datenbank
const dbPath = path.resolve(__dirname, "db.sqlite");

// Optionen für die Verbindung
const dbOptions = { verbose: console.log };

// Verbindung zur SQLite-Datenbank herstellen
<<<<<<< HEAD
const db = new sqlite3.Database('./db/db.sqlite', (err) => {
    if (err) {
        console.error('Fehler beim Verbinden mit der Datenbank:', err.message);
    } else {
        console.log('Verbunden mit der SQLite-Datenbank.');
    }
});
=======
const dbConnection = new Database(dbPath, dbOptions);
>>>>>>> 6f13871e4e2a50aa19eab902a2dacd045dac58a1

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
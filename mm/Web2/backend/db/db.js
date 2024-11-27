const sqlite3 = require('sqlite3').verbose();

// Verbindung zur SQLite-Datenbank herstellen
const db = new sqlite3.Database('./db.sqlite', (err) => {
    if (err) {
        console.error('Fehler beim Verbinden mit der Datenbank:', err.message);
    } else {
        console.log('Verbunden mit der SQLite-Datenbank.');
    }
});

// Benutzer-Tabelle erstellen (falls nicht vorhanden)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vorname TEXT NOT NULL,
            nachname TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Fehler beim Erstellen der Tabelle:', err.message);
        } else {
            console.log('Benutzer-Tabelle erfolgreich erstellt.');
        }
    });
});

module.exports = db;

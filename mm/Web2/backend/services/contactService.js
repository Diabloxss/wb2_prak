const express = require("express");
const router = express.Router();
const dbConnection = require("../db/db"); // Verbindung zur Datenbank importieren

router.post("/contact", (req, res) => {
    const { name, surname, email, message } = req.body;

    // Eingabewerte prüfen
    if (!name || !surname || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Alle Felder sind erforderlich!",
        });
    }

    // E-Mail-Format validieren
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Ungültige E-Mail-Adresse!",
        });
    }

    const sql = `
        INSERT INTO contact_messages (name, surname, email, message)
        VALUES (?, ?, ?, ?)
    `;
    const params = [name, surname, email, message];

    try {
        const stmt = dbConnection.prepare(sql); // Statement vorbereiten
        const result = stmt.run(params); // Statement ausführen
        console.log("Nachricht erfolgreich gespeichert. ID:", result.lastInsertRowid);

        // Erfolgsantwort senden
        res.status(200).json({
            success: true,
            message: "Nachricht erfolgreich gespeichert!",
            id: result.lastInsertRowid, // Rückgabe der ID
        });
    } catch (err) {
        console.error("Fehler beim Speichern der Nachricht:", err.message);

        // Fehlerantwort senden
        res.status(500).json({
            success: false,
            message: "Fehler beim Speichern der Nachricht. Bitte versuchen Sie es später erneut.",
        });
    }
});

module.exports = router;
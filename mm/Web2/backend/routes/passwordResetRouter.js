const express = require('express');
const router = express.Router();

// Passwort-Reset-Endpunkt
router.post('/password-reset', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email ist erforderlich.' });
    }

    console.log(`Simulierte Email an: ${email}`);
    res.status(200).json({ message: 'Simulierte Email gesendet.' });
});

module.exports = router;

const express = require('express');
const userService = require('../services/userService');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { vorname, nachname, email, password } = req.body;
        const userId = await userService.registerUser(vorname, nachname, email, password);
        res.status(201).json({ id: userId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUser(email, password);
        res.status(200).json({ message: 'Login erfolgreich', user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

module.exports = router;

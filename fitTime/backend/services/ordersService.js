const express = require('express');
const OrdersDao = require('../dao/ordersDao.js');
const helper = require('../helper.js');

const serviceRouter = express.Router();

serviceRouter.post('/orders', (req, res) => {
    const db = req.app.locals.dbConnection;
    const ordersDao = new OrdersDao(db);

    try {
        const { guest, items, totalPrice } = req.body;

        if (!guest || !items || !totalPrice || !Array.isArray(items)) {
            res.status(400).json({ error: 'Invalid request data' });
            return;
        }

        // Gast speichern
        const guestDao = new (require('../dao/guestsDao.js'))(db);
        const savedGuest = guestDao.create(
            guest.vorname,
            guest.nachname,
            guest.email,
            guest.street,
            guest.zip_code,
            guest.city
        );

        // Bestellung speichern
        const order = ordersDao.createOrder(savedGuest.id, totalPrice);

        // Bestellitems speichern
        items.forEach(item => {
            db.prepare('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)')
                .run([order.id, item.id, item.quantity]);
        });

        res.status(201).json({ orderId: order.id, guest: savedGuest, items, totalPrice });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = serviceRouter;

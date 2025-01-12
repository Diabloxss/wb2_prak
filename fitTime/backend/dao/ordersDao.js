const helper = require('../helper.js');

class OrdersDao {
    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    createOrder(guestId, totalPrice) {
        const sql = `
            INSERT INTO orders (guest_id, total_price) 
            VALUES (?, ?)
        `;
        const statement = this._conn.prepare(sql);
        const result = statement.run([guestId, totalPrice]);

        if (result.changes !== 1) 
            throw new Error('Error creating order');

        return this.loadById(result.lastInsertRowid);
    }

    loadById(id) {
        const sql = `
            SELECT o.*, g.vorname, g.nachname, g.email 
            FROM orders o
            LEFT JOIN guests g ON o.guest_id = g.id
            WHERE o.id = ?
        `;
        const statement = this._conn.prepare(sql);
        const result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No order found for id=' + id);

        return result;
    }

    loadAll() {
        const sql = `
            SELECT o.*, g.vorname, g.nachname, g.email 
            FROM orders o
            LEFT JOIN guests g ON o.guest_id = g.id
        `;
        const statement = this._conn.prepare(sql);
        const result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        return result;
    }
}

module.exports = OrdersDao;

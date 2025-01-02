const helper = require('../helper.js');

class GuestsDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    // Load guest by ID
    loadById(id) {
        const sql = 'SELECT * FROM guests WHERE id=?';
        const statement = this._conn.prepare(sql);
        const result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Guest found by id=' + id);

        return result;
    }

    // Load all guests
    loadAll() {
        const sql = 'SELECT * FROM guests';
        const statement = this._conn.prepare(sql);
        const result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        return result;
    }

    // Check if guest exists by ID
    exists(id) {
        const sql = 'SELECT COUNT(id) AS cnt FROM guests WHERE id=?';
        const statement = this._conn.prepare(sql);
        const result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    // Create a new guest
    create(vorname, nachname, email, street, zip_code, city) {
        const sql = `
            INSERT INTO guests (vorname, nachname, email, street, zip_code, city) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const statement = this._conn.prepare(sql);
        const result = statement.run(vorname, nachname, email, street, zip_code, city);

        if (result.changes !== 1) 
            throw new Error('Could not insert new Guest. Data: ' + [vorname, nachname, email, street, zip_code, city]);

        return this.loadById(result.lastInsertRowid);
    }

    // Delete a guest by ID
    delete(id) {
        const sql = 'DELETE FROM guests WHERE id=?';
        const statement = this._conn.prepare(sql);
        const result = statement.run(id);

        if (result.changes !== 1) 
            throw new Error('Could not delete Guest by id=' + id);

        return true;
    }

    toString() {
        console.log('GuestsDao [_conn=' + this._conn + ']');
    }
}

module.exports = GuestsDao;

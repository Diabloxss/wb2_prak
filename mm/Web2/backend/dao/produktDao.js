const helper = require('../helper.js');



class ProduktDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }


    loadById(id) {
        
        var sql = 'SELECT * FROM products WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

 
        return result;
    
    }
    
    loadAll() {

        var sql = 'SELECT * FROM products';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];



        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(id) AS cnt FROM products WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(name, description = '', price = 0.0, image_url = '') {
        var sql = 'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)';
        var statement = this._conn.prepare(sql);
        var params = [name, description, price, image_url];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        return this.loadById(result.lastInsertRowid);
    }

    update(id, name, description = '', price = 0.0, image_url = '') {
        var sql = 'UPDATE products SET name=?, description=?, price=?, image_url=? WHERE id=?';
        var statement = this._conn.prepare(sql);
        var params = [name, description, price, image_url, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not update existing Record. Data: ' + params);

        return this.loadById(id);
    }

    delete(id) {
        var sql = 'DELETE FROM products WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.run(id);

        if (result.changes != 1) 
            throw new Error('Could not delete Record by id=' + id);

        return true;
    }
 


    toString() {
        console.log('ProduktDao [_conn=' + this._conn + ']');
    }
}

module.exports = ProduktDao;






















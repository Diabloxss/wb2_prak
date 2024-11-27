const helper = require('../helper.js');
const ProduktbildDao = require('./produktbildDao.js');


class ProduktDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }


    loadById(id) {
        const produktbildDao = new ProduktbildDao(this._conn);
        
        var sql = 'SELECT * FROM products WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        else {
            console.log('..');

        }

        
        return result;
    
    }
    
    loadAll() {
        const produktbildDao = new ProduktbildDao(this._conn);

        var sql = 'SELECT * FROM products';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        for (var i = 0; i < result.length; i++) {
            
            result[i].bilder = produktbildDao.loadByParent(result[i].id);


        }
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

    create(nameID = 1, description = '', price = 0.0, image_url = []) {
        const produktbildDao = new ProduktbildDao(this._conn);

        var sql = 'INSERT INTO Produkt (nameID,description,price) VALUES (?,?,?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [nameID, description, price];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        if (bilder.length > 0) {
            for (var element of image_url) {
                produktbildDao.create(element.bildpfad, result.lastInsertRowid);
            }
        }

        return this.loadById(result.lastInsertRowid);
    }

    update(id, nameID = 1, description = '', price = 0.0, image_url = []) {
        const produktbildDao = new ProduktbildDao(this._conn);
        produktbildDao.deleteByParent(id);

        var sql = 'UPDATE Produkt SET nameID=?,description=?,price=? WHERE id=?';
        var statement = this._conn.prepare(sql);
        var params = [nameID, description, price, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not update existing Record. Data: ' + params);

        if (image_url.length > 0) {
            for (var element of image_url) {
                produktbildDao.create(element.bildpfad, id);
            }
        }

        return this.loadById(id);
    }


    delete(id) {
        try {
            const produktbildDao = new ProduktbildDao(this._conn);
            produktbildDao.deleteByParent(id);

            var sql = 'DELETE FROM Products WHERE id=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error('Could not delete Record by id=' + id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message);

    
        }
    }


    toString() {
        console.log('ProduktDao [_conn=' + this._conn + ']');
    }
}

module.exports = ProduktDao;






















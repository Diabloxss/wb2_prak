const db = require('../db/db');

class UserDao {
    createUser(vorname, nachname, email, hashedPassword) {
        const sql = 'INSERT INTO users (vorname, nachname, email, password) VALUES (?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.run(sql, [vorname, nachname, email, hashedPassword], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    findUserByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        return new Promise((resolve, reject) => {
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}

module.exports = new UserDao();

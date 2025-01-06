const helper = require("../helper.js");
const dbConnection = require("../db/db");

class KontaktformularDao {
  constructor() {
    this._conn = dbConnection;
  }

  create(name, surname, email, message) {
    const sql = `
      INSERT INTO contact_messages (name, surname, email, message)
      VALUES (?, ?, ?, ?)
    `;
    const statement = this._conn.prepare(sql);
    const result = statement.run(name, surname, email, message);
    return result.lastInsertRowid;
  }

  getAllMessages() {
    const sql = "SELECT * FROM contact_messages ORDER BY created_at DESC";
    const statement = this._conn.prepare(sql);
    return statement.all();
  }

  toString() {
    return `KontaktformularDao connected to ${this._conn}`;
  }
}

module.exports = KontaktformularDao;

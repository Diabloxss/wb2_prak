module.exports = {
    getFilteredProducts: (db, minPrice = 0, maxPrice = 1000, search = "") => {
        const query = `
            SELECT * FROM products
            WHERE price BETWEEN ? AND ?
            AND name LIKE ?
        `;
        const params = [minPrice, maxPrice, `%${search}%`];
        return db.prepare(query).all(...params);
    }
};

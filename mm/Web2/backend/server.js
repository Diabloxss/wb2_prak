

/////////////////////
// TESTED ON NodeJS 22.11.0 
/////////////////////


const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Database = require("better-sqlite3");
const path = require("path");
const produktDao = require("./dao/produktDao.js");
const cors = require("cors");




const app = express();
const PORT = 8000;


app.use(cors());

// Database connection
const db = new Database("./db/db.sqlite", { verbose: console.log });
app.locals.db = db;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.get("/api/products", (req, res) => {
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || 1000;
    const search = req.query.search || "";

    const products = db.prepare(`
        SELECT * FROM products
        WHERE price BETWEEN ? AND ?
        AND name LIKE ?
    `).all(minPrice, maxPrice, `%${search}%`);

    res.json(products);
});


// Serve Shop Page
app.get("/shop", (req, res) => {
    res.sendFile(path.join(__dirname, "shop.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

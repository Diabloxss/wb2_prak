/////////////////////
// TESTED ON NodeJS 22.11.0 
/////////////////////
const helper = require('./helper.js');
const fileHelper = require('./fileHelper.js');
console.log('Starting server...');

try {
    const cookieParser = require("cookie-parser");
    const path = require("path");
    const express = require("express");
    const cors = require("cors");
    const bodyParser = require("body-parser");
    const morgan = require("morgan");

    const produktDao = require("./dao/produktDao.js");

    // Database connection
    console.log('Connect database...');
    const Database = require("better-sqlite3");
    const dbOptions = { verbose: console.log };
    const dbPath = path.resolve(__dirname, './db/db.sqlite'); // Absoluter Pfad zur SQLite-Datenbank
    const dbConnection = new Database(dbPath, dbOptions);

    // create server
    const HTTP_PORT = 8000;
    console.log('Creating and configuring Web Server...');
    const app = express();

    // provide service router with database connection / store the database connection in global server environment
    app.locals.dbConnection = dbConnection;

    console.log('Binding middleware...');
    app.use(bodyParser.json()); // JSON-Daten verarbeiten
    app.use(bodyParser.urlencoded({ extended: true })); // Formulardaten verarbeiten
    app.use(cookieParser()); // Cookies verarbeiten
    app.use(express.static(path.join(__dirname, "public"))); // Statische Dateien bereitstellen

    app.use(cors()); // CORS aktivieren

    // CORS-Header setzen
    app.use(function (request, response, next) {
        response.setHeader('Access-Control-Allow-Origin', '*'); 
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.use(morgan('dev')); // Logging aktivieren

    // binding endpoints
    const TOPLEVELPATH = '/api';
    console.log('Binding endpoints, top level Path at ' + TOPLEVELPATH);

    // Product Service
    var serviceRouter = require('./services/product.js');
    app.use(TOPLEVELPATH, serviceRouter);

    // Guest Service
    var guestService = require('./services/guestsService.js');
    app.use(TOPLEVELPATH, guestService); // Binds `/api/guests/...`

    // Orders Service
    var ordersService = require('./services/ordersService.js');
    app.use(TOPLEVELPATH, ordersService); // Binds `/api/orders/...`

    // Contact Service
    var contactService = require('./services/contactService.js');
    app.use(TOPLEVELPATH, contactService); // Binds `/api/contact`

    // send default error message if no matching endpoint found
    app.use(function (request, response) {
        console.log('Error occurred, 404, resource not found');
        response.status(404).json({ fehler: true, nachricht: 'Resource nicht gefunden' });
    });

    // starting the Web Server
    console.log("\nBinding Port and starting Webserver...");
    var webServer = app.listen(HTTP_PORT, () => {
        console.log('Listening at localhost, port ' + HTTP_PORT);
        console.log('\nUsage: http://localhost:' + HTTP_PORT + TOPLEVELPATH + "/SERVICENAME/SERVICEMETHOD/....");
        console.log('\nVersion 4.3.0, 26.06.2024\nSommersemester 2024, HS Albstadt-Sigmaringen, INF');
        console.log('\n\n-----------------------------------------');
        console.log('exit / stop Server by pressing 2 x CTRL-C');
        console.log('-----------------------------------------\n\n');
    });

} catch (err) {
    console.error("Error starting server:", err);
}
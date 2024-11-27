const helper = require('../helper.js');
const ProduktDao = require('../dao/produktDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Produkt');

// Fetch a single product by ID
serviceRouter.get('/products/gib/:id', function(request, response) {
    console.log('Service Produkt: Client requested one record, id=' + request.params.id);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var obj = produktDao.loadById(request.params.id);
        console.log('Service Produkt: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Produkt: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/products/alle', function(request, response) {
    console.log('Service Produkt: Client requested all records');

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var arr = produktDao.loadAll();
        console.log('Service Produkt: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Produkt: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

// Fetch products with filters

serviceRouter.get('/products', function (request, response) {
    console.log('Service Produkt: Client requested all records with filters');

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        // Parse query parameters
        const minPrice = parseFloat(request.query.minPrice) || 0;
        const maxPrice = parseFloat(request.query.maxPrice) || Infinity;
        const search = request.query.search || '';

        let products = produktDao.loadAll();

        // Filter products by price range
        products = products.filter(product => product.price >= minPrice && product.price <= maxPrice);

        // Filter products by search term (case insensitive)
        if (search) {
            const searchLower = search.toLowerCase();
            products = products.filter(product =>
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower)
            );
        }

        console.log('Service Produkt: Records loaded with filters, count=' + products.length);
        response.status(200).json(products);
    } catch (ex) {
        console.error('Service Produkt: Error loading records. Exception occurred: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});


// Check if a product exists by ID
serviceRouter.get('/products/existiert/:id', function(request, response) {
    console.log('Service Produkt: Client requested check, if record exists, id=' + request.params.id);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var exists = produktDao.exists(request.params.id);
        console.log('Service Produkt: Check if record exists by id=' + request.params.id + ', exists=' + exists);
        response.status(200).json({'id': request.params.id, 'existiert': exists});
    } catch (ex) {
        console.error('Service Produkt: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

// Create a new product
serviceRouter.post('/products', function(request, response) {
    console.log('Service Produkt: Client requested creation of new record');

    const errorMsgs = [];
    if (helper.isUndefined(request.body.name)) errorMsgs.push('Name fehlt');
    if (helper.isUndefined(request.body.description)) request.body.description = '';
    if (helper.isUndefined(request.body.price)) errorMsgs.push('Preis fehlt');
    if (!helper.isNumeric(request.body.price)) errorMsgs.push('Preis muss eine Zahl sein');
    if (helper.isUndefined(request.body.image_url)) request.body.image_url = '';

    if (errorMsgs.length > 0) {
        console.log('Service Produkt: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var obj = produktDao.create(request.body.name, request.body.description, request.body.price, request.body.image_url);
        console.log('Service Produkt: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Produkt: Error creating new record. Exception occurred: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

// Delete a product by ID
serviceRouter.delete('/products/:id', function(request, response) {
    console.log('Service Produkt: Client requested deletion of record, id=' + request.params.id);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var obj = produktDao.loadById(request.params.id);
        produktDao.delete(request.params.id);
        console.log('Service Produkt: Deletion of record successful, id=' + request.params.id);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service Produkt: Error deleting record. Exception occurred: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;






const helper = require('../helper.js');
const GuestsDao = require('../dao/guestsDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Guest');

// Fetch a single guest by ID
serviceRouter.get('/guests/:id', function (request, response) {
    console.log('Service Guest: Client requested one record, id=' + request.params.id);

    const guestsDao = new GuestsDao(request.app.locals.dbConnection);
    try {
        var obj = guestsDao.loadById(request.params.id);
        console.log('Service Guest: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Guest: Error loading record by id. Exception occurred: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

// Fetch all guests
serviceRouter.get('/guests', function (request, response) {
    console.log('Service Guest: Client requested all records');

    const guestsDao = new GuestsDao(request.app.locals.dbConnection);
    try {
        var arr = guestsDao.loadAll();
        console.log('Service Guest: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Guest: Error loading all records. Exception occurred: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

// Create a new guest
serviceRouter.post('/guests', function (request, response) {
    console.log('Service Guest: Client requested creation of new record');
    console.log(request.body);

    const errorMsgs = [];
    if (helper.isUndefined(request.body.vorname)) errorMsgs.push('Vorname fehlt');
    if (helper.isUndefined(request.body.nachname)) errorMsgs.push('Nachname fehlt');
    if (helper.isUndefined(request.body.email)) errorMsgs.push('Email fehlt');
    if (helper.isUndefined(request.body.street)) errorMsgs.push('Straße fehlt');
    if (helper.isUndefined(request.body.zip_code)) errorMsgs.push('PLZ fehlt');
    if (helper.isUndefined(request.body.city)) errorMsgs.push('Ort fehlt');
    


    if (errorMsgs.length > 0) {
        console.log('Service Guest: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const guestsDao = new GuestsDao(request.app.locals.dbConnection);
    try {
        var obj = guestsDao.create(
            request.body.vorname,
            request.body.nachname,
            request.body.email,
            request.body.street,
            request.body.zip_code,
            request.body.city
        );
        console.log('Service Guest: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Guest: Error creating new record. Exception occurred: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

// Delete a guest by ID
serviceRouter.delete('/guests/:id', function (request, response) {
    console.log('Service Guest: Client requested deletion of record, id=' + request.params.id);

    const guestsDao = new GuestsDao(request.app.locals.dbConnection);
    try {
        var obj = guestsDao.loadById(request.params.id);
        guestsDao.delete(request.params.id);
        console.log('Service Guest: Deletion of record successful, id=' + request.params.id);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service Guest: Error deleting record. Exception occurred: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;

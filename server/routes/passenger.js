var dbs = require('../db/IfxPassengerService');
var express = require('express');
var router = express.Router();


//GET: Retrieves ALL resources.
router.get('/',
    function (req, res, next) {
        res.json(dbs.GetReq());
    });

// GET: Retrieves a resource.
router.get('/:id',
    function (req, res, next) {
        var x = dbs.GetIdReq(req.params.id);
        if (x == undefined) {
            //res.status(404).end();
            res.status(404).send('Passenger not found');
        }
        else {
            res.json(x);
        }
    });

// POST:  Creates a new resource.
router.post('/',
    function (req, res, next) {
        // POST	Create
        // Entire Collection:
        // 201 (Created), 'Location' header with link to /passenger/{id} containing new ID.
        // Specific Item:
        // 404 (Not Found), 409 (Conflict) if resource already exists..

        // console.log(req.body);

        if (req.body.img1 != undefined) {
            img = req.body.img1;
            // console.log( img );
            console.log('img len = ' + img.length);
        }

        if (dbs.dbAddNewPassenger(0, req.body) == true) {
            res.status(201).json(req.body);
        }
        else {
            // 409 (Conflict) if resource already exists..
            res.status(409).json(req.body);
        }
    });

router.delete('/:id',
    function (req, res, next) {
        // DELETE Delete
        // Entire Collection:
        // 404 (Not Found), unless you want to delete the whole collection—not often desirable.
        // Specific Item:
        // 200 (OK). 404 (Not Found), if ID not found or invalid.

        if (dbs.DelReq(req.params.id) == true) {
            res.status(200).send({ 'k1': 'Passenger DELETEd' });
        }
        else {
            res.status(404).send('Passenger not found');
        }
    });

module.exports = router;

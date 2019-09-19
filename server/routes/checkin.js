var dbs = require('../db/IfxPassengerService');
var express = require('express');
var router = express.Router();

//GET: Retrieves ALL resources.
router.get('/',
    function (req, res, next) {
        res.json( { id:0, msg: 'Dummy1'} );
    });

// GET: Retrieves a resource.
router.get('/:id',
    function (req, res, next) {
        var x = { id:0, msg: 'Dummy2'};
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

        let CompareRes = dbs.ExecMLsp(0, req.body)
        if (CompareRes  != undefined) {
            res.status(201).json(CompareRes);
        }
        else {
            // 409 (Conflict) if resource already exists..
            res.status(409).json(req.body);
        }
    });



module.exports = router;

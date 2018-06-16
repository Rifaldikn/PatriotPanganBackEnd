var express = require('express');
var router = express.Router();
var KM = require(__dirname + '/../controllers/KeluargaMiskins.controller');

//untuk cek KM oleh admin
router.get('/getkeluargamiskin', (req, res, next) => { 
    KM.GetKeluargaMiskin(req, res);
});

//untuk cek detail KM baik admin maupun patriot
router.get('/getdetailkeluargamiskin/:KMid', (req, res, next) => { 
    KM.GetDetailKeluargaMiskin(req, res);
});

module.exports = router;
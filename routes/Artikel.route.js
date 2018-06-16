var express = require('express');
var router = express.Router();
var Artikel = require(__dirname + '/../controllers/Artikels.controller');

router.get('/getartikel', (req, res, next) => {
    Artikel.GetArtikel(req, res);
});

router.get('/getdetailartikel/:artikelId', (req, res, next) => {
    Artikel.GetDetailArtikel(req, res);
});

module.exports = router;
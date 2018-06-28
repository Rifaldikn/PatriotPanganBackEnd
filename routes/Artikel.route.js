var express = require('express');
var router = express.Router();
var Artikel = require(__dirname + '/../controllers/Artikels.controller');

router.get('/getartikel', (req, res, next) => {
    Artikel.GetArtikel(req, res);
});

router.get('/getartikelbybulan', (req, res, next) => { //tinggal kasih req.body.year dan req.body.month
    Artikel.GetArtikelByBulan(req, res);
});

router.get('/getartikelbytahun', (req, res, next) => { //tinggal kasih req.body.year
    Artikel.GetArtikelByTahun(req, res);
});

router.get('/getdetailartikel/:artikelId', (req, res, next) => {
    Artikel.GetDetailArtikel(req, res);
});

router.get('/getjumlahartikel', (req, res, next) => {
    Artikel.GetJumlahArtikel(req, res);
});

router.get('/getjumlahartikelbybulan', (req, res, next) => { //tinggal kasih req.body.year dan req.body.month
    Artikel.GetJumlahArtikelByBulan(req, res);
});

router.get('/getjumlahartikelbytahun', (req, res, next) => { //tinggal kasih req.body.year
    Artikel.GetJumlahArtikelByTahun(req, res);
});

module.exports = router;
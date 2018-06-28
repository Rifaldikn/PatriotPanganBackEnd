var express = require('express');
var router = express.Router();
var Artikel = require(__dirname + '/../controllers/Artikels.controller');

router.get('/getartikel', (req, res, next) => {
    Artikel.GetArtikel(req, res);
});

router.get('/getartikelbybulan/:year/:month', (req, res, next) => { 
    Artikel.GetArtikelByBulan(req, res);
});

router.get('/getartikelbytahun/:year', (req, res, next) => { 
    Artikel.GetArtikelByTahun(req, res);
});

router.get('/getdetailartikel/:artikelId', (req, res, next) => {
    Artikel.GetDetailArtikel(req, res);
});

router.get('/getjumlahartikel', (req, res, next) => {
    Artikel.GetJumlahArtikel(req, res);
});

router.get('/getjumlahartikelbybulan/:year/:month', (req, res, next) => { 
    Artikel.GetJumlahArtikelByBulan(req, res);
});

router.get('/getjumlahartikelbytahun/:year', (req, res, next) => { 
    Artikel.GetJumlahArtikelByTahun(req, res);
});

module.exports = router;
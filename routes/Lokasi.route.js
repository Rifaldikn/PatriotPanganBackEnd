var express = require('express');
var router = express.Router();
var Lokasi = require(__dirname + '/../controllers/Lokasi.controller');

router.get('/semuaprovinsi', (req, res, next) => {
    Lokasi.GetAllProvinsi(req, res);
});

router.get('/semuakabupaten/:id', (req, res, next) => {
    Lokasi.GetAllKabupatenById(req, res);
});

router.get('/semuakecamatan/:id', (req, res, next) => {
    Lokasi.GetAllKecamatanById(req, res);
});

router.get('/semuakelurahan/:id', (req, res, next) => {
    Lokasi.GetAllKelurahanById(req, res);
});

module.exports = router
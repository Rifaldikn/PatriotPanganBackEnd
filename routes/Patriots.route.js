var express = require('express');
var router = express.Router();
var Patriots = require(__dirname + '/../controllers/Patriots.controller');

router.get('/profileku', (req, res, next) => {
    Patriots.GetProfileAccount(req, res);
});

router.post('/updatebiodata', (req, res, next) => {
    Patriots.UpdateProfileAccount(req, res);
});

router.post('/updatephoto', (req, res, next) => {
    Patriots.UpdatePhotoProfileAccount(req, res);
});

router.post('/tambahkeluargamiskin', (req, res, next) => {
    Patriots.AddKeluargaMiskin(req, res);
});

router.post('/buatlaporan/:KMid', (req, res, next) => {
    Patriots.CreateLaporan(req,res);
});

//untuk cek KM sesuai patriotnya
router.get('/getkeluargamiskinyangdipantau', (req, res, next) => { 
    Patriots.GetKeluargaMiskinYangDipantau(req, res);
});

module.exports = router;
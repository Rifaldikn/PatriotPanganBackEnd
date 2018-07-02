var express = require('express');
var router = express.Router();
var Summaries = require(__dirname + '/../controllers/Summaries.controller');

router.get('/getjumlahtaraf/:bulan/:tahun', (req, res, next) => {
    Summaries.GetJumlahTarafKec(req, res);
});

router.get('/getsummaries/:bulan/:tahun', (req, res, next) => { //bisa dapetin jumlah laporan perbulan berdasarkan question
    Summaries.GetSummaries(req, res);
});

router.get('/gettotalkecrawanpangan', (req, res, next) =>{
	Summaries.GetTotalKecRawanPangan(req,res);
});

router.get('/getkondisirawanbylokasi', (req, res, next) => {
    Summaries.GetKondisiRawanByLokasi(req, res);
});

router.get('/getkerawananallprov', (req, res, next) => {
    Summaries.GetKerawananAllProv(req, res);
});

router.get('/gettotalquestionpertahun/:tahun', (req, res, next) => {
    Summaries.GetTotalQuestionPerTahun(req, res);
});

module.exports = router;
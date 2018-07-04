var express = require('express');
var router = express.Router();
var Summaries = require(__dirname + '/../controllers/Summaries.controller');

router.get('/getjumlahtarafallprov/:bulan/:tahun', (req, res, next) =>{
    Summaries.GetJumlahTarafAllProv(req, res);
});

router.get('/getjumlahtarafbyprovid/:bulan/:tahun/:id_provinsi', (req, res, next) =>{
    Summaries.GetJumlahTarafByProvId(req, res);
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

router.get('/gettotalquestionpertahunbyprovid/:tahun/:id_provinsi', (req, res, next) => {
    Summaries.GetTotalQuestionPerTahunByProvId(req, res);
});

router.get('/getkecamatanbytarafandprovid/:tipe_kondisi/:id_provinsi', (req, res, next) => {
    Summaries.GetKecamatanByTarafAndProvId(req, res);
});

router.get('/getmaxtarafhistorypertahun/:tahun/:id_provinsi', (req, res, next) => {
    Summaries.GetMaxTarafHistoryPerTahun(req, res);
});


module.exports = router;
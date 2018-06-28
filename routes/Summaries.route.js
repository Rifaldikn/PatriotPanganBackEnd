var express = require('express');
var router = express.Router();
var Summaries = require(__dirname + '/../controllers/Summaries.controller');

router.get('/getjumlahtaraf', (req, res, next) => {
    Summaries.GetJumlahTarafKec(req, res);
});

router.get('/getsummaries', (req, res, next) => { //bisa dapetin jumlah laporan perbulan berdasarkan question
    Summaries.GetSummaries(req, res);
});

router.get('/gettotalkecrawanpangan', (req, res, next) =>{
	Summaries.GetTotalKecRawanPangan(req,res);
});

module.exports = router;
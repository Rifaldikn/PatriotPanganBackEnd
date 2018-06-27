var express = require('express');
var router = express.Router();
var Summaries = require(__dirname + '/../controllers/Summaries.controller');

router.get('/getjumlahtaraf', (req, res, next) => {
    Summaries.GetJumlahTarafKec(req, res);
});

router.get('/getsummaries', (req, res, next) => {
    Summaries.GetSummaries(req, res);
});

module.exports = router;
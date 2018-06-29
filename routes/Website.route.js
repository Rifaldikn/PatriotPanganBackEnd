var express = require('express');
var router = express.Router();
var Website = require(__dirname + '/../controllers/Website.controller');

router.get('/homepage', (req, res, next) => {
    Website.Homepage(req, res);
});

module.exports = router;
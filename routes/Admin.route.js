var express = require('express');
var router = express.Router();
var Admin = require(__dirname + '/../controllers/Admin.controller');

router.post('/addartikel', (req, res, next) => {
    Admin.AddArtikel(req, res);
});

module.exports = router;
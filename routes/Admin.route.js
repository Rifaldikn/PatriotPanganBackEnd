var express = require('express');
var router = express.Router();
var Admin = require(__dirname + '/../controllers/Admin.controller');

router.post('/addartikel', (req, res, next) => {
    Admin.AddArtikel(req, res);
});

router.post('/editartikel/:id', (req, res , next) => {
    Admin.EditArtikel(req, res);
});

router.post('/editphotoartikel/:id', (req, res, next) => {
    Admin.EditPhotoArtikel(req, res);
});

module.exports = router;
var express = require('express');
var router = express.Router();
var Admin = require(__dirname + '/../controllers/Admin.controller');

router.post('/signuppejabat', (req, res, next) => {
    Admin.SignUpPejabat(req, res);
});

module.exports = router;
var express = require('express');
var router = express.Router();
var Patriots = require(__dirname + '/../controllers/Patriots.controller');

router.get('/profileku', (req, res, next) => {
    Patriots.GetProfileAccount(req, res);
});

module.exports = router;
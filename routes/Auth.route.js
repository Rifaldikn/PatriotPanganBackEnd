var express = require('express');
var router = express.Router();
var Auth = require(__dirname + '/../controllers/Auth.controller');

// Login Pejabat
router.post('/loginpejabat', (req, res, next) => {
    Auth.LoginPejabat(req, res);
});
// Login Patriot
router.post('/loginpatriot', (req, res, next) => {
    Auth.LoginPatriot(req, res);
});
// Login Admin
router.post('/loginadmin', (req, res, next) => {
    Auth.LoginAdmin(req, res);
});
// Register Admin
router.post('/signupadmin', (req, res, next) => {
    Auth.SignUpAdmin(req, res);
});

module.exports = router;

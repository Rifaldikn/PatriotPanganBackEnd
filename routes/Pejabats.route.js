var express = require('express');
var router = express.Router();
var Pejabats = require(__dirname + '/../controllers/Pejabats.controller');

// Mendaftarkan Patriot baru
router.post('/signuppatriot', (req, res, next) => {
  Pejabats.SignUpPatriot(req, res);
});
// Menghapus Patriot
router.delete('/deletepatriot/:patriotId', (req, res, next) => {
  Pejabats.DeletePatriots(req, res);
});

module.exports = router;

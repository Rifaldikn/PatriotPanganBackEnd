var express = require('express');
var router = express.Router();
var UsersController = require(__dirname + '/../controllers/Users.controller');

// Register pejabat (admin)
router.post('/signuppejabat', (req, res, next) => {
  UsersController.SignUpPejabat(req, res);
});

router.post('/login', (req, res, next) => {
  UsersController.Login(req, res);
});

router.delete("/delete/:userId", (req, res, next) => {
  UsersController.DeleteUsers(req, res);
});

module.exports = router;

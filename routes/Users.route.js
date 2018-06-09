var express = require('express');
var router = express.Router();
var UsersController = require(__dirname + '/../controllers/Users.controller');

router.delete("/delete/:userId", (req, res, next) => {
  UsersController.DeleteUsers(req, res);
});

module.exports = router;

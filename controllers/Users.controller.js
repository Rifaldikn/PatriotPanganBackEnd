var UsersModel = require(__dirname + '/../models/Users.model');
var bcrypt = require('bcrypt');
var Token = require(__dirname + '/Token.controller');

class Users {
    constructor() {
        this.token;
    }

    SetPassword(data) {
        return bcrypt.hashSync(data, 10);
    }

    ComparePassword(passwordInput, passwordDB) {
        return bcrypt.compareSync(passwordInput, passwordDB);
    }

    SignUpPejabat(req, res) {
        UsersModel
            .find({ email: req.body.email })
            .exec()
            .then((user) => {
                console.log('masuk sini', req.body);
                if (user.length >= 1) {
                    res.status(409).json({
                        message: "Mail exists, please use another email"
                    });
                } else {
                    var NewUser = new UsersModel({
                        email: req.body.email,
                        password: this.SetPassword(req.body.password),
                        name: req.body.name,
                        gender: req.body.gender,
                        role: 7
                    });
                    NewUser
                        .save()
                        .then((result) => {
                            res.status(200)
                                .json({
                                    message: "Berhasil mendaftarkan pejabat baru",
                                    info: result
                                });
                        })
                        .catch((err) => {
                            res.status(400)
                                .json({
                                    message: "Tidak dapat mendaftarkan pejabat baru",
                                    info: err
                                });
                        });
                }
            })
            .catch((err) => {
                console.log('masuk err ', err);
            })
    }

    Login(req, res) {
        UsersModel.find({ email: req.body.email })
            .exec()
            .then((user) => {
                if (user.length < 1) {
                    res.status(401).json({
                        message: "Auth failed, email wasn't register"
                    });
                } else {
                    if(this.ComparePassword(req.body.password, user[0].password)) {
                        this.token = Token.SetupToken(user);
                        res.status(200)
                            .json({
                                message: "Auth successful",
                                token: this.token
                            });
                    } else {
                        res.status(401)
                            .json({
                                message: "Auth failed, password didn't match"
                            });
                    }
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }

    DeleteUsers(req, res) {
        UsersModel.remove({ _id: req.params.userId })
            .exec()
            .then((result) => {
                res.status(200).json({
                    message: "User deleted"
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
}

module.exports = new Users;
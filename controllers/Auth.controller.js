var bcrypt = require('bcrypt');
var Token = require(__dirname + '/Token.controller');
var Patriots = require(__dirname + '/../models/Patriots.model');
var Admins = require(__dirname + '/../models/Admins.model');

class Auth {
    constructor() {
        this.token;
    }

    SetPassword(data) {
        return bcrypt.hashSync(data, 10);
    }

    ComparePassword(passwordInput, passwordDB) {
        return bcrypt.compareSync(passwordInput, passwordDB);
    }

    LoginPatriot(req, res) {
        Patriots
            .find({
                email: req.body.email
            })
            .exec()
            .then((patriots) => {
                if(patriots.length < 1) {
                    res.status(200)
                        .json({
                            message: "Auth failed, email wasn't register",
                        });
                } else {
                    if(this.ComparePassword(req.body.password, patriots[0].password)) {
                        this.token = Token.SetupToken(patriots, "patriots");
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
            .catch((err) => {
                res.status(500)
                    .json({
                        message: "Internal server error",
                        info: err
                    })
            })
    }

    SignUpAdmin(req, res) {
        Admins
            .find({
                email: req.body.email
            })
            .exec()
            .then((admin) => {
                if(admin.length >= 1) {
                    res.status(200)
                        .json({
                            message: "Email already exists"
                        });
                } else {
                    var NewAdmin = new Admins({
                        email: req.body.email,
                        password: this.SetPassword(req.body.password),
                        nama: req.body.nama
                    });
                    NewAdmin
                        .save()
                        .then((result) => {
                            res.status(200)
                                .json({
                                    message: "Berhasil mendaftarkan admin baru",
                                    info: result
                                });
                        })
                        .catch((err) => {
                            res.status(401)
                                .json({
                                    message: "Gagal mendaftarkan admin baru",
                                    info: err
                                });
                        });
                }
            })
            .catch((err) => {
                res.status(500)
                    .json({
                        message: "Internal server error",
                        info: err
                    });
            });
    }

    LoginAdmin(req, res) {
        Admins
            .find({
                email: req.body.email
            })
            .exec()
            .then((admin) => {
                if(admin.length < 1) {
                    res.status(200)
                        .json({
                            message: "Auth failed, email wasn't register"
                        });
                } else {
                    if(this.ComparePassword(req.body.password, admin[0].password)) {
                        this.token = Token.SetupToken(admin, "admin");
                        res.status(200)
                            .json({
                                message: "Auth successfull",
                                token: this.token
                            });
                    } else {
                        res.status(401)
                            .json({
                                message: "Auth failed, Password didn't match"
                            });
                    }
                }
            })
            .catch((err) => {
                res.status(500)
                    json({
                        message: "Internal server error"
                    });
            });
    }
}

module.exports = new Auth;
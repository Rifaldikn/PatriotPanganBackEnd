var bcrypt = require('bcrypt');
var multer = require('multer');
var Token = require(__dirname + '/Token.controller');
var Upload = require(__dirname + '/Uploads.controller');
var Patriots = require(__dirname + '/../models/Patriots.model');
var Admins = require(__dirname + '/../models/Admins.model');

class Auth {
    constructor() {
        this.token;
    }

    CheckingAuth(role, hakAkses) {
        if(role == hakAkses) {
            return true;
        } else {
            return false;
        }
    }

    SetPassword(data) {
        return bcrypt.hashSync(data, 10);
    }

    ComparePassword(passwordInput, passwordDB) {
        return bcrypt.compareSync(passwordInput, passwordDB);
    }

    SignUpPatriot(req, res) {
        this.storage = Upload.SetStorage('/../public/images/profilePatriots/');
        this.upload = Upload.SetUpload(this.storage);
        this.upload(req, res ,(err) => {
            Patriots
                .find({
                    email: req.body.email
                })
                .exec()
                .then((patriot) => {
                    if(patriot.length >= 1) {
                        Upload.DeleteFile('/../public/images/profilePatriots/' + req.file.filename);
                        res.status(409)
                            .json({
                                message: "Mail Exists, please use another email"
                            });
                    } else {
                        var NewPatriot = new Patriots({
                            email: req.body.email,
                            password: this.SetPassword(req.body.password),
                            nama: req.body.nama,
                            gender: req.body.gender,
                            fk_desaid: req.body.fk_desaid,
                            alamat: req.body.alamat,
                            pathfoto: req.file.filename
                        });
                        NewPatriot
                            .save()
                            .then((result) => {
                                res.status(200)
                                    .json({
                                        message: "Berhasil mendaftarkan patriot baru",
                                        info: result
                                    })
                            })
                            .catch((err) => {
                                Upload.DeleteFile('/../public/images/profilePatriots/' + req.file.filename);
                                res.status(401)
                                    .json({
                                        message: "Tidak dapat mendaftarkan patriot baru",
                                        info: err
                                    });
                            });
                    }
                })
                .catch((err) => {
                    Upload.DeleteFile('/../public/images/profilePatriots/' + req.file.filename);
                    res.status(500)
                        .json({
                            message: "Internal server error",
                            info: err
                        });
                });
        });
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
var bcrypt = require('bcrypt');
// var multer = require('multer');
var Token = require(__dirname + '/Token.controller');
var Upload = require(__dirname + '/Uploads.controller');
var Patriots = require(__dirname + '/../models/Patriots.model');
var sequelize = require(__dirname + '/../dbconnection');
var Admins = sequelize.import(__dirname + '/../model/Admins.model');
var Patriots = sequelize.import(__dirname + '/../model/Patriots.model');

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
                .findOne({
                    where: {
                        email: req.body.email
                    }
                })
                .then((patriot) => {
                    if(patriot != null) {
                        Upload.DeleteFile('/../public/images/profilePatriots/' + req.file.filename);
                        res.status(409)
                            .json({
                                message: "Mail Exists, please use another email"
                            });
                    } else {
                        Patriots
                            .create({
                                email: req.body.email,
                                password: this.SetPassword(req.body.password),
                                nama: req.body.nama,
                                gender: req.body.gender,
                                fk_desaid: req.body.fk_desaid,
                                alamat: req.body.alamat,
                                pathfoto: req.file.filename
                            })
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
                            })
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
                where: {
                    email: req.body.email
                }
            })
            .then((patriots) => {
                if(patriots.length < 1) {
                    res.status(200)
                        .json({
                            message: "Auth failed, email wasn't register",
                        });
                } else {
                    if(this.ComparePassword(req.body.password, patriots.dataValues.password)) {
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
            .findOne({
                where: {
                    email: req.body.email
                }
            })
            .then((admin) => {
                if(admin == null) {
                    Admins
                        .create({
                            email: req.body.email,
                            password: this.SetPassword(req.body.password),
                            nama: req.body.nama 
                        })
                        .then((result) => {
                            res.status(200)
                                .json({
                                    message: "Berhasil mendaftarkan admin baru",
                                    info: result
                                });
                        })
                        .catch((err) => {
                            res.status(500)
                                .json({
                                    message: "Internal server error",
                                    info: err
                                });
                        })
                } else {
                    res.status(200)
                        .json({
                            message: "Email already exists"
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
            .findOne({
                where: {
                    email: req.body.email
                }
            })
            .then((admin) => {
                if(admin == null) {
                    res.status(200)
                    .json({
                        message: "Auth failed, email wasn't register"
                    });
                } else {
                    if(this.ComparePassword(req.body.password, admin.dataValues.password)) {
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
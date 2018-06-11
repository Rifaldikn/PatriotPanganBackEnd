var Pejabats = require(__dirname + '/../models/Pejabats.model');
var Patriots = require(__dirname + '/../models/Patriots.model');
var Artikels = require(__dirname + '/../models/Artikels.model');
var Token = require(__dirname + '/Token.controller');
var Auth = require(__dirname + '/Auth.controller');
var Upload = require(__dirname + '/Uploads.controller');
var multer = require('multer');

class Pejabat {
    constructor() {
        this.id;
        this.storage;
        this.upload;
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
                            password: Auth.SetPassword(req.body.password),
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

    CreateArtikel(req, res) {
        this.id = Token.DecodeToken(req.headers.token).token[0]._id;
        NewArtikel = new Artikels({
            judul: req.body.judul,
            fk_pembuatid: this.id,
            tanggalpublish: Date.now(),
            sumberartikel: req.body.sumber,
            isi: req.body.isi,
            pathfoto:req.file.filename
        });
        NewArtikel
            .save()
            .then((result) => {
                res.status(200)
                    .json({
                        message: "Berhasil menambahkan artikel",
                        info: result
                    });
            })
            .catch((err) => {
                res.status(401)
                    .json({
                        message: "Gagal menambahkan artikel",
                        info: err
                    });
            });
    }

    DeletePatriots(req, res) {
        Patriots
            .remove({ _id: req.params.patriotId })
            .exec()
            .then((result) => {
                res.status(200).json({
                    message: "Patriot deleted"
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Internal server error",
                    info: err
                });
            });
    }
}

module.exports = new Pejabat;
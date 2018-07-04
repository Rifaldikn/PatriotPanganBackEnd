var sequelize = require(__dirname + '/../dbconnection');
var Artikels = sequelize.import(__dirname + '/../model/Artikels.model');
var Auth = require(__dirname + '/Auth.controller');
var Token = require(__dirname + '/Token.controller');
var Upload = require(__dirname + '/Uploads.controller');
var multer = require('multer');

class Admin {
    constructor() {
        this.storage;
        this.upload;
        this.info;
    }

    AddArtikel(req, res) {
        this.info = Token.DecodeToken(req.headers.token)
        if (this.info.role == "admin"){ 
            this.storage = Upload.SetStorage('/../public/images/artikels');
            this.upload = Upload.SetUpload(this.storage);
            this.upload(req,res, (err) => {
                if (err == null) {
                    Artikels
                        .create({
                            judul: req.body.judul,
                            fk_pembuatid : this.info.token.id,
                            tanggalpublish: Date.now(),
                            sumberartikel: req.body.sumberartikel,
                            isi: req.body.isi,
                            pathfoto : req.file.filename
                        })
                        .then((result) => {
                            res.json({
                                    status: true,
                                    message: "Berhasil menambahkan artikel",
                                    info: result
                                });
                        })
                        .catch((err) => {
                            Upload.DeleteFile('/../public/images/artikels/' + req.file.filename);
                            res.json({
                                    status: false,
                                    message: "Gagal menambahkan artikel",
                                    info: err
                                });
                        });
                } else {
                    res.json({
                            status: false,
                            message: "Upload gagal",
                            info: err
                        });
                }
            })
        } else {
            res.json({
                    status: false,
                    message: "Auth failed, Anda bukan admin"
                });
        }

    }

    EditArtikel(req, res) {
        this.info = Token.DecodeToken(req.headers.token)
        if(this.info.role != "admin") {
            res.json({
                status: false,
                message: "Auth failed, Anda bukan admin"
            });
        } else {
            Artikels
                .update({
                    judul: req.body.judul,
                    tanggalpublish: Date.now(),
                    sumberartikel: req.body.sumberartikel,
                    isi: req.body.isi,
                }, {
                    where: {
                        id: req.params.id
                    }
                })
                .then((updated) => {
                    res.
                        json({
                            status: true, 
                            message: "Berhasil memperbarui artikel dengan judul " + req.body.judul,
                            info: updated
                        });
                })
                .catch((err) => {
                    res
                        .json({
                            status: false,
                            message: "Gagal memperbarui artikel dengan judul " + req.body.judul,
                            info: err
                        });
                });
        }
    }

    EditPhotoArtikel(req, res) {
        console.log('masuk sini kah?');
        this.info = Token.DecodeToken(req.headers.token)
        if (this.info.role != "admin") {
            res.json({
                status: false,
                message: "Auth failed, Anda bukan admin"
            });
        } else {
            this.storage = Upload.SetStorage('/../public/images/artikels');
            this.upload = Upload.SetUpload(this.storage);
            this.upload(req, res, (err) => {
                Artikels
                    .findOne({
                        where: {
                            id: req.params.id
                        }
                    })
                    .then((artikel) => {
                        artikel = JSON.parse(JSON.stringify(artikel));
                        Artikels
                            .update({
                                pathfoto : req.file.filename
                            }, {
                                where: {
                                    id: req.params.id
                                }
                            })
                            .then((updated) => {
                                // hapus file photo yang lama
                                Upload.DeleteFile('/../public/images/artikels/' + artikel.pathfoto);
                                res.
                                    json({
                                        status: true, 
                                        message: "Berhasil memperbarui artikel dengan judul " + artikel.judul,
                                        info: updated
                                    });
                            })
                            .catch((err) => {
                                Upload.DeleteFile('/../public/images/artikels/' + req.file.filename);
                                res
                                    .json({
                                        status: false,
                                        message: "Gagal memperbarui artikel dengan judul " + artikel.judul,
                                        info: err
                                    });
                            })
                    })
                    .catch((err) => {
                        Upload.DeleteFile('/../public/images/artikels/' + req.file.filename);
                        res
                            .json({
                                status: false,
                                message: "Gagal mendapatkan data artikel",
                                info: err
                            });
                    })
            })
        }
    }
}

module.exports = new Admin;
var Artikels = require(__dirname + '/../models/Artikels.model');
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
                    var NewArtikel = new Artikels({
                        judul: req.body.judul,
                        fk_pembuatid : this.info.token[0]._id,
                        tanggalpublish: Date.now(),
                        sumberartikel: req.body.sumberartikel,
                        isi: req.body.isi,
                        pathfoto : req.file.filename
                    })
                    NewArtikel
                        .save()
                        .then((result) =>{
                            res.status(200)
                                .json({
                                    message: "Berhasil menambahkan artikel",
                                    info: result
                                })
                        })
                        .catch((err) =>{
                            Upload.DeleteFile('/../public/images/artikels/' + req.file.filename);
                            res.status(401)
                                .json({
                                    message: "Gagal menambahkan artikel",
                                    info: err
                                });
                        })
                } else {
                    res.status(401)
                        .json({
                            message: "Upload gagal"
                        });
                }
            })
        } else {
            res.status(401)
                .json({
                    message: "Auth failed, Anda bukan admin"
                });
        }

    }
}

module.exports = new Admin;
var Pejabats = require(__dirname + '/../models/Pejabats.model');
var Auth = require(__dirname + '/Auth.controller');
var Upload = require(__dirname + '/Uploads.controller');
var multer = require('multer');

class Admin {
    constructor() {
        this.storage;
        this.upload;
    }

    SignUpPejabat(req, res) {
        this.storage = Upload.SetStorage('/../public/images/profilePejabats');
        this.upload = Upload.SetUpload(this.storage);
        this.upload(req, res, (err) => {
            Pejabats
                .find({ email: req.body.email })
                .exec()
                .then((pejabat) => {
                    if (pejabat.length >= 1) {
                        Upload.DeleteFile('/../public/images/profilePejabats/' + req.file.filename);
                        res.status(409).json({
                            message: "Mail exists, please use another email"
                        });
                    } else {
                        var NewPejabat = new Pejabats({
                            email: req.body.email,
                            password: Auth.SetPassword(req.body.password),
                            nama: req.body.nama,
                            fk_kecamatanid: req.body.kecamatanid,
                            pathfoto: req.file.filename
                        });
                        NewPejabat
                            .save()
                            .then((result) => {
                                res.status(200)
                                    .json({
                                        message: "Berhasil mendaftarkan pejabat baru",
                                        info: result
                                    });
                            })
                            .catch((err) => {
                                Upload.DeleteFile('/../public/images/profilePejabats/' + req.file.filename);
                                res.status(400)
                                    .json({
                                        message: "Tidak dapat mendaftarkan pejabat baru",
                                        info: err
                                    });
                            });
                    }
                })
                .catch((err) => {
                    Upload.DeleteFile('/../public/images/profilePejabats/' + req.file.filename);
                    res.status(404)
                        .json({
                            message: "Internal server Error",
                            info: err
                        });
                });
        });
    }
}

module.exports = new Admin;
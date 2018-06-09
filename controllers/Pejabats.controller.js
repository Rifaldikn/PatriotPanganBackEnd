var Pejabats = require(__dirname + '/../models/Pejabats.model');
var Patriots = require(__dirname + '/../models/Patriots.model');
var Auth = require(__dirname + '/Auth.controller');

class Pejabat {
    constructor() {
    }

    SignUpPatriot(req, res) {
        Patriots
            .find({
                email: req.body.email
            })
            .exec()
            .then((patriot) => {
                if(patriot.length >= 1) {
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
                        alamat: req.body.alamat
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
                            res.status(401)
                                .json({
                                    message: "Tidak dapat mendaftarkan patriot baru",
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
            })
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
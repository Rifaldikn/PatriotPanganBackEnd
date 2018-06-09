var Pejabats = require(__dirname + '/../models/Pejabats.model');
var Auth = require(__dirname + '/Auth.controller');

class Admin {
    constructor() {

    }

    SignUpPejabat(req, res) {
        Pejabats
            .find({ email: req.body.email })
            .exec()
            .then((pejabat) => {
                if (pejabat.length >= 1) {
                    res.status(409).json({
                        message: "Mail exists, please use another email"
                    });
                } else {
                    var NewPejabat = new Pejabats({
                        email: req.body.email,
                        password: Auth.SetPassword(req.body.password),
                        nama: req.body.nama,
                        gender: req.body.gender,
                        role: 7
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
                            res.status(400)
                                .json({
                                    message: "Tidak dapat mendaftarkan pejabat baru",
                                    info: err
                                });
                        });
                }
            })
            .catch((err) => {
                res.status(404)
                    .json({
                        message: "Internal server Error",
                        info: err
                    });
            });
    }
}

module.exports = new Admin;
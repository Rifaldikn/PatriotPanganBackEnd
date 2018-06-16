var KM = require(__dirname + '/../models/KeluargaMiskins.model');
var Token = require(__dirname + '/Token.controller');

class KeluargaMiskin {
	constructor() {
        this.info;
    }

    GetKeluargaMiskin(req, res){ //belum nested di alamat
        this.info = Token.DecodeToken(req.headers.token);
        if (this.info.role == "admin"){
            KM
                .find()
                .populate('fk_desaid', nama)
                .populate('fk_patriotid')
                .exec()
                .then((keluargaMiskin) =>{
                    res.status(200)
                        .json({
                            message : "Berhasil mendapatkan keluarga miskin",
                            data: keluargaMiskin
                        })
                })
                .catch((err) => {
                    res.status(500)
                        .json({
                            message: "Internal Sperver Error"
                        })
                });
        } else {
            res.status(401)
                .json({
                    message: "Auth failed, Anda bukan admin"
                });
        }
    }

    GetDetailKeluargaMiskin(req, res){ //belum nested di alamat
        this.info = Token.DecodeToken(req.headers.token);
        if (this.info != null){
            KM
                .findById(req.params.KMid)
                .populate('fk_desaid', nama)
                .populate('fk_patriotid')
                .exec()
                .then((keluargaMiskin) =>{
                    res.status(200)
                        .json({
                            message : "Berhasil mendapatkan detail keluarga miskin",
                            data: keluargaMiskin
                        })
                })
                .catch((err) => {
                    res.status(500)
                        .json({
                            message: "Internal Sperver Error"
                        })
                });
        } else {
            res.status(401)
                .json({
                    message: "Auth failed, Anda tidak memiliki token"
                });
        }
    }
}

module.exports = new KeluargaMiskin;
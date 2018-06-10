var Patriots = require(__dirname + '/../models/Patriots.model');
var Auth = require(__dirname + '/Auth.controller');
var Token = require(__dirname + '/Token.controller');

class Patriot {
    constructor() {
        this.id;
    }

    GetProfileAccount(req, res) {
        this.id = Token.DecodeToken(req.headers.token).token[0]._id;
        Patriots
            .find()
            .where('_id').equals(this.id)
            .select('nama alamat gender email bergabung laporanterkirim')
            .exec()
            .then((patriot) => {
                res.status(200)
                    .json({
                        message: "Berhasil mendapatkan data profile",
                        data: patriot
                    });
            })
            .catch((err) => {
                res.status(500)
                    .json({
                        message: "Internal Server Error"
                    })
            });
    }
}

module.exports = new Patriot;
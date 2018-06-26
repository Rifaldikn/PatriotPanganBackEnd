var sequelize = require(__dirname + '/../dbconnection');
var Provinsi = sequelize.import(__dirname + '/../model/rgn_province');
var Kabupaten = sequelize.import(__dirname + '/../model/rgn_city.model');
var Kecamatan = sequelize.import(__dirname + '/../model/rgn_district.model');
var Kelurahan = sequelize.import(__dirname + '/../model/rgn_subdistrict.model');

class Lokasi {
    constructor() {

    }

    GetAllProvinsi(req, res) {
        Provinsi
            .findAll()
            .then((provinsi) => {
                provinsi = JSON.parse(JSON.stringify(provinsi));
                res.status(200)
                    .json({
                        message: "berhasil mendapatkan data provinsi",
                        data: provinsi
                    });
            })
            .catch((err) => {
                res.status(500)
                    .json({
                        message: "Internal Server Error, saat mendapatkan data provinsi",
                        info: err
                    });
            });
    }

    GetAllKabupatenById(req, res) {
        Kabupaten
            .findAll({
                where: {
                    province_id: req.params.id
                }
            })
            .then((kabupaten) => {
                kabupaten = JSON.parse(JSON.stringify(kabupaten));
                res.status(200)
                    .json({
                        message: "berhasil mendapatkan data kabupaten",
                        data: kabupaten
                    });
            })
            .catch((err) => {
                res.status(500)
                    .json({
                        message: "Internal Server Error, saat mendapatkan data kabupaten",
                        info: err
                    });
            });
    }

    GetAllKecamatanById(req, res) {
        Kecamatan
            .findAll({
                where: {
                    city_id: req.params.id
                }
            })
            .then((kecamatan) => {
                kecamatan = JSON.parse(JSON.stringify(kecamatan));
                res.status(200)
                    .json({
                        message: "berhasil mendpatkan data kecamatan",
                        data: kecamatan
                    });
            })
            .catch((err) => {
                res.status(500)
                    .json({
                        message: "Internal Server Error, saat mendapatkan data kecamatan",
                        info: err
                    });
            });
    }

    GetAllKelurahanById(req, res) {
        Kelurahan
            .findAll({
                where: {
                    district_id: req.params.id
                }
            })
            .then((kelurahan) => {
                kelurahan = JSON.parse(JSON.stringify(kelurahan));
                res.status(200)
                    .json({
                        message: "Berhasil mendapatkan data kelurahan",
                        data: kelurahan
                    });
            })
            .catch((err) => {
                res.status(500)
                    .json({
                        message: "Internal Server Error, saat mendapatkan data kelurahan",
                        info: err
                    });
            })
    }
}

module.exports = new Lokasi;
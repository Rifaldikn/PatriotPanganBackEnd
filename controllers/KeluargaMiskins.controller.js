var sequelize = require(__dirname + '/../dbconnection');
var KM = sequelize.import(__dirname + '/../model/KeluargaMiskins.model');
var Desa = sequelize.import(__dirname + '/../model/rgn_subdistrict.model');
var Patriots = sequelize.import(__dirname + '/../model/Patriots.model');
var Token = require(__dirname + '/Token.controller');
var Kecamatan = sequelize.import(__dirname + '/../model/rgn_district.model');
var Kabupaten = sequelize.import(__dirname + '/../model/rgn_city.model');
var Provinsi = sequelize.import(__dirname + '/../model/rgn_province.model');
var Negara = sequelize.import(__dirname + '/../model/rgn_country.model');

KM.belongsTo(Patriots, {foreignKey: 'fk_patriotid'}); // Adds fk_patriotid to keluarga miskin
KM.belongsTo(Desa, {foreignKey: 'fk_desaid'}); // Adds fk_desaid to keluarga miskin
Desa.belongsTo(Kecamatan, {foreignKey: 'district_id'});
Kecamatan.belongsTo(Kabupaten, {foreignKey: 'city_id'});
Kabupaten.belongsTo(Provinsi, {foreignKey: 'province_id'});
Provinsi.belongsTo(Negara, {foreignKey: 'country_id'});

class KeluargaMiskin {
	constructor() {
        this.info;
    }

    GetKeluargaMiskin(req, res){ //belum nested di alamat
        this.info = Token.DecodeToken(req.headers.token);
        if (this.info.role == "admin" || this.info.role == "patriots"){
            KM
                .findAll({
                    include: [{
                        model: Desa,
                        include: [{
                            model: Kecamatan,
                            include : [{
                                model: Kabupaten,
                                include : [{
                                    model : Provinsi,
                                    include : [{
                                        model : Negara
                                    }]
                                }]
                            }]
                        }]
                    }, {
                        model: Patriots
                    }]
                })
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
                            message: "Internal Sperver Error",
                            info: err
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
                .findOne({
                    where: {
                        id: req.params.KMid
                    },
                    include: [{
                        model: Desa,
                        include: [{
                            model: Kecamatan,
                            include : [{
                                model: Kabupaten,
                                include : [{
                                    model : Provinsi,
                                    include : [{
                                        model : Negara
                                    }]
                                }]
                            }]
                        }]
                    }, {
                        model: Patriots
                    }]
                })
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
                            message: "Internal Sperver Error",
                            info: err
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
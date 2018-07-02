var sequelize = require(__dirname + '/../dbconnection');
var Patriots = sequelize.import(__dirname + '/../model/Patriots.model');
var KM = sequelize.import(__dirname + '/../model/KeluargaMiskins.model');
var Laporans = sequelize.import(__dirname + '/../model/Laporans.model');
var Kecamatan = sequelize.import(__dirname + '/../model/rgn_district.model');
var Desa = sequelize.import(__dirname + '/../model/rgn_subdistrict.model');
var Summary = sequelize.import(__dirname + '/../model/Summaries.model');
var Auth = require(__dirname + '/Auth.controller');
var Token = require(__dirname + '/Token.controller');
var Upload = require(__dirname + '/Uploads.controller');
var LaporanController = require(__dirname + '/Laporans.controller');
var moment = require('moment');
var multer = require('multer');
var Kabupaten = sequelize.import(__dirname + '/../model/rgn_city.model');
var Provinsi = sequelize.import(__dirname + '/../model/rgn_province.model');
var Negara = sequelize.import(__dirname + '/../model/rgn_country.model');

const Op = sequelize.Op;

KM.belongsTo(Desa, {foreignKey: 'fk_desaid'}); // Adds fk_desaid to Keluarga miskin
Laporans.belongsTo(KM, {foreignKey: 'fk_keluargamiskinid'});
Desa.belongsTo(Kecamatan, {foreignKey: 'district_id'});
Kecamatan.belongsTo(Kabupaten, {foreignKey: 'city_id'});
Kabupaten.belongsTo(Provinsi, {foreignKey: 'province_id'});
Provinsi.belongsTo(Negara, {foreignKey: 'country_id'});

class Patriot {
    constructor() {
        this.info;
        this.storage;
        this.upload;
        this.keluargayangdipantau;
    }

    GetProfileAccount(req, res) {
        this.info = Token.DecodeToken(req.headers.token);
        if(!Auth.CheckingAuth(this.info.role, "patriots")) {
            res.status(401)
            .json({
                message: "sorry anda tidak memiliki wewenang untuk mengakses ini",
            });
        } else {
            if (this.info.role == "patriots"){
                Patriots
                    .findOne({
                        where: {
                            id: this.info.token.id
                        },
                        attributes: ['id', 'nama', 'alamat', 'gender', 'email', 'bergabung', 'laporanterkirim', 'pathfoto', 'fk_desaid', 'keluargayangdipantau']
                    })
                    .then((patriot) => {
                        console.log('masuk sini', patriot, this.info)
                        var jeniskelamin;
                        var lamabergabung;
                        // check jenis kelamin
                        if(patriot.dataValues.gender) {
                            jeniskelamin = 'laki-laki';
                        } else {
                            jeniskelamin = 'perempuan';
                        }
                        // check lama bergabung
                        if(moment(new Date).diff(patriot.dataValues.bergabung, 'years') > 0) {
                            lamabergabung = moment(new Date).diff(patriot.dataValues.bergabung, 'years') + ' tahun yang lalu';
                        } else if(moment(new Date).diff(patriot.dataValues.bergabung, 'months') > 0) {
                            lamabergabung = moment(new Date).diff(patriot.dataValues.bergabung, 'months') + ' bulan yang lalu';
                        } else if(moment(new Date).diff(patriot.dataValues.bergabung, 'weeks') > 0) {
                            lamabergabung = moment(new Date).diff(patriot.dataValues.bergabung, 'weeks') + ' minggu yang lalu';
                        } else if(moment(new Date).diff(patriot.dataValues.bergabung, 'days')) {
                            lamabergabung = moment(new Date).diff(patriot.dataValues.bergabung, 'days') + ' hari yang lalu';
                        } else if(moment(new Date).diff(patriot.dataValues.bergabung, 'hours') > 0) {
                            lamabergabung = moment(new Date).diff(patriot.dataValues.bergabung, 'hours') + ' jam yang lalu';
                        } else if(moment(new Date).diff(patriot.dataValues.bergabung, 'minutes') > 5) {
                            lamabergabung = moment(new Date).diff(patriot.dataValues.bergabung, 'minutes') + ' menit yang lalu';
                        } else {
                            lamabergabung = 'beberapa saat yang lalu';
                        }
                        res.json({
                                status: true,
                                message: "Berhasil mendapatkan data profile",
                                data: {
                                    id: patriot.dataValues.id,
                                    nama: patriot.dataValues.nama,
                                    email: patriot.dataValues.email,
                                    gender: jeniskelamin,
                                    alamat: patriot.dataValues.alamat,
                                    laporanterkirim: patriot.dataValues.laporanterkirim,
                                    keluargayangdipantau: patriot.dataValues.keluargayangdipantau,
                                    fk_desaid: patriot.dataValues.fk_desaid,
                                    pathfoto: '/public/images/profilePatriots/' + patriot.dataValues.pathfoto,
                                    lamabergabung: lamabergabung
                                }
                            });
                    })
                    .catch((err) => {
                        res.json({
                                status: false,
                                message: "Internal Server Error, mencari patriot",
                                info: err
                            })
                    });
            } else {
                res.json({
                        status: false,
                        message: "Auth failed, Anda bukan patriots"
                    });
            }
        }
    }

    UpdateProfileAccount(req, res) {
        this.info = Token.DecodeToken(req.headers.token);
        if(!Auth.CheckingAuth(this.info.role, "patriots")) {
            res.json({
                status: false,
                message: "sorry anda tidak memiliki wewenang untuk mengakses ini",
            });
        } else {
            Patriots
                .update({
                    nama: req.body.nama,
                    gender: req.body.gender,
                    password: Auth.SetPassword(req.body.password),
                }, {
                    where: {
                        id: this.info.token.id
                    }
                })
                .then((result) => {
                    Patriots
                        .findOne({
                            where: {
                                id: this.info.token.id
                            }
                        })
                        .then((updated) => {
                            res.json({
                                    status: true,
                                    message: "berhasil memperbarui profile",
                                    info: result,
                                    token: Token.SetupToken(updated, "patriots")
                                });
                        })
                        .catch((err) => {
                            res.json({
                                    status: false,
                                    message: "Internal Server Error, saat mendapatkan biodata baru",
                                    info: err
                                });        
                        })
                })
                .catch((err) => {
                    res.json({
                            status: false,
                            message: "Internal Server Error, saat mendapatkan biodata",
                            info: err
                        });
                });
        }
    }

    UpdatePhotoProfileAccount(req, res) {
        this.info = Token.DecodeToken(req.headers.token);
        if(!Auth.CheckingAuth(this.info.role, "patriots")) {
            res.json({
                status: false,
                message: "sorry anda tidak memiliki wewenang untuk mengakses ini",
            });
        } else {
            this.storage = Upload.SetStorage('/../public/images/profilePatriots');
            this.upload = Upload.SetUpload(this.storage);
            this.upload(req, res, (err) => {
                Patriots
                    .update({
                        pathfoto: req.file.filename
                    }, {
                        where: {
                            id: this.info.token.id
                        }
                    })
                    .then((result) => {
                        Patriots
                            .findOne({
                                where: {
                                    id: this.info.token.id
                                }
                            })
                            .then((updated) => {
                                Upload.DeleteFile('/../public/images/profilePatriots/' + this.info.token.pathfoto);
                                updated = JSON.parse(JSON.stringify(updated));
                                res.json({
                                        status: true,
                                        message: "Berhasil memperbarui photo profile",
                                        info: result,
                                        token: Token.SetupToken(updated, "patriots")
                                    });
                            })
                            .catch((err) => {
                                Upload.DeleteFile('/../public/images/profilePatriots/' + req.file.filename);
                                res.json({
                                        status: false,
                                        message: "Internal Server Error, saat get data pada ganti Photo Profile",
                                        info: err
                                    }) ;
                            });
                    })
                    .catch((err) => {
                        Upload.DeleteFile('/../public/images/profilePatriots/' + req.file.filename);
                        res.json({
                                status: false,
                                message: "Internal Server Error, saat mengganti photo profile",
                                info: err
                            });
                    });
            });
        }
    }

    AddKeluargaMiskin(req, res) {
        this.info = Token.DecodeToken(req.headers.token);
        if (Auth.CheckingAuth(this.info.role, "patriots")) {
            this.keluargayangdipantau = this.info.token.keluargayangdipantau;
            this.id = this.info.token.id;
            if(this.keluargayangdipantau < 10) {
                this.storage = Upload.SetStorage('/../public/images/keluargaMiskins');
                this.upload = Upload.SetUpload(this.storage);
                this.upload(req, res, (err) => {
                    if (err == null){
                        Patriots
                            .findOne({
                                where: {
                                    id: this.id
                                }
                            })
                            .then((patriot) => {
                                patriot = JSON.parse(JSON.stringify(patriot))
                                if(patriot.keluargayangdipantau >= 10) {
                                    Upload.DeleteFile('/../public/images/keluargaMiskins/' + req.file.filename);
                                    res.json({
                                            status: false,
                                            message: "Sudah memantau lebih dari 10 keluarga miskin"
                                        });
                                } else {
                                    patriot.keluargayangdipantau += 1;
                                    Patriots
                                        .update({
                                            keluargayangdipantau: patriot.keluargayangdipantau
                                        }, {
                                            where: {
                                                id: this.id
                                            }
                                        })
                                        .then((result) => {
                                            KM
                                                .create({
                                                    namakeluarga: req.body.namakeluarga,
                                                    fk_desaid: this.info.token.fk_desaid,
                                                    alamat: req.body.alamat,
                                                    pathfoto: req.file.filename,
                                                    fk_patriotid: this.info.token.id,
                                                    bulanterakhirmelaporkan: moment().month()-1,
                                                    status: 0
                                                })
                                                .then((result) => {
                                                    Desa
                                                        .findOne({
                                                            where: {
                                                                id: this.info.token.fk_desaid
                                                            }
                                                        })
                                                        .then((desa) => {
                                                            desa = JSON.parse(JSON.stringify(desa));
                                                            Kecamatan
                                                                .update({
                                                                    jumlahkeluarga: sequelize.literal('jumlahkeluarga + 1')
                                                                },{
                                                                    where: {
                                                                        id: desa.district_id
                                                                    }
                                                                })
                                                                .then((kecamatan) => {
                                                                    res.json({
                                                                            status: true,
                                                                            message: "berhasil menambahkan keluarga miskin baru",
                                                                            info: result
                                                                        });
                                                                })
                                                                .catch((err) => {
                                                                    res.json({
                                                                            status: false,
                                                                            message: "Internal Server Error, update jumlah keluarga di kecamatan"
                                                                        });
                                                                });
                                                        })
                                                })
                                                .catch((err) => {
                                                    Upload.DeleteFile('/../public/images/keluargaMiskins/' + req.file.filename);
                                                    res.json({
                                                            status: false,
                                                            message: "Gagal membuat keluarga miskin baru",
                                                            info: err
                                                        });
                                                });
                                        })
                                        .catch((err) => {
                                            Upload.DeleteFile('/../public/images/keluargaMiskins/' + req.file.filename);
                                            res.json({
                                                    status: false,
                                                    message: "Gagal update jumlah keluarga yang dipantau patriot",
                                                    info: err
                                                });
                                        });
                                }
                            })
                            .catch((err) => {
                                res.json({
                                        status: false,
                                        message: "Internal Server Error, medapatkan patriot",
                                        info: err
                                    });
                            });
                    } else {
                        res.json({
                                status: false,
                                message: "Upload gagal"
                            });
                    }
                });
            } else {
                res.json({
                        status: false,
                        message: "Sudah 10 keluarga yang dipantau, tidak dapat menambahkan keluarga baru",
                    });
            }
        } else {
            res.json({
                    status: false,
                    message: "Auth failed, Anda bukan patriots"
                });
        }
    }

    CreateLaporan(req,res) {
        this.info = Token.DecodeToken(req.headers.token);
        if (Auth.CheckingAuth(this.info.role, "patriots")){
            this.storage = Upload.SetStorage('/../public/images/laporans');
            this.upload = Upload.SetUpload(this.storage);
            this.upload(req, res, (err) => {
                if (err == null) {
                    Laporans
                        .findOne({
                            where: {
                                fk_keluargamiskinid: req.params.KMid,
                                minggu: moment().week(),
                                bulan: moment().month(),
                                tahun: moment().year()
                            }
                        })
                        .then((laporan) => {
                            if(laporan != null) {
                                Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                                res.status(200)
                                    .json({
                                        message: "Laporan minggu ini telah dibuat",
                                        info: laporan
                                    })
                            } else {
                                Laporans
                                    .create({
                                        q1: req.body.q1,
                                        q2: req.body.q2,
                                        q3: req.body.q3,
                                        q4: req.body.q4,
                                        q5: req.body.q5,
                                        q6: req.body.q6,
                                        q7: req.body.q7,
                                        q8: req.body.q8,
                                        q9: req.body.q9,
                                        q10: req.body.q10,
                                        pathfoto: req.file.filename,
                                        deskripsi: req.body.deskripsi,
                                        fk_keluargamiskinid: req.params.KMid,
                                        minggu: moment().week(),
                                        bulan: moment().month(),
                                        tahun: moment().year()
                                    })
                                    .then((result) => {
                                        Patriots
                                            .update({
                                                laporanterkirim: sequelize.literal('laporanterkirim + 1')
                                            }, {
                                                where: {
                                                    id: this.info.token.id
                                                }
                                            })
                                            .then((patriot) => {
                                                KM
                                                    .update({
                                                        bulanterakhirmelaporkan: moment().month(),
                                                        status: LaporanController.GetStatusKeluargaMiskin(req.body),
                                                    },{
                                                        where: {
                                                            id: req.params.KMid
                                                        }
                                                    })
                                                    .then((km) => {
                                                        // dapetin kecamatan id
                                                        Desa
                                                            .findOne({
                                                                where: {
                                                                    id: this.info.token.fk_desaid
                                                                }
                                                            })
                                                            .then((desa) => {
                                                                // update rangkuman laporan
                                                                desa = JSON.parse(JSON.stringify(desa));
                                                                Summary
                                                                    .update({
                                                                        q1: sequelize.literal('q1 + ' + req.body.q1),
                                                                        q2: sequelize.literal('q2 + ' + req.body.q2),
                                                                        q3: sequelize.literal('q3 + ' + req.body.q3),
                                                                        q4: sequelize.literal('q4 + ' + req.body.q4),
                                                                        q5: sequelize.literal('q5 + ' + req.body.q5),
                                                                        q6: sequelize.literal('q6 + ' + req.body.q6),
                                                                        q7: sequelize.literal('q7 + ' + req.body.q7)
                                                                    }, {
                                                                        where: {
                                                                            bulan : moment().month(),
                                                                            tahun : moment().year(),
                                                                            fk_kecamatanid : desa.district_id
                                                                        }
                                                                    })
                                                                    .then((summary) =>{
                                                                        res.json({
                                                                                status: true,
                                                                                message: "Berhasil menambahkan laporan minggu ini",
                                                                                info: km
                                                                            });
                                                                    })
                                                                    .catch((err) =>{
                                                                        Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                                                                        res.json({
                                                                                status: false,
                                                                                message: "Gagal menambahkan laporan minggu ini pada update summary",
                                                                                info: err
                                                                            });
                                                                    });
                                                            })
                                                            .catch((err) => {
                                                                Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                                                                res.json({
                                                                        status: false,
                                                                        message: "Gagal menambahkan laporan minggu ini pada get kecamatan id",
                                                                        info: err
                                                                    });
                                                            })
                                                    })
                                                    .catch((err) => {
                                                        Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                                                        res.json({
                                                                status: false,
                                                                message: "Gagal menambahkan laporan minggu ini pada keluarga miskin",
                                                                info: err
                                                            });
                                                    });    
                                            })
                                            .catch((err) => {
                                                Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                                                res.json({
                                                        status: false,
                                                        message: "Gagal menambahkan laporan minggu ini pada update patriot",
                                                        info: err
                                                    });
                                            });
                                    })
                                    .catch((err) => {
                                        Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                                        res.json({
                                                status: false,
                                                message: "Gagal menambahkan laporan minggu ini pada menambahkan laporan",
                                                info: err
                                            });
                                    });
                            }
                        })
                        .catch((err) => {
                            Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                            res.json({
                                    status: false,
                                    message: "Internal Server Error, saat mencari laporan"
                                });
                        });
                } else {
                    res.json({
                            status: false,
                            message: "Upload gagal"
                        });
                }
            });
        } else {
             res.json({
                    status: false,
                    message: "Auth failed, Anda bukan patriots"
                });
        }
    }

    GetKeluargaMiskinYangDipantau(req, res){ 
        this.info = Token.DecodeToken(req.headers.token);
        if (this.info.role == "patriots"){
            KM
                .findAll({
                    where: {
                        fk_patriotid: this.info.token.id
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
                    }]
                })
                .then((keluargaMiskin) =>{
                    res.json({
                            status: true,
                            message : "Berhasil mendapatkan keluarga miskin",
                            data: keluargaMiskin
                        })
                })
                .catch((err) => {
                    res.json({
                            status: false,
                            message: "Internal Server Error, saat mendapatkan data keluarga yang saya pantau",
                            info: err
                        })
                });
        } else {
            res.json({
                    status: false,
                    message: "Auth failed, Anda bukan patriot"
                });
        }
    }

    GetJumlahPatriots(req,res){
        Patriots
            .count()
            .then((jumlahPatriot) =>{
                res.json({
                    status: true,
                    message: "Berhasil jumlah patriot",
                    data: jumlahPatriot
                })
            })
            .catch((err) => {
                res.json({
                    status : false,
                    message: "Internal Server Error"
                })
            })
    }

    GetJumlahPatriotsByTahun(req,res){
        Patriots
            .count({
                where : {
                    bergabung : {
                        [Op.gte] : new Date(req.params.year, 0, 1), //year pake int, yang paling kanan tanggal
                        [Op.lt] : new Date(req.params.year + 1, 0, 1), //month pake int
                    }
                }
            })
            .then((jumlahPatriot) =>{
                res.json({
                    status: true,
                    message: "Berhasil jumlah patriot by tahun",
                    data: jumlahPatriot
                })
            })
            .catch((err) => {
                res.json({
                    status : false,
                    message: "Internal Server Error"
                })
            })
    }
}

module.exports = new Patriot;
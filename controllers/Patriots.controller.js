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

KM.belongsTo(Desa, {foreignKey: 'fk_desaid'}); // Adds fk_desaid to Keluarga miskin
Laporans.belongsTo(KM, {foreignKey: 'fk_keluargamiskinid'});
Desa.belongsTo(Kecamatan, {foreignKey: 'district_id'});

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
                        attributes: ['id', 'nama', 'alamat', 'gender', 'email', 'bergabung', 'laporanterkirim', 'pathfoto']
                    })
                    .then((patriot) => {
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
                        res.status(200)
                            .json({
                                message: "Berhasil mendapatkan data profile",
                                data: {
                                    nama: patriot.dataValues.nama,
                                    email: patriot.dataValues.email,
                                    gender: jeniskelamin,
                                    alamat: patriot.dataValues.alamat,
                                    pathfoto: '/public/images/profilePatriots/' + patriot.dataValues.pathfoto,
                                    lamabergabung: lamabergabung
                                }
                            });
                    })
                    .catch((err) => {
                        res.status(500)
                            .json({
                                message: "Internal Server Error"
                            })
                    });
            } else {
                res.status(401)
                    .json({
                        message: "Auth failed, Anda bukan patriots"
                    });
            }
        }
    }

    UpdateProfileAccount(req, res) {
        this.info = Token.DecodeToken(req.headers.token);
        if(!Auth.CheckingAuth(this.info.role, "patriots")) {
            res.status(401)
            .json({
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
                            res.status(200)
                                .json({
                                    message: "berhasil memperbarui profile",
                                    info: result,
                                    token: Token.SetupToken(updated, "patriots")
                                });
                        })
                        .catch((err) => {
                            res.status(500)
                                .json({
                                    message: "Internal Server Error, saat update biodatas",
                                    info: err
                                });        
                        })
                })
                .catch((err) => {
                    res.status(500)
                        .json({
                            message: "Internal Server Error",
                            info: err
                        });
                });
        }
    }

    UpdatePhotoProfileAccount(req, res) {
        this.info = Token.DecodeToken(req.headers.token);
        if(!Auth.CheckingAuth(this.info.role, "patriots")) {
            res.status(401)
            .json({
                message: "sorry anda tidak memiliki wewenang untuk mengakses ini",
            });
        } else {
            this.storage = Upload.SetStorage('/../public/images/profilePatriots');
            this.upload = Upload.SetUpload(this.storage)
            console.log(this.info, req.body, req.file, this.storage);
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
                                res.status(200)
                                    .json({
                                        message: "Berhasil memperbarui photo profile",
                                        info: result,
                                        token: Token.SetupToken(updated, "patriots")
                                    });
                            })
                            .catch((err) => {
                                Upload.DeleteFile('/../public/images/profilePatriots/' + req.file.filename);
                                res.status(500)
                                    .json({
                                        message: "Internal Server Error, saat get data pada ganti Photo Profile",
                                        info: err
                                    }) ;
                            });
                    })
                    .catch((err) => {
                        Upload.DeleteFile('/../public/images/profilePatriots/' + req.file.filename);
                        res.status(500)
                            .json({
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
                                if(patriot.dataValues.keluargayangdipantau >= 10) {
                                    Upload.DeleteFile('/../public/images/keluargaMiskins/' + req.file.filename);
                                    res.status(200)
                                        .json({
                                            message: "Sudah memantau lebih dari 10 keluarga miskin"
                                        });
                                } else {
                                    patriot.dataValues.keluargayangdipantau += 1;
                                    Patriots
                                        .update({
                                            keluargayangdipantau: patriot.dataValues.keluargayangdipantau
                                        }, {
                                            where: {
                                                id: this.id
                                            }
                                        })
                                        .then((result) => {
                                            Desa
                                                .findOne({
                                                    where: {
                                                        number: req.body.desaid 
                                                    }
                                                })
                                                .then((desa) => {
                                                    KM
                                                        .create({
                                                            namakeluarga: req.body.namaKeluarga,
                                                            fk_desaid: desa.dataValues.id,
                                                            alamat: req.body.alamat,
                                                            pathfoto: req.file.filename,
                                                            fk_patriotid: this.info.token.id,
                                                            mingguterakhirmelaporkan: moment().week()-1,
                                                            status: "belum terdapat laporan"
                                                        })
                                                        .then((result) => {
                                                            Kecamatan
                                                                .update({
                                                                    jumlahkeluarga: sequelize.literal('jumlahkeluarga + 1')
                                                                },{
                                                                    where: {
                                                                        id: desa.dataValues.district_id
                                                                    }
                                                                })
                                                                .then((kecamatan) => {
                                                                    res.status(200)
                                                                        .json({
                                                                            message: "berhasil menambahkan keluarga miskin baru",
                                                                            info: result
                                                                        });
                                                                })
                                                                .catch((err) => {
                                                                    res.status(400)
                                                                        .json({
                                                                            message: "Internal Server Error"
                                                                        });
                                                                });
                                                        })
                                                        .catch((err) => {
                                                            Upload.DeleteFile('/../public/images/keluargaMiskins/' + req.file.filename);
                                                            res.status(401)
                                                                .json({
                                                                    message: "Gagal menambahkan keluarga miskin beru",
                                                                    info: err
                                                                });
                                                        });
                                                })
                                                .catch((err) => {
                                                    Upload.DeleteFile('/../public/images/keluargaMiskins/' + req.file.filename);
                                                    res.status(401)
                                                        .json({
                                                            message: "Gagal menambahkan keluarga miskin beru",
                                                            info: err
                                                        });
                                                })
                                        })
                                        .catch((err) => {
                                            Upload.DeleteFile('/../public/images/keluargaMiskins/' + req.file.filename);
                                            res.status(401)
                                                .json({
                                                    message: "Gagal menambahkan keluarga miskin beru",
                                                    info: err
                                                });
                                        });
                                }
                            })
                            .catch((err) => {
                                res.status(401)
                                    .json({
                                        message: "Internal Server Error",
                                        info: err
                                    });
                            });
                    } else {
                        res.status(401)
                            .json({
                                message: "Upload gagal"
                            });
                    }
                });
            } else {
                res.status(200)
                    .json({
                        message: "Sudah 10 keluarga yang dipantau, tidak dapat menambahkan keluarga baru",
                    });
            }
        } else {
            res.status(401)
                .json({
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
                                                        mingguterakhirmelaporkan: moment().week(),
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
                                                                        res.status(200)
                                                                            .json({
                                                                                message: "Berhasil menambahkan laporan minggu ini",
                                                                                info: km
                                                                            });
                                                                    })
                                                                    .catch((err) =>{
                                                                        Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                                                                        res.status(401)
                                                                            .json({
                                                                                message: "Gagal menambahkan laporan minggu ini pada update summary",
                                                                                info: err
                                                                            });
                                                                    });
                                                            })
                                                            .catch((err) => {
                                                                Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                                                                res.status(401)
                                                                    .json({
                                                                        message: "Gagal menambahkan laporan minggu ini pada get kecamatan id",
                                                                        info: err
                                                                    });
                                                            })
                                                    })
                                                    .catch((err) => {
                                                        Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                                                        res.status(401)
                                                            .json({
                                                                message: "Gagal menambahkan laporan minggu ini pada keluarga miskin",
                                                                info: err
                                                            });
                                                    });    
                                            })
                                            .catch((err) => {
                                                Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                                                res.status(401)
                                                    .json({
                                                        message: "Gagal menambahkan laporan minggu ini pada update patriot",
                                                        info: err
                                                    });
                                            });
                                    })
                                    .catch((err) => {
                                        Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                                        res.status(401)
                                            .json({
                                                message: "Gagal menambahkan laporan minggu ini pada menambahkan laporan",
                                                info: err
                                            });
                                    });
                            }
                        })
                        .catch((err) => {
                            Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                            res.status(500)
                                .json({
                                    message: "Internal Server Error"
                                });
                        });
                } else {
                    res.status(401)
                        .json({
                            message: "Upload gagal"
                        });
                }
            });
        } else {
             res.status(401)
                .json({
                    message: "Auth failed, Anda bukan patriots"
                });
        }
    }

    GetKeluargaMiskinYangDipantau(req, res){ //belum nested di alamat
        this.info = Token.DecodeToken(req.headers.token);
        if (this.info.role == "patriots"){
            KM
                .findAll({
                    where: {
                        fk_patriotid: this.info.token.id
                    },
                    include: [{
                        model: Desa
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
                            message: "Internal Server Error",
                            info: err
                        })
                });
        } else {
            res.status(401)
                .json({
                    message: "Auth failed, Anda bukan patriot"
                });
        }
    }
}

module.exports = new Patriot;
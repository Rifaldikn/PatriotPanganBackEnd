var Patriots = require(__dirname + '/../models/Patriots.model');
var KM = require(__dirname + '/../models/KeluargaMiskins.model');
var Laporans = require(__dirname + '/../models/Laporans.model');
var Auth = require(__dirname + '/Auth.controller');
var Token = require(__dirname + '/Token.controller');
var Upload = require(__dirname + '/Uploads.controller');
var LaporanController = require(__dirname + '/Laporans.controller');
var moment = require('moment');
var multer = require('multer');

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
                    .find()
                    .where('_id').equals(this.info.token[0]._id)
                    .select('nama alamat gender email bergabung laporanterkirim pathfoto')
                    .exec()
                    .then((patriot) => {
                        var jeniskelamin;
                        var lamabergabung;
                        // check jenis kelamin
                        if(patriot[0].gender) {
                            jeniskelamin = 'laki-laki';
                        } else {
                            jeniskelamin = 'perempuan';
                        }
                        // check lama bergabung
                        if(moment(new Date).diff(patriot[0].bergabung, 'years') > 0) {
                            lamabergabung = moment(new Date).diff(patriot[0].bergabung, 'years') + ' tahun yang lalu';
                        } else if(moment(new Date).diff(patriot[0].bergabung, 'months') > 0) {
                            lamabergabung = moment(new Date).diff(patriot[0].bergabung, 'months') + ' bulan yang lalu';
                        } else if(moment(new Date).diff(patriot[0].bergabung, 'weeks') > 0) {
                            lamabergabung = moment(new Date).diff(patriot[0].bergabung, 'weeks') + ' minggu yang lalu';
                        } else if(moment(new Date).diff(patriot[0].bergabung, 'days')) {
                            lamabergabung = moment(new Date).diff(patriot[0].bergabung, 'days') + ' hari yang lalu';
                        } else if(moment(new Date).diff(patriot[0].bergabung, 'hours') > 0) {
                            lamabergabung = moment(new Date).diff(patriot[0].bergabung, 'hours') + ' jam yang lalu';
                        } else if(moment(new Date).diff(patriot[0].bergabung, 'minutes') > 5) {
                            lamabergabung = moment(new Date).diff(patriot[0].bergabung, 'minutes') + ' menit yang lalu';
                        } else {
                            lamabergabung = 'beberapa saat yang lalu';
                        }
                        res.status(200)
                            .json({
                                message: "Berhasil mendapatkan data profile",
                                data: {
                                    nama: patriot[0].nama,
                                    email: patriot[0].email,
                                    gender: jeniskelamin,
                                    alamat: patriot[0].alamat,
                                    pathfoto: patriot[0].pathfoto,
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

    AddKeluargaMiskin(req, res) {
        this.info = Token.DecodeToken(req.headers.token);
        if (Auth.CheckingAuth(this.info.role, "patriots")) {
            this.keluargayangdipantau = this.info.token[0].keluargayangdipantau;
            this.id = this.info.token[0]._id;
            if(this.keluargayangdipantau < 10) {
                this.storage = Upload.SetStorage('/../public/images/keluargaMiskins');
                this.upload = Upload.SetUpload(this.storage);
                this.upload(req, res, (err) => {
                    if (err == null){
                        var NewKM = new KM({
                            namaKeluarga: req.body.namaKeluarga,
                            fk_desaid: req.body.desaid,
                            alamat: req.body.alamat,
                            pathfoto: req.file.filename,
                            fk_patriotid: this.info.token[0]._id,
                            mingguterakhirmelaporkan: moment().week()-1,
                            status: "belum terdapat laporan"
                        });
                        Patriots
                            .find({
                                _id: this.id
                            })
                            .then((patriot) => {
                                if(patriot[0].keluargayangdipantau >= 10) {
                                    Upload.DeleteFile('/../public/images/keluargaMiskins/' + req.file.filename);
                                    res.status(200)
                                        .json({
                                            message: "Sudah memantau lebih dari 10 keluarga miskin"
                                        });
                                } else {
                                    patriot[0].keluargayangdipantau += 1;
                                    patriot[0].save();
                                    NewKM
                                        .save()
                                        .then((result) => {
                                            res.status(200)
                                                .json({
                                                    message: "berhasil menambahkan keluarga miskin baru",
                                                    info: result
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
                        .find({
                            fk_keluargamiskinid: req.params.KMid,
                            minggu: moment().week(),
                            bulan: moment().month(),
                            tahun: moment().year()
                        })
                        .then((laporan) => {
                            if(laporan.length >= 1) {
                                Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                                res.status(200)
                                    .json({
                                        message: "Laporan minggu ini telah dibuat",
                                        info: laporan
                                    })
                            } else {
                                var NewLaporan = new Laporans({
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
                                NewLaporan
                                    .save()
                                    .then((result) => {
                                        KM
                                            .find({
                                                _id: req.params.KMid
                                            })
                                            .then((km) => {
                                                km[0].status = LaporanController.GetStatusKeluargaMiskin(req.body);
                                                km[0].mingguterakhirmelaporkan = moment().week();
                                                km[0].save()
                                            });
                                        Patriots
                                            .find({
                                                _id: this.info.token[0]._id
                                            })
                                            .then((patriot) => {
                                                patriot[0].laporanterkirim += 1;
                                                patriot[0].save();
                                            })
                                        res.status(200)
                                            .json({
                                                message: "Berhasil menambahkan laporan minggu ini",
                                                info: result
                                            });
                                    })
                                    .catch((err) => {
                                        Upload.DeleteFile('/../public/images/laporans/' + req.file.filename);
                                        res.status(401)
                                            json({
                                                message: "Gagal menambahkan laporan minggu ini",
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
                .find()
                .where('fk_patriotid').equals(this.info.token[0]._id)
                .populate('fk_desaid', nama)
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
                    message: "Auth failed, Anda bukan patriot"
                });
        }
    }
}

module.exports = new Patriot;
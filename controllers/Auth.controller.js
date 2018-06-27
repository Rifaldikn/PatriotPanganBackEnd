var bcrypt = require('bcrypt');
// var multer = require('multer');
var Token = require(__dirname + '/Token.controller');
var Upload = require(__dirname + '/Uploads.controller');
var Patriots = require(__dirname + '/../models/Patriots.model');
var sequelize = require(__dirname + '/../dbconnection');
var Admins = sequelize.import(__dirname + '/../model/Admins.model');
var Patriots = sequelize.import(__dirname + '/../model/Patriots.model');
var Kabupaten = sequelize.import(__dirname + '/../model/rgn_city.model');
var Kecamatan = sequelize.import(__dirname + '/../model/rgn_district.model');
var NodeGeocoder = require('node-geocoder');

class Auth {
    constructor() {
        this.token;
    }

    CheckingAuth(role, hakAkses) {
        if(role == hakAkses) {
            return true;
        } else {
            return false;
        }
    }

    SetPassword(data) {
        return bcrypt.hashSync(data, 10);
    }

    ComparePassword(passwordInput, passwordDB) {
        return bcrypt.compareSync(passwordInput, passwordDB);
    }

    SignUpPatriot(req, res) {
        this.storage = Upload.SetStorage('/../public/images/profilePatriots/');
        this.upload = Upload.SetUpload(this.storage);
        this.upload(req, res ,(err) => {
            Patriots
                .findOne({
                    where: {
                        email: req.body.email
                    }
                })
                .then((patriot) => {
                    if(patriot != null) {
                        Upload.DeleteFile('/../public/images/profilePatriots/' + req.file.filename);
                        res.json({
                                status: false,
                                message: "Mail Exists, please use another email"
                            });
                    } else {
                        Patriots
                            .create({
                                email: req.body.email,
                                password: this.SetPassword(req.body.password),
                                nama: req.body.nama,
                                gender: req.body.gender,
                                fk_desaid: req.body.fk_desaid,
                                alamat: req.body.alamat,
                                pathfoto: req.file.filename
                            })
                            .then((result) => {
                                res.json({
                                        status: true,
                                        message: "Berhasil mendaftarkan patriot baru",
                                        info: result
                                    })
                            })
                            .catch((err) => {
                                Upload.DeleteFile('/../public/images/profilePatriots/' + req.file.filename);
                                res.json({
                                        status: false,
                                        message: "Tidak dapat mendaftarkan patriot baru",
                                        info: err
                                    });
                            })
                    }
                })
                .catch((err) => {
                    Upload.DeleteFile('/../public/images/profilePatriots/' + req.file.filename);
                    res.json({
                            status: false,
                            message: "Internal server error",
                            info: err
                        });
                });
        });
    }

    LoginPatriot(req, res) {
        Patriots
            .findOne({
                where: {
                    email: req.body.email
                }
            })
            .then((patriots) => {
                if(patriots == null) {
                    res.json({
                            status: false,
                            message: "Auth failed, email wasn't register",
                        });
                } else {
                    if(this.ComparePassword(req.body.password, patriots.dataValues.password)) {
                        this.token = Token.SetupToken(patriots, "patriots");
                        res.json({
                                status: true,
                                message: "Auth successful", 
                                token: this.token
                            });
                    } else {
                        res.json({
                                status: false,
                                message: "Auth failed, password didn't match"
                            });
                    }
                }
            })
            .catch((err) => {
                res.json({
                        status: false,
                        message: "Internal server error",
                        info: err
                    })
            })
    }

    SignUpAdmin(req, res) {
        Admins
            .findOne({
                where: {
                    email: req.body.email
                }
            })
            .then((admin) => {
                if(admin == null) {
                    Admins
                        .create({
                            email: req.body.email,
                            password: this.SetPassword(req.body.password),
                            nama: req.body.nama 
                        })
                        .then((result) => {
                            res.json({
                                    status: true,
                                    message: "Berhasil mendaftarkan admin baru",
                                    info: result
                                });
                        })
                        .catch((err) => {
                            res.json({
                                    status: false,
                                    message: "Internal server error",
                                    info: err
                                });
                        })
                } else {
                    res.json({
                            status: false,
                            message: "Email already exists"
                        });
                }
            })
            .catch((err) => {
                res.json({
                        status: false,
                        message: "Internal server error",
                        info: err
                    });
            });
    }

    LoginAdmin(req, res) {
        Admins
            .findOne({
                where: {
                    email: req.body.email
                }
            })
            .then((admin) => {
                if(admin == null) {
                    res.json({
                        status: false,
                        message: "Auth failed, email wasn't register"
                    });
                } else {
                    if(this.ComparePassword(req.body.password, admin.dataValues.password)) {
                        this.token = Token.SetupToken(admin, "admin");
                        res.json({
                                status: true,
                                message: "Auth successfull",
                                token: this.token
                            });
                    } else {
                        res.json({
                                status: false,
                                message: "Auth failed, Password didn't match"
                            });
                    }
                }
            })
            .catch((err) => {
                res.json({
                        status: false,
                        message: "Internal server error"
                    });
            });
    }

    getLatLng(req, res) {
        var options = {
            provider: 'google',
            // AIzaSyCRejJ_Fx6cRxYihVAHhn_JCBw-R5mWHI8 punya ayu
            // AIzaSyDjmRcLp_iGDtgGIAifDO9PpYtdm8hy7dE punya parhanzikkry
            // AIzaSyAmcPNYLtawhT5UR-p3EZUBJ3yZnC30pTY punya parhanzp
            // Optional depending on the providers
            httpAdapter: 'https', // Default
            apiKey: 'AIzaSyCRejJ_Fx6cRxYihVAHhn_JCBw-R5mWHI8', // for Mapquest, OpenCage, Google Premier
            formatter: null         // 'gpx', 'string', ...
        };
        // {"id_kab" : "2101"}
        var geocoder = NodeGeocoder(options);
        Kecamatan
            .findAll({
                where: {
                    number: {
                        $like: '92%' //ganti sesuai dengan id provinsi yang ingin dicari
                    }
                }
            })
            .then((result) => {
                result = JSON.parse(JSON.stringify(result));
                for(let i=0; i<result.length; i++) {
                    setTimeout(function () {
                        console.log('out of coder', i, result[i].name);
                        geocoder.geocode(result[i].name + ', Papua') //ganti sesuai dengan name dari id provinsi tersebut
                            .then((latlng) => {
                                Kecamatan
                                    .update({
                                        lat: latlng[0].latitude,
                                        lng: latlng[0].longitude
                                    }, {
                                        where: {
                                            id: result[i].id
                                        }
                                    })
                                    .then((info) => {
                                        console.log('engga error', i);
                                    })
                                    .catch((err) => {
                                        console.log('error', err, i, result[i]);
                                    });
                            })
                            .catch((err) => {
                                console.log('error lagi masa?',err);
                            });
                    }, 500);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    
}

module.exports = new Auth;
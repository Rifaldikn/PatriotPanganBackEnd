var sequelize = require(__dirname + '/../dbconnection');
var moment = require('moment');
var Artikels = sequelize.import(__dirname + '/../model/Artikels.model');
var Patriots = sequelize.import(__dirname + '/../model/Patriots.model');
var Summary = sequelize.import(__dirname + '/../model/Summaries.model.js');

class Website {
    constructor() {
        this.totalartikel;
        this.totalpatriot;
        this.totalkerawanan;
    }

    Homepage(req, res) {
        var bulan;
		var tahun;
		if(moment().month() == 0) {
			bulan = 11;
			tahun = moment().year() - 1;
		} else {
			bulan = moment().month()-1;
			tahun = moment().year();
		}
        Artikels
            .count()
            .then((totalartikel) => {
                this.totalartikel = totalartikel;
            })
        Patriots
            .count()
            .then((totalpatriot) => {
                this.totalpatriot = totalpatriot;
                Summary
                    .count({
                        where: {
                            kondisi: {
                                $not: 0
                            },
                            bulan: bulan+1,
                            tahun: tahun
                        }
                    })
                    .then((totalkerawanan) => {
                        this.totalkerawanan = totalkerawanan;
                        res.json({
                            status: true,
                            message: "Berhasil mendapatkan data untuk homepage website",
                            data: {
                                totalpatriot: this.totalpatriot,
                                totalartikel: this.totalartikel,
                                totalkerawanan: this.totalkerawanan
                            }
                        });
                    })
                    .catch((err) => {
                        res.json({
                            statsu: false,
                            message: "Gagal mendapatkan data untuk homepage",
                            info: err
                        });
                    });
            });
    }

}

module.exports = new Website;
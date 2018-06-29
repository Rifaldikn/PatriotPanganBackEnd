var sequelize = require(__dirname + '/../dbconnection');
var Token = require(__dirname + '/Token.controller');
var Laporan = require(__dirname + '/Laporans.controller');
var Summaries = sequelize.import(__dirname + '/../model/Summaries.model');
var Desa = sequelize.import(__dirname + '/../model/rgn_subdistrict.model');
var Kecamatan = sequelize.import(__dirname + '/../model/rgn_district.model');
var Kabupaten = sequelize.import(__dirname + '/../model/rgn_city.model');
var moment = require('moment');

Desa.belongsTo(Kecamatan, {foreignKey: 'district_id'});
Summaries.belongsTo(Kecamatan, {foreignKey: 'fk_kecamatanid'});

const Op = sequelize.Op;

class Summarie {
	constructor() {
        this.info;
    } 

    //tanpa request
	AddSummaries(data) { //data dari laporan
		this.info = Token.DecodeToken(req.headers.token);
		console.log('masuk sini', data, this.info)
		Desa
			.findOne({
				where: {
					id: this.info.token.fk_desaid
				}
			})
			.then((desa) => {
				console.log('jancuk', desa);
				Summaries
					.update({
						q1: sequelize.literal('q1 + ' + data.q1),
						q2: sequelize.literal('q2 + ' + data.q2),
						q3: sequelize.literal('q3 + ' + data.q3),
						q4: sequelize.literal('q4 + ' + data.q4),
						q5: sequelize.literal('q5 + ' + data.q5),
						q6: sequelize.literal('q6 + ' + data.q6),
						q7: sequelize.literal('q7 + ' + data.q7)
					},{
						where: {
							[Op.and]: [
								{bulan : data.bulan},
								{tahun : data.tahun},
								{fk_kecamatanid : desa.fk_kecamatanid}
							]
						}
					})
					.then((summary) =>{
						
					})
					.catch((err) =>{
		
					});
			})
			.catch((err) => {

			})
    }

    GetJumlahTarafKec(req, res) {
    	Kecamatan
    		.count()
    		.then((jumlah) =>{
    			Summaries
    				.count({
						group: 'kondisi',
						attributes: ['kondisi']
    				},{
                        where: {
                            [Op.and]: [
                                {bulan : req.body.bulan},
                                {tahun : req.body.tahun}
                            ]
                        }
                    })
    				.then((jumSummary) => {
    					res.json({
								status: true,
    							message : "Berhasil mendapatkan jumlah Kecamatan berdasarkan Taraf",
								data : {
									jumlahTaraf : jumSummary,
									jumlahKecamatan : jumlah 
								}    						
    						})
    				})
    				.catch((err)=>{
    					res.json({
								status: false,
    							message: "Jumlah summary tidak didapatkan",
    							info: err
    						})
    				})
    		})
    		.catch((err) => {
    			res.json({
						status: false,
    					message: "Internal Server Error",
    					info: err
    				})
    		})
    }

    GetSummaries(req, res){
    	Summaries
            .findAll({
                where: {
                    [Op.and]: [
                        {bulan : req.params.bulan},
                        {tahun : req.params.tahun}
                    ]
				},
				attributes: [
					[sequelize.fn('SUM', sequelize.col('q1')), 'q1'],
					[sequelize.fn('SUM', sequelize.col('q2')), 'q2'],
					[sequelize.fn('SUM', sequelize.col('q3')), 'q3'],
					[sequelize.fn('SUM', sequelize.col('q4')), 'q4'],
					[sequelize.fn('SUM', sequelize.col('q5')), 'q5'],
					[sequelize.fn('SUM', sequelize.col('q6')), 'q6'],
					[sequelize.fn('SUM', sequelize.col('q7')), 'q7'],
					'bulan', 'tahun'
				]
            })
            .then((summary) => {
                res.json({
						status: true,
                        message: "Berhasil mendapatkan summary pada bulan tertentu",
                        data: summary
                    })
            })
            .catch((err) => {
                res.json({
						status: false,
                        message: "Internal Server Error",
                        info: err
                    })
            });
    }

    GetTotalKecRawanPangan(req, res){
        Summaries.
            count({
                where : {
                    kondisi : {
                        [Op.not] : 0
                    },
                    bulan: moment().month(),
                    tahun: moment().year()
                }
            })
            .then((jumlahKecRawanPangan) => {
                res.json({
                    status: true,
                    message: "Berhasil jumlah kecamatan rawan pangan",
                    data: jumlahKecRawanPangan
                })
            })
            .catch((err) => {
                res.json({
                    status : false,
                    message: "Internal Server Error"
                })
            })
	}
	
	// untuk peta dan piechart di mobile
	GetKondisiRawanByLokasi(req, res) {
		this.info = Token.DecodeToken(req.headers.token);
		var bulan;
		var tahun;
		if(moment().month() == 0) {
			bulan = 11;
			tahun = moment().year() - 1;
		} else {
			bulan = moment().month() - 1;
			tahun = moment().year();
		}
		Desa
			.findOne({
				where: {
					id: this.info.token.fk_desaid
				}
			})
			.then((iddesa) => {
				iddesa = JSON.parse(JSON.stringify(iddesa));
				Kabupaten
					.findOne({
						where: {
							number: {
								$like: iddesa.number.slice(0,4) + '%'
							}
						},
						attributes: ['lat', 'lng', 'name']
					})
					.then((kabupaten) => {
						kabupaten = JSON.parse(JSON.stringify(kabupaten));
						Summaries
							.findAll({
								where: {
									bulan: bulan+1,
									tahun: tahun,
								},
								attributes: ['kondisi'],
								include: [{
									model: Kecamatan,
									where: {
										number: {
											$like: iddesa.number.slice(0,4) + '%'
										}
									},
									attributes: ['name', 'lat', 'lng']
								}]
							})
							.then((result) => {
								result = JSON.parse(JSON.stringify(result));
								var data = {}
								var kondisi = [0,0,0,0,0,0];
								var listkecamatan = [];
								data.kabupaten = {
									nama: kabupaten.name.toLowerCase(),
									lat: kabupaten.lat, 
									lng: kabupaten.lng
								}
								data.bulan = moment(bulan, 'MM').format('MMMM');
								for(let i=0; i<result.length; i++) {
									kondisi[result[i].kondisi]++;
									var kecamatan = {};
									kecamatan.nama = result[i].rgn_district.name;
									kecamatan.kondisi = result[i].kondisi;
									kecamatan.lat = result[i].rgn_district.lat;
									kecamatan.lng = result[i].rgn_district.lng;
									listkecamatan.push(kecamatan);
								}
								data.kondisi = kondisi;
								data.listkecamatan = listkecamatan;
								data.totalkecamatan = result.length;
								res.json({
									status: true,
									message: "Berhasil mendapatkan hasil rangkuman dari laporan untuk bulan " + (bulan+1) + " tahun " + tahun + " untuk kabupaten tertentu",
									data: data
								});
							})
							.catch((err) => {
								res.json({
									status: false,
									message: "Gagal untuk mendapatkan laporan untuk bulan bulan " + (bulan+1) + " tahun " + tahun + " untuk kabupaten tertentu",
									info: err
								});
							});
					})
					.catch((err) => {
						res.json({
							status: false,
							message: "Gagal mendapatkan latlng suatu kabupaten"
						});
					})
			})
			.catch((err) => {
				res.json({
					status: false,
					message: "gagal mendapatkan id desa yang diinginkan"
				});
			});
	}

	GetKerawananAllProv(req, res) {
		this.info = Token.DecodeToken(req.headers.token);
		var bulan;
		var tahun;
		if(moment().month() == 0) {
			bulan = 11;
			tahun = moment().year() - 1;
		} else {
			bulan = moment().month()-1;
			tahun = moment().year();
		}
		Summaries
			.findAll({
				where: {
					bulan: bulan+1,
					tahun: tahun
				},
				order: [
					['fk_kecamatanid']
				],
				include: [{
					model: Kecamatan,
					attributes: ['number', 'name', 'jumlahkeluarga']
				}]
			})
			.then((summary) => {
				summary = JSON.parse(JSON.stringify(summary));
				var result = [];
				var temp = {};
				var tempid = summary[0].rgn_district.number.slice(0,2);
				temp.q1 = 0;
				temp.q2 = 0;
				temp.q3 = 0;
				temp.q4 = 0;
				temp.q5 = 0;
				temp.q6 = 0;
				temp.q7 = 0;
				temp.jumlahkeluarga = 0;
				for(let i=0; i<summary.length; i++) {
					if(tempid != summary[i].rgn_district.number.slice(0,2)) {
						temp.id = tempid;
						temp.kondisi = Laporan.GetStatusKeluargaMiskinAngka1Jenis(temp);
						result.push(temp);
						temp = {};
						tempid = summary[i].rgn_district.number.slice(0,2);
						temp.q1 = 0;
						temp.q2 = 0;
						temp.q3 = 0;
						temp.q4 = 0;
						temp.q5 = 0;
						temp.q6 = 0;
						temp.q7 = 0;
						temp.jumlahkeluarga = 0;
					}
					temp.q1 += summary[i].q1;
					temp.q2 += summary[i].q2;
					temp.q3 += summary[i].q3;
					temp.q4 += summary[i].q4;
					temp.q5 += summary[i].q5;
					temp.q6 += summary[i].q6;
					temp.q7 += summary[i].q7;
					temp.jumlahkeluarga += summary[i].rgn_district.jumlahkeluarga;
				}
				res.json({
					status: true,
					message: "Berhasil mendapatkan data kerawanan semua provinsi",
					data: result
				})
			})
	}
}

module.exports = new Summarie;
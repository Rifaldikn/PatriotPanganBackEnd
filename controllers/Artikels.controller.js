var sequelize = require(__dirname + '/../dbconnection');
var Artikels = sequelize.import(__dirname + '/../model/Artikels.model');
var Admins = sequelize.import(__dirname + '/../model/Admins.model');

Artikels.belongsTo(Admins, {foreignKey: 'fk_pembuatid'}); // Adds fk_pembuatid to artikel

const Op = sequelize.Op;

class Artikel {
	constructor(){
	}

	GetArtikel(req, res){
		Artikels
			.findAll({
				include: [{
					model: Admins
				}]
			})
			.then((artikel) =>{
				res.json({
						status: true,
						message : "Berhasil mendapatkan artikel",
						data: artikel
					})
			})
			.catch((err) => {
                res.json({
						status: false,
                        message: "Internal Server Error, saat mendapatkan artikel"
                    })
            });
	}

	GetArtikelByBulan(req, res){
		Artikels
			.findAll({
				where : {
					tanggalpublish : {
						[Op.gte] : new Date(req.params.year, req.params.month, 1), //year pake int, yang paling kanan tanggal
						[Op.lt] : new Date(req.params.year, req.params.month + 1, 1), //month pake int
					}
				},
				include: [{
					model: Admins
				}]
			})
			.then((artikel) =>{
				res.json({
						status: true,
						message : "Berhasil mendapatkan artikel by bulan",
						data: artikel
					})
			})
			.catch((err) => {
                res.json({
						status: false,
                        message: "Internal Server Error, saat mendapatkan artikel"
                    })
            });
	}

	GetArtikelByTahun(req, res){
		Artikels
			.findAll({
				where: {
					tanggalpublish : {
						[Op.gte] : new Date(req.params.year, 0, 1), //year pake int, yang paling kanan tanggal
						[Op.lt] : new Date(req.params.year + 1, 0, 1), //month pake int
					}
				},
				include: [{
					model: Admins
				}]
			})
			.then((artikel) =>{
				res.json({
						status: true,
						message : "Berhasil mendapatkan artikel by tahun",
						data: artikel
					})
			})
			.catch((err) => {
                res.json({
						status: false,
                        message: "Internal Server Error, saat mendapatkan artikel"
                    })
            });
	}

	GetDetailArtikel(req, res) {
		Artikels
			.findOne({
				where: {
					id: req.params.artikelId
				},
				include: [{
					model: Admins
				}]
			})
			.then((artikel) => {
				res.json({
						status: true,
						message : "Berhasil mendapatkan detail artikel",
						data: artikel
					})
			})
			.catch((err) => {
                res.json({
						status: false,
                        message: "Internal Server Error"
                    })
            });
	}

	GetJumlahArtikel(req,res){
		Artikels
			.count()
			.then((jumlahArtikel) => {
				res.json({
					status: true,
					message: "Berhasil jumlah artikel",
					data: jumlahArtikel
				})
			})
			.catch((err) => {
				res.json({
					status : false,
					message: "Internal Server Error"
				})
			})
	}

	GetJumlahArtikelByBulan(req,res){
		Artikels
			.count({
				where : {
					tanggalpublish : {
						[Op.gte] : new Date(req.params.year, req.params.month, 1), //year pake int, yang paling kanan tanggal
						[Op.lt] : new Date(req.params.year, req.params.month + 1, 1), //month pake int
					}
				}
			})
			.then((jumlahArtikel) => {
				res.json({
					status: true,
					message: "Berhasil jumlah artikel by bulan",
					data: jumlahArtikel
				})
			})
			.catch((err) => {
				res.json({
					status : false,
					message: "Internal Server Error"
				})
			})
	}

	GetJumlahArtikelByTahun(req,res){
		Artikels
			.count({
				where : {
					tanggalpublish : {
						[Op.gte] : new Date(req.params.year, 0, 1), //year pake int, yang paling kanan tanggal
						[Op.lt] : new Date(req.params.year + 1, 0, 1), //month pake int
					}
				}
			})
			.then((jumlahArtikel) => {
				res.json({
					status: true,
					message: "Berhasil jumlah artikel by tahun",
					data: jumlahArtikel
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

module.exports = new Artikel;
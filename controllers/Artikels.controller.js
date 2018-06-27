var sequelize = require(__dirname + '/../dbconnection');
var Artikels = sequelize.import(__dirname + '/../model/Artikels.model');
var Admins = sequelize.import(__dirname + '/../model/Admins.model');

Artikels.belongsTo(Admins, {foreignKey: 'fk_pembuatid'}); // Adds fk_pembuatid to artikel

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
}

module.exports = new Artikel;
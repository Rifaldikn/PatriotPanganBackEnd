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
				res.status(200)
					.json({
						message : "Berhasil mendapatkan artikel",
						data: artikel
					})
			})
			.catch((err) => {
                res.status(500)
                    .json({
                        message: "Internal Server Error"
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
				res.status(200)
					.json({
						message : "Berhasil mendapatkan detail artikel",
						data: artikel
					})
			})
			.catch((err) => {
                res.status(500)
                    .json({
                        message: "Internal Server Error"
                    })
            });
	}
}

module.exports = new Artikel;
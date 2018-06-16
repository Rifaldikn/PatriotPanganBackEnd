var Artikels = require(__dirname + '/../models/Artikels.model');

class Artikel {
	constructor(){
	}

	GetArtikel(req, res){
		Artikels
			.find()
			.populate('fk_pembuatid', 'nama')
			.exec()
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
			.findById(req.params.artikelId)
			.populate('fk_pembuatid', 'nama')
			.exec()
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
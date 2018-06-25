module.exports = function(sequelize, DataType) {
	return sequelize.define('penghargaan', {
                nama: DataType.STRING,
                deskripsi: DataType.TEXT,
                syarat: DataType.INTEGER
	});
}
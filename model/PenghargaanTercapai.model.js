module.exports = function(sequelize, DataType) {
	return sequelize.define('penghargaantercapai', {
                fk_patriotid: DataType.INTEGER,
                fk_penghargaanid: DataType.INTEGER
	});
}
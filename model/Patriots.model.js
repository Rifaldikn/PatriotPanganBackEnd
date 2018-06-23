module.exports = function(sequelize, DataType) {
	return sequelize.define('patriot', {
		email: {
			type: DataType.STRING,
			unique: true, 
			isEmail: true 
		},
		password: DataType.STRING,
        nama: DataType.STRING,
        gender: DataType.BOOLEAN,
        fk_desaid: {
            type: DataType.STRING,
        },
        alamat: DataType.STRING,
        bergabung: DataType.DATE,
        laporanterkirim: DataType.INTEGER,
        keluargayangdipantau: DataType.INTEGER,
        pathfoto: DataType.STRING
	});
}
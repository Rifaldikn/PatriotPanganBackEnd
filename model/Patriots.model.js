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
        bergabung: {
            type: DataType.DATE,
            defaultValue: new Date
        },
        laporanterkirim: {
            type: DataType.INTEGER,
            defaultValue: 0
        },
        keluargayangdipantau: {
            type: DataType.INTEGER,
            defaultValue: 0
        },
        pathfoto: DataType.STRING
	});
}
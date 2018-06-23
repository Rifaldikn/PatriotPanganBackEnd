module.exports = function(sequelize, DataType) {
	return sequelize.define('admin', {
		email: {
			type: DataType.STRING,
			unique: true, 
			isEmail: true 
		},
		password: DataType.STRING,
        nama: DataType.STRING,
	});
}
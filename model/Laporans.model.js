var sequelize = require(__dirname + '/../dbconnection');
var KeluargaMiskin = sequelize.import(__dirname + '/KeluargaMiskins.model');

module.exports = function(sequelize, DataType) {
	return sequelize.define('laporan', {
        q1: DataType.BOOLEAN,
        q2: DataType.BOOLEAN,
        q3: DataType.BOOLEAN,
        q4: DataType.BOOLEAN,
        q5: DataType.BOOLEAN,
        q6: DataType.BOOLEAN,
        q7: DataType.BOOLEAN,
        q8: DataType.STRING,
        q9: DataType.BOOLEAN,
        q10: DataType.STRING,
        pathfoto: DataType.STRING,
        deskripsi: DataType.STRING,
        fk_keluargamiskinid: {
                type: DataType.INTEGER,
                references: {
                        model: KeluargaMiskin,
                        key: 'id'
                }
        },
        minggu: DataType.STRING,
        bulan: DataType.STRING,
        tahun: DataType.INTEGER
	});
}
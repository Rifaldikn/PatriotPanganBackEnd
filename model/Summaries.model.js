var sequelize = require(__dirname + '/../dbconnection');
var Kecamatan = sequelize.import(__dirname + '/rgn_district.model');

module.exports = function(sequelize, DataType) {
	return sequelize.define('summary', {
        q1: {
            type: DataType.INTEGER,
            defaultValue: 0
        },
        q2: {
            type: DataType.INTEGER,
            defaultValue: 0
        },
        q3: {
            type: DataType.INTEGER,
            defaultValue: 0
        },
        q4: {
            type: DataType.INTEGER,
            defaultValue: 0
        },
        q5: {
            type: DataType.INTEGER,
            defaultValue: 0
        },
        q6: {
            type: DataType.INTEGER,
            defaultValue: 0
        },
        q7: {
            type: DataType.INTEGER,
            defaultValue: 0
        },
        kondisi: {
            type: DataType.INTEGER,
            defaultValue: 0 //0 = aman, 1 = rawan1, 2 = rawan2, 3 = rawan3, 4 = rawan4, 5 = rawan5
        },
        fk_kecamatanid: {
                type: DataType.INTEGER,
                references: {
                        model: Kecamatan,
                        key: 'id'
                }
        },
        bulan: DataType.STRING,
        tahun: DataType.STRING
	});
}
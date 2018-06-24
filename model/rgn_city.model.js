var sequelize = require(__dirname + '/../dbconnection');
var Province = sequelize.import(__dirname + '/rgn_province.model');

module.exports = function(sequelize, DataType) {
	return sequelize.define('rgn_city', {
                number: DataType.STRING,
                name: DataType.STRING,
                abbreviation: DataType.STRING,
                province_id: {
                        type: DataType.INTEGER,
                        references: {
                                model: Province,
                                key: 'id'
                        }
                },
                lat: {
                        type: DataType.DOUBLE,
                        allowNull: true
                },
                lng: {
                        type: DataType.DOUBLE,
                        allowNull: true
                },
	});
}
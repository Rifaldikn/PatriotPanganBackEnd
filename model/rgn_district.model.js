var sequelize = require(__dirname + '/../dbconnection');
var City = sequelize.import(__dirname + '/rgn_city.model');
module.exports = function(sequelize, DataType) {
	return sequelize.define('rgn_district', {
                number: DataType.STRING,
                name: DataType.STRING,
                abbreviation: DataType.STRING,
                city_id: {
                        type: DataType.INTEGER,
                        references: {
                                model: City,
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
                jumlahkeluarga: {
                        type: DataType.INTEGER,
                        defaultValue: 0
                }
	});
}
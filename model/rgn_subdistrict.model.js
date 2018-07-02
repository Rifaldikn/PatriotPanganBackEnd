var sequelize = require(__dirname + '/../dbconnection');
var District = sequelize.import(__dirname + '/rgn_district.model');

module.exports = function(sequelize, DataType) {
	return sequelize.define('rgn_subdistrict', {
        number: DataType.STRING,
        name: DataType.STRING,
        abbreviation: DataType.STRING,
        district_id: {
            type: DataType.INTEGER ,
            references: {
                model: District,
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
        }
	});
}
var sequelize = require(__dirname + '/../dbconnection');
var Country = sequelize.import(__dirname + '/rgn_country.model');

module.exports = function(sequelize, DataType) {
	return sequelize.define('rgn_province', {
                number: DataType.STRING,
                name: DataType.STRING,
                abbreviation: DataType.STRING,
                country_id: {
                        type: DataType.INTEGER,
                        references: {
                                model: Country,
                                key: 'id'
                        }
                }
	});
}
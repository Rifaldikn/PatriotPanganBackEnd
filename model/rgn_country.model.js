var sequelize = require(__dirname + '/../dbconnection');

module.exports = function(sequelize, DataType) {
        return sequelize.define('rgn_country', {
                name: DataType.STRING,
                abbreviation: DataType.STRING,
	});
}
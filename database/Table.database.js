var sequelize = require(__dirname + '/../dbconnection');
var District = sequelize.import(__dirname + '/../model/rgn_district.model');
var Subdistrict = sequelize.import(__dirname + '/../model/rgn_subdistrict.model');
var City = sequelize.import(__dirname + '/../model/rgn_city.model');
var Province = sequelize.import(__dirname + '/../model/rgn_province.model');
var Country = sequelize.import(__dirname + '/../model/rgn_country.model');
var Admins = sequelize.import(__dirname + '/../model/Admins.model');
var Artikels = sequelize.import(__dirname + '/../model/Artikels.model');
var KeluargaMiskins = sequelize.import(__dirname + '/../model/KeluargaMiskins.model');
var Patriots = sequelize.import(__dirname + '/../model/Patriots.model');
var Penghargaan = sequelize.import(__dirname + '/../model/Penghargaan.model');
var PenghargaanTercapai = sequelize.import(__dirname + '/../model/PenghargaanTercapai.model');
var Laporans = sequelize.import(__dirname + '/../model/Laporans.model');

Country
    .sync()
    .then(() => {
        Province
            .sync()
            .then(() => {
                City
                    .sync()
                    .then(() => {
                        District
                            .sync()
                            .then(() => {
                                Subdistrict
                                    .sync()
                                    .then(() => {
                                        Admins
                                            .sync()
                                            .then(() => {
                                                Artikels
                                                    .sync()
                                            })
                                        Patriots
                                            .sync()
                                            .then(() => {
                                                Penghargaan
                                                    .sync()
                                                    .then(() => {
                                                        PenghargaanTercapai
                                                            .sync()
                                                    })
                                                KeluargaMiskins
                                                    .sync()
                                                    .then(() => {
                                                        Laporans
                                                            .sync()
                                                            .then(() => {
                                        
                                                            })
                                                    })
                                            })
                                    })
                            })
                    })
            })
    })

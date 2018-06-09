var mongoose = require('mongoose');

var ProvinsisSchema = mongoose.Schema({
    id_prov:String,
    nama:String,
    lat: Number,
    lng: Number,
});

module.exports = mongoose.model("Provinsis", ProvinsisSchema);
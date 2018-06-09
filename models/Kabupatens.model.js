var mongoose = require('mongoose');

var KabupatensSchema = mongoose.Schema({
    id_kab:String,
    id_prov:String,
    nama:String,
    id_jenis:String,
    lat: Number,
    lng: Number,
});

module.exports = mongoose.model("Kabupatens", KabupatensSchema);
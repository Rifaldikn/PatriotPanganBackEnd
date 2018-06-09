var mongoose = require('mongoose');

var KecamatansSchema = mongoose.Schema({
    id_kec:String,
    id_kab:String,
    nama:String,
    lat: Number,
    lng: Number
});

module.exports = mongoose.model("Kecamatans", KecamatansSchema);
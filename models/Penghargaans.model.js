var mongoose = require('mongoose');

var PenghargaansSchema = mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    deskripsi: {
        type: String,
        required: true
    },
    syarat: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Penghargaans', PenghargaansSchema);
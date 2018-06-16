var mongoose = require('mongoose');

var ArtikelsSchema = mongoose.Schema({
    judul: {
        type: String,
        required: true
    },
    // Id Admin
    fk_pembuatid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admins'
    },
    tanggalpublish: {
        type: Date,
        default: Date.now,
        required: true
    },
    sumberartikel: {
        type: String,
        required: true
    },
    isi: {
        type: String,
        required: true
    },
    pathfoto: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Artikels', ArtikelsSchema);
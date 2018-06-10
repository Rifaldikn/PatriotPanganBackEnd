var mongoose = require('mongoose');

var ArtikelsSchema = mongoose.Schema({
    judul: {
        type: String,
        required: true
    },
    // Id Pejabat
    fk_pembuatid: {
        type: Schema.Types.ObjectId,
        required: true
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
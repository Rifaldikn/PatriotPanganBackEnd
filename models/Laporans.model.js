var mongoose = require('mongoose');

var LaporansSchema = mongoose.Schema({
    q1: {
        type: Boolean,
        required: true
    },
    q2: {
        type: Boolean,
        required: true
    },
    q3: {
        type: Boolean,
        required: true
    },
    q4: {
        type: Boolean,
        required: true
    },
    q5: {
        type: Boolean,
        required: true
    },
    q6: {
        type: Boolean,
        required: true
    },
    q7: {
        type: Boolean,
        required: true
    },
    q8: {
        type: String,
        required: true
    },
    q9: {
        type: Boolean,
        required: true
    },
    q10: {
        type: Boolean,
        required: true
    },
    pathfoto: {
        type: String,
        required: true
    },
    deskripsi: {
        type: String,
        required: true
    },
    fk_keluargamiskinid: {
        type: Schema.Types.ObjectId,
        required: true
    },
    minggu: {
        type: String,
        required: true
    },
    bulan: {
        type: String,
        required: true
    },
    tahun: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Laporans', LaporansSchema);
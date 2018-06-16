var mongoose = require('mongoose');

var KeluargaMiskinsSchema = mongoose.Schema({
    namaKeluarga: {
        type: String,
        required: true
    },
    fk_desaid: {
        type: String,
        required: true,
        ref: 'Kelurahans'
    },
    alamat: {
        type: String,
        required: true
    },
    pathfoto: {
        type: String,
        required: true
    },
    fk_patriotid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Patriots'
    },
    mingguterakhirmelaporkan: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('KeluargaMiskins', KeluargaMiskinsSchema);
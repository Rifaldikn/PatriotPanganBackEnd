var mongoose = require('mongoose');

var KeluargaMiskinsSchema = mongoose.Schema({
    namaKeluarga: {
        type: String,
        required: true
    },
    fk_desaid: {
        type: String,
        required: true
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
        type: Schema.Types.ObjectId,
        required: true
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
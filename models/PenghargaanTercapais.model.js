var mongoose = require('mongoose');

var PenghargaanTercapaisSchema = mongoose.Schema({
    fk_patriotid: {
        type: Schema.Types.ObjectId,
        required: true
    },
    fk_penghargaanid: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('PenghargaanTercapais', PenghargaanTercapaisSchema);
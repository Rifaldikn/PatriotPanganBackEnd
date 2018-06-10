var mongoose = require('mongoose');

var PatriotsSchema = mongoose.Schema({
    email: {
        type: String,
        required: true, 
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        type: String,
        required: true
    }, 
    nama: {
        type: String,
        required: true
    }, 
    gender: {
        type: Boolean,
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
    bergabung: {
        type: Date,
        default: Date.now,
        required: true
    },
    laporanterkirim: {
        type: Number,
        default: 0,
        required: true
    },
    keluargayangdipantau: {
        type: Number,
        default: 0,
        required: true
    },
    pathfoto: {
        type: String
    }
});

module.exports = mongoose.model('Patriots', PatriotsSchema);
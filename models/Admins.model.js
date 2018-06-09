var mongoose = require('mongoose');

var AdminsSchema = mongoose.Schema({
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
    }
});

module.exports = mongoose.model('Admins', AdminsSchema);
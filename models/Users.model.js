var mongoose = require('mongoose');

var UsersSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: /[a-z0-9]?/
    },
    password: { 
        type: String, 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Users', UsersSchema);
const mongoose = require('mongoose');

const Admins = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    no_hp: {
        type: String,
        required: true,
        unique: true,
    },
    nama: { 
        type: String,
    },
    password: {
        type: String,
    },
    profile: {
        type: String,
    }
}, { versionKey: false });
module.exports.Admin = mongoose.model('admin', Admins);
const mongoose = require('mongoose');

const Users = mongoose.Schema({
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
    pin: {
        type: String,
    },
    profile: {
        type: String,
    },
    email: {
        type: String,
    },
    alamat: { 
        type: String,
    },
    cart: {
        type: Array,
    },
    transaction: {
        type: Array
    }
}, { versionKey: false });
module.exports.User = mongoose.model('user', Users);
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart'
    },
    transaction: {
        type: Array
    }
}, { timestamps: true });
module.exports.User = mongoose.model('user', Users);
const mongoose = require('mongoose');

const Users = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    no_hp: {
        type: Number,
        required: true,
        unique: true,
    },
    pin: {
        type: Number,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart'
    },
    transaction: {
        type: Array
    },
    userDetail: {
        name: { 
            type: String,
        },
        avatar: {
            type: String,
            default: null
        },
        email: {
            type: String,
        },
        address: { 
            type: String,
        },
        _id: false
    }
}, { timestamps: true });
module.exports.User = mongoose.model('user', Users);
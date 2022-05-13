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
    userDetail: {
        name: String,
        avatar: String,
        email: String,
        address: String,
        checkoutAddress: {
            recipientName: String,
            addressName: String,
            fullAddress: String,
            addressDetails: String,
            phoneNumber: String,
            latitude: Number,
            longitude: Number,
            _id: false
        },
        addressHistories: [{
            recipientName: String,
            addressName: String,
            fullAddress: String,
            addressDetails: String,
            phoneNumber: String,
            latitude: Number,
            longitude: Number
        }],
        _id: false
    }
}, { timestamps: true });
module.exports.User = mongoose.model('user', Users);
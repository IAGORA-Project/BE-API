const mongoose = require('mongoose');

const oneTimePassword = mongoose.Schema({
    no_hp: { 
        type: Number,
        required: true
    },
    otp_code: { 
        type: String,
        required: true
    },
    expire_at: {
        type: Date
    }
}, { timestamps: true });
module.exports.OneTimePassword = mongoose.model('OneTimePassword', oneTimePassword);
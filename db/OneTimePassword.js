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
        type: Date,
        default: new Date(Date.now() + (1000 * 60)).getTime()
    }
}, { timestamps: true });
module.exports.OneTimePassword = mongoose.model('OneTimePassword', oneTimePassword);
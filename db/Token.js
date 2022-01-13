const mongoose = require('mongoose');

const Token = mongoose.Schema({
    no_hp: { 
        type: String,
        required: true
    },
    token: { 
        type: String,
        required: true
    },
    expire_at: {
        type: Date,
        default: Date.now,
        expires: 120,
    }
}, { versionKey: false });
module.exports.Token = mongoose.model('token', Token);
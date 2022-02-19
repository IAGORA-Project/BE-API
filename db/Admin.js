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

const Transactionss = mongoose.Schema({
    id_order: {
        type: String,
        required: true
    },
    wingman_hp: {
        type: String,
        required: true,
    },
    user_hp: { 
        type: String,
        required: true,
    },
    detail: {
        type: Object,
        required: true,
    }
}, { timestamps: true });
module.exports.Transaction = mongoose.model('transaction', Transactionss);
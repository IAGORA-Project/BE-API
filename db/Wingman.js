const mongoose = require('mongoose');

const Wingman = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    no_hp: {
        type: String,
        unique: true,
        required: true
    },
    pin: {
        type: String,
    },
    pasar: { 
        type: String,
    },
    available: {
        type: Boolean
    },
    stars: {
        type: Object
    },
    today_order: {
        type: Number
    },
    total_order: {
        type: Number
    },
    income: {
        type: Number
    },
    on_process: {
        type: Array,
    },
    kotak_saran: {
        type: Array
    },
    wingmanDetail: {
        name: String,
        email: String,
        address: String,
        city: String,
        avatar: {
            type: String,
            default: null
        },
    },
    wingmanDocument: {
        ktp: String,
        skck: String,
        bank: String,
        no_rek: Number,
        nama_rek: String,
    }
}, { timestamps: true });

module.exports.Wingman = mongoose.model('wingman', Wingman);
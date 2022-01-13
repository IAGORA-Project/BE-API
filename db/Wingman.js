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
    nama: { 
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
    kota: { 
        type: String,
    },
    pasar: { 
        type: String,
    },
    bank: { 
        type: String,
    },
    no_rek: { 
        type: Number,
    },
    nama_rek: { 
        type: String,
    },
    ktp: {
        type: String,
    },
    skck: {
        type: String,
    },
    available: {
        type: Boolean,
        required: true
    },
    stars: {
        type: Number,
        required: true
    },
    today_order: {
        type: Number,
        required: true
    },
    total_order: {
        type: Number,
        required: true
    },
    income: {
        type: Number,
        required: true
    },
    on_process: {
        type: Array,
    }
}, { versionKey: false });

module.exports.Wingman = mongoose.model('wingman', Wingman);
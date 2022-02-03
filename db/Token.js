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

// const Token2 = mongoose.Schema({
//     no_hp: { 
//         type: String,
//         required: true
//     },
//     id_order: { 
//         type: String,
//         required: true
//     },
//     token: { 
//         type: String,
//         required: true
//     },
//     expire_at: {
//         type: Date,
//         default: Date.now,
//         expires: 7200,
//     }
// }, { versionKey: false });
// module.exports.Token2 = mongoose.model('token2', Token2);
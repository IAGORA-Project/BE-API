const mongoose = require('mongoose');

const msgSchema = mongoose.Schema({
    chat_now: {
        type: String,
        required: true
    },
    target_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    room_id: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        required: true
    },
    file: {
        type: String,
    },
    text: {
        type: String
    },
    expire_at: {
        type: Date,
        default: Date.now,
        expires: 604800, // 7 Day Message Expires
    }
}, { versionKey: false })

module.exports.Message = mongoose.model('message', msgSchema);

const msgCs = mongoose.Schema({
    chat_now: {
        type: String,
        required: true
    },
    cs_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    room_id: {
        type: String,
        required: true
    },
    text: {
        type: String
    }
}, { versionKey: false })

module.exports.MsgCs = mongoose.model('messagecs', msgCs);
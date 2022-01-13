const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
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
    }
}, { versionKey: false })

const Message = mongoose.model('message', msgSchema);

module.exports = Message
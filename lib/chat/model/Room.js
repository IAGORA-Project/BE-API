const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    }
})

const Room = mongoose.model('room', roomSchema);

module.exports = Room

const roomSchema2 = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    }
})

const Room2 = mongoose.model('room2', roomSchema2);

module.exports = Room2
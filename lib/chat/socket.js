// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);

// const { Server } = require("socket.io");
// const io = new Server(server);

// const Message = require('./model/Message');
// const Room = require('./model/Room');

// io.on('connection', (socket) => {
//     Room.find().then(result => {
//         socket.emit('output-rooms', result);
//     })
//     socket.on('create-room', name => {
//         const room = new Room({ name });
//         room.save().then(result => {
//             io.emit('room-created', result);
//         })
//     })
//     socket.on('join', ({ name, room_id, user_id }) => {
//         const { error, user } = addUser({socket_id: socket.id, name, room_id, user_id})
//         socket.join(room_id);
//         if(error) {
//             console.log(`Join Error : ${error}`);
//         } else {
//             console.log(`Join Success ${user.name}`);
//         }
//     })
//     socket.on('sendMessage', (message, room_id, callback) => {
//         const user = getUser(socket.id);
//         const msgToStore = {
//             name: user.name,
//             user_id: user.user_id,
//             room_id,
//             text: message
//         }
//         const msg = new Message(msgToStore);
//         msg.save().then(result => {
//             io.to(room_id).emit('message', result);
//             callback();
//         })
//     })
//     socket.on('get-messages-history', room_id => {
//         Message.find({ room_id }).then(result => {
//             socket.emit('output-messages', result)
//         })
//     })
//     socket.on('disconnect', () => {
//         const user = removeUser(socket.id)
//     })
// });

// module.exports.io = io
const express = require('express');
const { verifyToken } = require('../../../router/token');
const router = express.Router();

const controllerChat = require('./controller_chat');

/* CREATE ROOM TO START CHATING */

router.get('/create/:user/:target', verifyToken, controllerChat.create_room_chat);

/* SEND MESSAGE */

router.post('/msg/:room/:user' ,verifyToken, controllerChat.send_message_chat);

/* GET ALL MESSAGE IN ONE ROOM */

router.get('/get-msg-room/:room', verifyToken, controllerChat.get_all_message_room);

/* DELETE ONE MESSAGE IN ROOM */

router.get('/delete-msg/:idmsg', verifyToken, controllerChat.delete_message);

/* MARK READ MESSAGE */

router.get('/read-msg/:idmsg', verifyToken, controllerChat.mark_read);

module.exports = router
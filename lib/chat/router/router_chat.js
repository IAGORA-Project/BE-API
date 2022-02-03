const express = require('express');
const { verifyToken, verifJWT, verifyAdmin } = require('../../../router/token');
const { MsgCs, Message } = require('../model/Message');
const Room = require('../model/Room');
const router = express.Router();

const controllerChat = require('./controller_chat');
const controllerCs = require('./controller_cs');

router.get('/room', async (req, res) => {
    let data = await Room.find({});
    res.render('ejs/room', {
        result: data
    })
})

router.get('/msg-db', async (req, res) => {
    let data = await Message.find({});
    res.render('ejs/message', {
        result: data
    })
})

/* CREATE ROOM TO START CHATING */

router.get('/create/:user/:target', verifyToken, controllerChat.create_room_chat);

/* SEND MESSAGE */

router.post('/msg/:room/:user' ,verifyToken, controllerChat.send_message_chat);

/* GET ALL MESSAGE IN ONE ROOM */

router.get('/get-msg-room/:room', verifyToken, controllerChat.get_all_message_room);

/* DELETE ONE MESSAGE IN ROOM */

router.get('/delete-msg/:idmsg/:room', verifyToken, controllerChat.delete_message);

/* MARK READ MESSAGE */

router.get('/read-msg/:idmsg', verifyToken, controllerChat.mark_read);

/* DELETE ONE ROOM */

router.get('/delete-room/:idroom', verifyToken, controllerChat.delete_one_room);

/* GET ALL ROOM */

router.get('/all-room', verifyToken, controllerChat.get_all_room);


// CS IAGORA

router.get('/msg-cs', async (req, res) => {
    let data = await MsgCs.find({});
    res.render('ejs/messageCS', {
        result: data
    })
})

router.get('/page-cs', verifyToken, verifJWT, controllerCs.page_cs);

router.post('/user-sendmsg', verifyToken, verifJWT, controllerCs.user_sendMessage);

router.post('/cs-sendmsg', verifyToken, verifyAdmin, verifJWT, controllerCs.cs_sendMessage);

router.get('/history-cs/:room', verifyToken, verifyAdmin, controllerCs.get_allmsg_room);

router.get('/delete-one/:id_msg/:room', verifyToken, verifyAdmin, verifJWT, controllerCs.delete_One_msg);

router.get('/delete-all-msg-room/:room', verifyToken, verifyAdmin, verifJWT, controllerCs.delete_allmsg_room);

module.exports = router
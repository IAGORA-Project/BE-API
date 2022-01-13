const Message = require('../model/Message');
const Room = require('../model/Room');

async function create_room_chat(req, res) {
    try {
        if (!req.params) return res.status(400).send({
            status: 400,
            message: 'wrong format'
        })
        let find = await Room.findOne({ user: req.params.user });
        if (!find) {
            let create = await Room.create({ user: req.params.user, target:  req.params.target });
            return res.status(200).send({
                status: 200,
                message: `Sukses Created Room, user1 : ${req.params.user} || user2: ${req.params.target}`,
                data: create
            })
        } else {
            return res.status(400).send({
                status: 400,
                message: `Room is created before!`
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function send_message_chat(req, res) {
    try {
        if (!req.body || Object.keys(req.body).length === 0 || !req.params) return res.status(400).send({
            status: 400,
            message: 'wrong format'
        })
        let { room, user } = req.params;
        let { message } = req.body;
        let find = await Room.findOne({ _id: room });
        if (find) {
            let obj = { target_id: find.target, user_id: user, room_id: room, read: false, file: '', text: message };
            let data = await Message.create(obj);
            if (data) {
                const AllChatRoom = await Message.find({ room_id: room });
                return res.status(200).send({
                    status: 200,
                    message: `Sukses Send Message : ${message} || from : ${user} to room : ${room}`,
                    data,
                    allMessage: AllChatRoom
                })
            } else {
                return res.status(500).send({
                    status: 500,
                    message: 'failed create message'
                })
            }
        } else {
            return res.status(400).send({
                status: 400,
                message: 'room not found'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function get_all_message_room(req, res) {
    try {
        if (!req.params) return res.status(400).send({
            status: 400,
            message: 'wrong format'
        })
        let { room } = req.params;
        let data = await Message.find({ room_id: room });
        if (data) {
            return res.status(200).send({
                status: 200,
                result: data
            })
        } else {
            return res.status(404).send({
                status: 404,
                message: `Message not found in room ${room}`
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function delete_message(req, res) {
    try {
        if (!req.params) return res.status(400).send({
            status: 400,
            message: 'wrong format'
        })
        let { idmsg } = req.params;
        let data = await Message.find({ _id: idmsg });
        if (data) {
            Message.deleteOne({ _id: idmsg }, function (err, res) {
                if (err) throw err;
            })
            return res.status(200).send({
                status: 200,
                result: `Sukses Delete Message : ${idmsg}`
            })
        } else {
            return res.status(404).send({
                status: 404,
                message: 'Message not found'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

async function mark_read(req, res) {
    try {
        if (!req.params) return res.status(400).send({
            status: 400,
            message: 'wrong format'
        })
        let { idmsg } = req.params;
        let data = await Message.find({ _id: idmsg });

        if (data) {
            Message.updateOne({ _id: idmsg }, { read: true }, function (err, res) {
                if (err) throw err;
            })
            return res.status(200).send({
                status: 200,
                message: `sukses read message ${idmsg}`
            })
        } else {
            return res.status(404).send({
                status: 404,
                message: 'Message not found'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 500, message: 'Internal Server Error'});
    }
}

module.exports = {
    create_room_chat,
    send_message_chat,
    get_all_message_room,
    delete_message,
    mark_read
}
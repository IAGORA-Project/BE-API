const { respons } = require('../../setting');
const { Message } = require('../model/Message');
const Room = require('../model/Room');

async function create_room_chat(req, res) {
    try {
        let { user, target } = req.params;
        if (!user || !target) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedParams,
            message: `Input Params`
        })
        let find = await Room.find({ user: req.params.user });
        let index = find.findIndex(x => x.target == target)
        if (index == -1) {
            let create = await Room.create({ user: req.params.user, target:  req.params.target });
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `Sukses Created Room, user1 : ${req.params.user} || user2: ${req.params.target}`,
                result: create
            })
        } else {
            return res.status(400).send({
                status: res.statusCode,
                code: respons.RoomIsAlready,
                message: `Room is created before!`
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function send_message_chat(req, res) {
    try {
        let { room, user } = req.params;
        if (!room || !user) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedParams,
            message: `Input Params`
        })
        let { message } = req.body;
        if (!message) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedBody,
            message: `Input Body`
        })
        let find = await Room.findOne({ _id: room });
        if (find) {
            let obj = { chat_now: user, target_id: find.target, user_id: user, room_id: room, read: false, file: '', text: message };
            let data = await Message.create(obj);
            if (data) {
                const AllChatRoom = await Message.find({ room_id: room });
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Send Message : ${message} || from : ${user} to room : ${room}`,
                    result: {
                        message: data,
                        allMessage: AllChatRoom
                    }
                })
            } else {
                return res.status(500).send({
                    status: res.statusCode,
                    code: respons.FailCreateMsg,
                    message: 'failed create message'
                })
            }
        } else {
            return res.status(404).send({
                status: res.statusCode,
                code: respons.RoomNotFound,
                message: 'room not found'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function get_all_message_room(req, res) {
    try {
        let { room } = req.params;
        if (!room) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedParams,
            message: `Input Params`
        })
        let data = await Message.find({ room_id: room });
        if (data) {
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `Sukses Get All Message Room`,
                result: data
            })
        } else {
            return res.status(404).send({
                status: res.statusCode,
                code: respons.MsgNotFoundRoom,
                message: `Message not found in room ${room}`
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function delete_message(req, res) {
    try {
        let { idmsg, room } = req.params;
        if (!idmsg) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedParams,
            message: `Input Params`
        })
        let data = await Message.find({ _id: idmsg });
        if (data) {
            Message.deleteOne({ _id: idmsg }, function (err, res) {
                if (err) throw err;
            })
            let findAgain = await Message.find({ room_id: room });
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `Sukses Delete Message : ${idmsg}`,
                result: findAgain
            })
        } else {
            return res.status(404).send({
                status: res.statusCode,
                code: respons.MsgNotFound,
                message: `Message not found`
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function mark_read(req, res) {
    try {
        let { idmsg } = req.params;
        if (!idmsg) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedParams,
            message: `Input Params`
        })
        let data = await Message.find({ _id: idmsg });

        if (data) {
            Message.updateOne({ _id: idmsg }, { read: true }, function (err, res) {
                if (err) throw err;
            })
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `sukses read message ${idmsg}`
            })
        } else {
            return res.status(404).send({
                status: res.statusCode,
                code: respons.MsgNotFound,
                message: `Message not found`
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function delete_one_room(req, res) {
    try {
        let { idroom } = req.params;
        if (!idroom) return res.status(403).send({
            status: res.statusCode,
            code: respons.NeedParams,
            message: `Input Params`
        })
        let data = await Room.find({ _id: idroom });
        if (data) {
            Room.deleteOne({ _id: idroom }, function (err, res) {
                if (err) throw err;
            })
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `Sukses Delete Room : ${idroom}`
            })
        } else {
            return res.status(404).send({
                status: res.statusCode,
                code: respons.RoomNotFound,
                message: 'room not found'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function get_all_room(req, res) {
    try {
        let all = await Room.find({});
        if (Array.isArray(all) && all.length) {
            res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                result: all
            })
        } else {
            return res.status(404).send({
                status: res.statusCode,
                code: respons.RoomNotFound,
                message: 'room not found'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});  
    }
}

module.exports = {
    create_room_chat,
    send_message_chat,
    get_all_message_room,
    delete_message,
    mark_read,
    delete_one_room,
    get_all_room
}
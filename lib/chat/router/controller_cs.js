const { default: axios } = require("axios");
const { Admin } = require("../../../db/Admin");
const { respons, waApi, textCS, NoCs } = require("../../setting");
const { MsgCs } = require("../model/Message");
const Room2 = require("../model/Room");


async function page_cs(req, res) {
    try {
        if (req.user) {
            if (req.user.type == 'admin') {
                return res.status(403).send({
                    status: res.statusCode,
                    code: respons.ForbiddenReq,
                    message: `Endpoint ini untuk user dan wingman, jika ingin mengakses history chat cs melalui admin, menuju endpoint /history-cs/:room`
                })
            } else {
                let find = await MsgCs.findOne({ user_id: req.user._id });
                let allCS = await Admin.find({});
                let random = Math.floor(Math.random() * allCS.length);
                if (find) {
                    let findRoom = await Room2.findOne({ user: req.user._id });
                    if (findRoom) {
                        if (find.length == 2) {
                            let secMessage = await MsgCs.create({ chat_now: findRoom.target, cs_id: allCS[random]._id, user_id: req.user._id, room_id: create._id, text: textCS.textCsDua })
                        }
                        let findAgain = await MsgCs.find({ room_id: findRoom._id });
                        return res.status(200).send({
                            status: res.statusCode,
                            code: respons[200],
                            message: `Sukses Menampilkan Hisotry Chat User ( ${req.user.no_hp} ) dengan CS IAGORA`,
                            result: {
                                room: findRoom,
                                arrayMessage: findAgain
                            }
                        })
                    } else {
                        let create = await Room2.create({ user: req.user._id, target: allCS[random]._id });
                        let findAgain = await MsgCs.find({ room_id: findRoom._id });
                        return res.status(200).send({
                            status: res.statusCode,
                            code: respons[200],
                            message: `Sukses Membuat Room User ( ${req.user.no_hp} ) dengan CS IAGORA & Menampilkan History Chat`,
                            result: {
                                room: create,
                                arrayMessage: findAgain
                            }
                        })
                    }
    
                } else {
                    let findRoom = await Room2.findOne({ user: req.user._id })
                    if (!findRoom) {
                        let create = await Room2.create({ user: req.user._id, target: allCS[random]._id });
                        let firstMessage = await MsgCs.create({ chat_now: create.target, cs_id: allCS[random]._id, user_id: req.user._id, room_id: create._id, text: textCS.textAwal })
                        let findAgain = await MsgCs.find({ room_id: create._id });
                        return res.status(200).send({
                            status: res.statusCode,
                            code: respons[200],
                            message: `Sukses Membuat Room User ( ${req.user.no_hp} ) dengan CS IAGORA & Send Text Awal CS IAGORA`,
                            result: {
                                room: create,
                                arrayMessage: findAgain
                            }
                        })
                    } else {
                        let firstMessage = await MsgCs.create({ chat_now: findRoom.target, cs_id: allCS[random]._id, user_id: req.user._id, room_id: findRoom._id, text: textCS.textAwal })
                        let findAgain = await MsgCs.find({ room_id: findRoom._id });
                        return res.status(200).send({
                            status: res.statusCode,
                            code: respons[200],
                            message: `Sukses Mengirimkan Text awal CS IAGORA ke User : ( ${req.user.no_hp} )`,
                            result: {
                                room: findRoom,
                                arrayMessage: findAgain
                            }
                        })
                    }
                }
            }
        } else {
            return res.status(401).send({
                status: res.statusCode,
                code: respons.BothNotFound,
                message: `Login First ( WINGMAN/USER )`
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});    
    }
}

async function user_sendMessage(req, res) {
    try {
        if (req.user) {
            let { message } = req.body;
            if (!message) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedBody,
                message: "Input Body"
            })
            let findRoom = await Room2.findOne({ user: req.user._id });
            if (findRoom) {
                let up = await MsgCs.create({ chat_now: req.user._id, cs_id: findRoom.target, user_id: req.user._id, room_id: findRoom._id, text: message})
                let findAgain2 = await MsgCs.find({ room_id: findRoom._id });
                if (findAgain2.length == 2) {
                    let cr = await MsgCs.create({ chat_now: findRoom.target, cs_id: findRoom.target, user_id: req.user._id, room_id: findRoom._id, text: textCS.textCsDua })
                }
                console.log(findAgain2.length)
                let findAgain = await MsgCs.find({ room_id: findRoom._id });
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Mengirimkan Text awal CS IAGORA ke User : ( ${req.user.no_hp} )`,
                    result: {
                        room: findRoom,
                        arrayMessage: findAgain
                    }
                })
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.RoomNotFound,
                    message: `Room Tidak Ditemukan, Tidak bisa send Message`
                })
            }
        } else {
            return res.status(401).send({
                status: res.statusCode,
                code: respons.BothNotFound,
                message: `Login First ( WINGMAN/USER )`
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function cs_sendMessage(req, res) {
    try {
        if (req.user.type == 'admin') {
            let { message, user_id } = req.body;
            if (!message || !user_id) return res.status(403).send({
                status: res.statusCode,
                code: respons.NeedBody,
                message: "Input Body"
            })
            let findRoom = await Room2.findOne({ user: user_id });
            if (findRoom) {
                let up = await MsgCs.create({ chat_now: findRoom.target, cs_id: findRoom.target, user_id, room_id: findRoom._id, text: message })
                let findAgain = await MsgCs.find({ room_id: findRoom._id });
                return res.status(200).send({
                    status: res.statusCode,
                    code: respons[200],
                    message: `Sukses Mengirimkan Text awal CS IAGORA ke User : ( ${req.user.no_hp} )`,
                    result: {
                        room: findRoom,
                        arrayMessage: findAgain
                    }
                })
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    code: respons.RoomNotFound,
                    message: `Room Tidak Ditemukan, Tidak bisa send Message`
                })
            }

        } else {
            return res.status(403).send({
                status: res.statusCode,
                code: respons.AccessDenied,
                message: 'Access Denied'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function get_allmsg_room(req, res) {
    try {
        let { room } = req.params;
        let find = await MsgCs.find({ room_id: room });
        if (find) {
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `Sukses Menampilkan Array Message Room : ( ${room} )`,
                result: find
            })
        } else {
            return res.status(404).send({
                status: res.statusCode,
                code: respons.MsgNotFoundRoom,
                message: `Message di Room (${room}) Tidak Ditemukan`
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'});
    }
}

async function delete_One_msg(req, res) {
    try {
        if (req.user.type == 'admin') {
            let { id_msg, room } = req.params;
            let del = await MsgCs.deleteOne({ _id: id_msg })
            let findAgain = await MsgCs.find({ room_id: room });
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `Sukses Menghapus Message : ( ${id_msg} )`,
                result: findAgain
            })
        } else {
            return res.status(403).send({
                status: res.statusCode,
                code: respons.AccessDenied,
                message: 'Access Denied'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

async function delete_allmsg_room(req, res) {
    try {
        if (req.user.type == `admin`) {
            let { room } = req.params;
            MsgCs.deleteMany({ room_id: room }, function (err, res) {
                if (err) throw err;
            })
            return res.status(200).send({
                status: res.statusCode,
                code: respons[200],
                message: `Sukses Menghapus All Message di Room : ( ${room} )`
            })
        } else {
            return res.status(403).send({
                status: res.statusCode,
                code: respons.AccessDenied,
                message: 'Access Denied'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({status: res.statusCode, code: respons.InternalServerError, message: 'Internal Server Error'}); 
    }
}

module.exports = {
    page_cs,
    user_sendMessage,
    cs_sendMessage,
    get_allmsg_room,
    delete_One_msg,
    delete_allmsg_room
}